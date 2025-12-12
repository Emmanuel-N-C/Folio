package com.folio.folio_backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.folio.folio_backend.dto.*;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.model.AuthProvider;
import com.folio.folio_backend.model.Role;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.security.GitHubTokenVerifier;
import com.folio.folio_backend.security.GoogleTokenVerifier;
import com.folio.folio_backend.security.JwtTokenProvider;
import com.folio.folio_backend.service.EmailService;
import com.folio.folio_backend.service.OAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class OAuthServiceImpl implements OAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    @Autowired
    private GitHubTokenVerifier gitHubTokenVerifier;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    private static final String CURRENT_TERMS_VERSION = "1.0";

    @Override
    public OAuthCheckResponse checkOAuthUser(OAuthCheckRequest request) {
        try {
            String email;
            String name;
            String profileImageUrl;
            String oauthId;
            AuthProvider provider;

            if ("google".equalsIgnoreCase(request.getProvider())) {
                // Verify Google ID token
                Payload payload = googleTokenVerifier.verifyToken(request.getToken());
                email = payload.getEmail();
                name = (String) payload.get("name");
                profileImageUrl = (String) payload.get("picture");
                oauthId = payload.getSubject();
                provider = AuthProvider.GOOGLE;
            } else if ("github".equalsIgnoreCase(request.getProvider())) {
                // Verify GitHub access token
                JsonNode userInfo = gitHubTokenVerifier.verifyTokenAndGetUserInfo(request.getToken());
                email = gitHubTokenVerifier.getPrimaryEmail(request.getToken());
                name = userInfo.has("name") && !userInfo.get("name").isNull()
                        ? userInfo.get("name").asText()
                        : userInfo.get("login").asText();
                profileImageUrl = userInfo.has("avatar_url") ? userInfo.get("avatar_url").asText() : null;
                oauthId = userInfo.get("id").asText();
                provider = AuthProvider.GITHUB;
            } else {
                throw new BadRequestException("Unsupported OAuth provider: " + request.getProvider());
            }

            // Check if user exists with this email AND provider combination
            Optional<User> existingUser = userRepository.findByEmailAndAuthProvider(
                    email.toLowerCase().trim(),
                    provider
            );

            return OAuthCheckResponse.builder()
                    .exists(existingUser.isPresent())
                    .email(email)
                    .name(name)
                    .profileImageUrl(profileImageUrl)
                    .suggestedUsername(generateUsernameFromEmail(email))
                    .build();

        } catch (Exception e) {
            throw new BadRequestException("Failed to verify OAuth token: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public OAuthResponse loginOAuthUser(OAuthLoginRequest request) {
        try {
            String email;
            String oauthId;
            AuthProvider provider = AuthProvider.valueOf(request.getProvider().toUpperCase());

            if ("google".equalsIgnoreCase(request.getProvider())) {
                Payload payload = googleTokenVerifier.verifyToken(request.getToken());
                email = payload.getEmail();
                oauthId = payload.getSubject();
            } else if ("github".equalsIgnoreCase(request.getProvider())) {
                JsonNode userInfo = gitHubTokenVerifier.verifyTokenAndGetUserInfo(request.getToken());
                email = gitHubTokenVerifier.getPrimaryEmail(request.getToken());
                oauthId = userInfo.get("id").asText();
            } else {
                throw new BadRequestException("Unsupported OAuth provider");
            }

            // Find user by email and provider
            User user = userRepository.findByEmailAndAuthProvider(email.toLowerCase().trim(), provider)
                    .orElseThrow(() -> new BadRequestException("User not found. Please register first."));

            // Update OAuth ID if it changed (rare but possible)
            if (!oauthId.equals(user.getOauthId())) {
                user.setOauthId(oauthId);
                userRepository.save(user);
            }

            // Generate JWT token
            String token = generateJwtToken(user);

            return OAuthResponse.builder()
                    .requiresOnboarding(!user.isOnboardingComplete())
                    .token(token)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .build();

        } catch (Exception e) {
            throw new BadRequestException("OAuth login failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public OAuthResponse registerOAuthUser(OAuthRegisterRequest request) {
        try {
            String email;
            String name;
            String profileImageUrl;
            String oauthId;
            AuthProvider provider = AuthProvider.valueOf(request.getProvider().toUpperCase());

            if ("google".equalsIgnoreCase(request.getProvider())) {
                Payload payload = googleTokenVerifier.verifyToken(request.getToken());
                email = payload.getEmail();
                name = (String) payload.get("name");
                profileImageUrl = (String) payload.get("picture");
                oauthId = payload.getSubject();
            } else if ("github".equalsIgnoreCase(request.getProvider())) {
                JsonNode userInfo = gitHubTokenVerifier.verifyTokenAndGetUserInfo(request.getToken());
                email = gitHubTokenVerifier.getPrimaryEmail(request.getToken());
                name = userInfo.has("name") && !userInfo.get("name").isNull()
                        ? userInfo.get("name").asText()
                        : userInfo.get("login").asText();
                profileImageUrl = userInfo.has("avatar_url") ? userInfo.get("avatar_url").asText() : null;
                oauthId = userInfo.get("id").asText();
            } else {
                throw new BadRequestException("Unsupported OAuth provider");
            }

            // Normalize username
            String normalizedUsername = request.getUsername().toLowerCase().trim();

            // Validate username
            if (!normalizedUsername.matches("^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$")) {
                throw new BadRequestException(
                        "Username must start with a letter, end with a letter or number, and cannot have consecutive special characters"
                );
            }

            // Check username availability
            if (userRepository.existsByUsername(normalizedUsername)) {
                throw new BadRequestException("Username is already taken");
            }

            // Check if email already exists WITH THIS PROVIDER
            Optional<User> existingUserWithProvider = userRepository.findByEmailAndAuthProvider(
                    email.toLowerCase().trim(),
                    provider
            );
            if (existingUserWithProvider.isPresent()) {
                throw new BadRequestException("An account with this email and provider already exists. Please login instead.");
            }

            // Check if email exists with a DIFFERENT provider
            Optional<User> existingUserDifferentProvider = userRepository.findByEmail(email.toLowerCase().trim());
            if (existingUserDifferentProvider.isPresent()) {
                User existingUser = existingUserDifferentProvider.get();
                throw new BadRequestException(
                        "This email is already registered with " + existingUser.getAuthProvider() +
                                ". Please use " + existingUser.getAuthProvider() + " to login."
                );
            }

            // Create new user
            User user = new User();
            user.setEmail(email.toLowerCase().trim());
            user.setUsername(normalizedUsername);
            user.setDisplayName(name);
            user.setProfileImageUrl(profileImageUrl);
            user.setAuthProvider(provider);
            user.setOauthId(oauthId);
            user.setVerified(true); // OAuth emails are pre-verified
            user.setOnboardingComplete(true);
            user.setPassword(""); // Empty string for OAuth users (will be handled by CustomUserDetailsService)

            Set<Role> roles = new HashSet<>();
            roles.add(Role.ROLE_USER);
            user.setRoles(roles);

            // Set Terms acceptance
            user.setTermsAccepted(true);
            user.setTermsAcceptedAt(LocalDateTime.now());
            user.setTermsVersion(CURRENT_TERMS_VERSION);

            userRepository.save(user);

            // Send welcome email
            try {
                emailService.sendWelcomeEmail(user);
            } catch (Exception e) {
                // Log error but don't fail registration
                System.err.println("Failed to send welcome email: " + e.getMessage());
            }

            // Generate JWT token
            String token = generateJwtToken(user);

            return OAuthResponse.builder()
                    .requiresOnboarding(false)
                    .token(token)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .build();

        } catch (BadRequestException e) {
            // Re-throw BadRequestException as-is
            throw e;
        } catch (Exception e) {
            throw new BadRequestException("OAuth registration failed: " + e.getMessage());
        }
    }

    @Override
    public GitHubTokenResponse exchangeGitHubCode(GitHubCodeExchangeRequest request) {
        try {
            String accessToken = gitHubTokenVerifier.exchangeCodeForToken(request.getCode(), request.getRedirectUri());

            return GitHubTokenResponse.builder()
                    .accessToken(accessToken)
                    .build();

        } catch (Exception e) {
            throw new BadRequestException("Failed to exchange GitHub code: " + e.getMessage());
        }
    }

    private String generateJwtToken(User user) {
        // Create a UserDetails object from the User entity
        // Use a non-empty password placeholder for OAuth users
        String password = (user.getPassword() == null || user.getPassword().trim().isEmpty())
                ? "OAUTH_USER_NO_PASSWORD"
                : user.getPassword();

        UserDetails userDetails = org.springframework.security.core.userdetails.User.builder()
                .username(user.getUsername())
                .password(password)
                .authorities(user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.name()))
                        .collect(Collectors.toList()))
                .build();

        // Create Authentication with UserDetails as principal
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                userDetails,  // Principal must be UserDetails
                null,         // Credentials
                userDetails.getAuthorities()  // Authorities
        );

        return jwtTokenProvider.generateToken(authentication);
    }

    private String generateUsernameFromEmail(String email) {
        String username = email.split("@")[0]
                .replaceAll("[^a-zA-Z0-9._-]", "")
                .toLowerCase();

        // Ensure it starts with a letter
        if (!username.matches("^[a-z].*")) {
            username = "user" + username;
        }

        // Ensure it's within length limits
        if (username.length() > 20) {
            username = username.substring(0, 20);
        }
        if (username.length() < 3) {
            username = username + "123";
        }

        // Remove trailing special characters
        username = username.replaceAll("[._-]+$", "");

        return username;
    }
}