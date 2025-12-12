package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.*;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.model.AuthProvider;
import com.folio.folio_backend.model.Role;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.security.JwtTokenProvider;
import com.folio.folio_backend.service.AuthService;
import com.folio.folio_backend.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final String CURRENT_TERMS_VERSION = "1.0";

    @Override
    @Transactional
    public MessageResponse register(RegisterRequest request) {
        // Normalize username and email to lowercase
        String normalizedUsername = request.getUsername().toLowerCase().trim();
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        // Additional validation for username format
        if (normalizedUsername.contains(" ")) {
            throw new BadRequestException("Username cannot contain spaces");
        }

        // Validate username pattern after normalization
        if (!normalizedUsername.matches("^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$")) {
            throw new BadRequestException("Username must start with a letter, end with a letter or number, and cannot have consecutive special characters");
        }

        // Check username availability (case-insensitive)
        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new BadRequestException("Username is already taken");
        }

        // Check if email exists
        Optional<User> existingUser = userRepository.findByEmail(normalizedEmail);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // If user is verified, email is already in use
            if (user.isVerified()) {
                throw new BadRequestException("Email is already in use.");
            }

            // If user exists but not verified, regenerate verification code
            String verificationCode = generateVerificationCode();
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);

            // Send new verification email
            emailService.sendVerificationEmail(user);

            return new MessageResponse("Email already exists but is not verified. A new verification code has been sent.");
        }

        // Create new user
        User user = new User();
        user.setUsername(normalizedUsername);
        user.setEmail(normalizedEmail);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerified(false);
        user.setAuthProvider(AuthProvider.LOCAL); // Set auth provider to LOCAL
        user.setOnboardingComplete(true); // Email/password users complete onboarding immediately

        // Generate verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10));

        // Set default role (USER only, not ADMIN)
        Set<Role> roles = new HashSet<>();
        roles.add(Role.ROLE_USER);
        user.setRoles(roles);

        // Set Terms acceptance
        user.setTermsAccepted(true);
        user.setTermsAcceptedAt(LocalDateTime.now());
        user.setTermsVersion(CURRENT_TERMS_VERSION);

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user);

        return new MessageResponse("Verification email sent. Please check your inbox.");
    }

    @Override
    @Transactional
    public MessageResponse verifyEmail(VerifyEmailRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadRequestException("User not found"));

        // Check if already verified
        if (user.isVerified()) {
            return new MessageResponse("User already verified.");
        }

        // Check if code matches
        if (!request.getCode().equals(user.getVerificationCode())) {
            throw new BadRequestException("Invalid verification code");
        }

        // Check if code is expired
        if (user.getVerificationCodeExpiration().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification code expired. Request a new one.");
        }

        // Verify user
        user.setVerified(true);
        user.setVerificationCode(null);
        user.setVerificationCodeExpiration(null);
        userRepository.save(user);

        // Send welcome email after successful verification
        emailService.sendWelcomeEmail(user);

        return new MessageResponse("Email verified successfully. You can now log in.");
    }

    @Override
    @Transactional
    public MessageResponse resendVerification(ResendVerificationRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);

        // For security, always return the same message
        if (!userOptional.isPresent()) {
            return new MessageResponse("If this account exists, a new verification code has been sent.");
        }

        User user = userOptional.get();

        // Check if already verified
        if (user.isVerified()) {
            return new MessageResponse("User already verified.");
        }

        // Generate new verification code
        String verificationCode = generateVerificationCode();
        user.setVerificationCode(verificationCode);
        user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(user);

        return new MessageResponse("If this account exists, a new verification code has been sent.");
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Find user case-insensitively
        User user = userRepository.findByUsernameOrEmailIgnoreCase(request.getUsernameOrEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

        // Check if user is verified (skip for ADMIN role)
        if (!user.isVerified() && !user.getRoles().contains(Role.ROLE_ADMIN)) {
            // Generate new verification code
            String verificationCode = generateVerificationCode();
            user.setVerificationCode(verificationCode);
            user.setVerificationCodeExpiration(LocalDateTime.now().plusMinutes(10));
            userRepository.save(user);

            // Send verification email
            emailService.sendVerificationEmail(user);

            throw new BadRequestException("Account not verified. A new verification code has been sent to your email.");
        }

        // Check if this is an OAuth user trying to login with password
        if (user.getAuthProvider() != null && user.getAuthProvider() != AuthProvider.LOCAL) {
            throw new BadRequestException("This account is registered with " + user.getAuthProvider() + ". Please use " + user.getAuthProvider() + " to login.");
        }

        // Authenticate using the stored username (lowercase)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        user.getUsername(), // Stored lowercase username
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }

    @Override
    @Transactional
    public MessageResponse forgotPassword(ForgotPasswordRequest request) {
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        Optional<User> userOptional = userRepository.findByEmail(normalizedEmail);

        // Always return the same message for security
        if (!userOptional.isPresent()) {
            return new MessageResponse("If this account exists, a password reset link has been sent.");
        }

        User user = userOptional.get();

        // Check if this is an OAuth user
        if (user.getAuthProvider() != null && user.getAuthProvider() != AuthProvider.LOCAL) {
            return new MessageResponse("If this account exists, a password reset link has been sent.");
        }

        // Generate password reset token
        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetTokenExpiration(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user);

        return new MessageResponse("If this account exists, a password reset link has been sent.");
    }

    @Override
    @Transactional
    public MessageResponse resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findAll().stream()
                .filter(u -> request.getToken().equals(u.getPasswordResetToken()))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        // Check if token is expired
        if (user.getPasswordResetTokenExpiration().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Invalid or expired reset token");
        }

        // Update password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiration(null);
        userRepository.save(user);

        return new MessageResponse("Password reset successfully. You can now log in with your new password.");
    }

    /**
     * Generate a 6-digit verification code
     */
    private String generateVerificationCode() {
        int code = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(code);
    }
}