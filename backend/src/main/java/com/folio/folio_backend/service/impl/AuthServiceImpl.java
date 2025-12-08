package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.AuthResponse;
import com.folio.folio_backend.dto.LoginRequest;
import com.folio.folio_backend.dto.RegisterRequest;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.model.Role;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.security.JwtTokenProvider;
import com.folio.folio_backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

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

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
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

        // Check email availability (case-insensitive)
        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new BadRequestException("Email is already in use");
        }

        User user = new User();
        user.setUsername(normalizedUsername); // Store as lowercase
        user.setEmail(normalizedEmail); // Store as lowercase
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Set<Role> roles = new HashSet<>();
        roles.add(Role.ROLE_USER);
        user.setRoles(roles);

        userRepository.save(user);

        // Authenticate with normalized username
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(normalizedUsername, request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtTokenProvider.generateToken(authentication);

        return new AuthResponse(token, user.getId(), user.getUsername(), user.getEmail(), user.getRoles());
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Find user case-insensitively
        User user = userRepository.findByUsernameOrEmailIgnoreCase(request.getUsernameOrEmail())
                .orElseThrow(() -> new BadRequestException("Invalid credentials"));

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
}