package com.folio.folio_backend.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.folio.folio_backend.dto.OAuthRegisterRequest;
import com.folio.folio_backend.dto.OAuthResponse;
import com.folio.folio_backend.dto.OAuthUserInfo;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.model.AuthProvider;
import com.folio.folio_backend.model.Role;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.security.JwtTokenProvider;
import com.folio.folio_backend.service.EmailService;
import com.folio.folio_backend.service.OAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class OAuthServiceImpl implements OAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private EmailService emailService;

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String googleClientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String googleRedirectUri;

    @Value("${spring.security.oauth2.client.registration.github.client-id}")
    private String githubClientId;

    @Value("${spring.security.oauth2.client.registration.github.client-secret}")
    private String githubClientSecret;

    @Value("${spring.security.oauth2.client.registration.github.redirect-uri}")
    private String githubRedirectUri;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // Temporary storage for OAuth sessions (use Redis in production)
    private final Map<String, OAuthUserInfo> oauthSessions = new ConcurrentHashMap<>();

    @Override
    public String exchangeCodeForToken(String code, String provider) {
        try {
            if ("google".equalsIgnoreCase(provider)) {
                return exchangeGoogleCodeForToken(code);
            } else if ("github".equalsIgnoreCase(provider)) {
                return exchangeGitHubCodeForToken(code);
            } else {
                throw new BadRequestException("Unsupported OAuth provider: " + provider);
            }
        } catch (Exception e) {
            throw new BadRequestException("Failed to exchange code for token: " + e.getMessage());
        }
    }

    private String exchangeGoogleCodeForToken(String code) throws Exception {
        String tokenUrl = "https://oauth2.googleapis.com/token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", googleClientId);
        params.add("client_secret", googleClientSecret);
        params.add("redirect_uri", googleRedirectUri);
        params.add("grant_type", "authorization_code");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("access_token").asText();
    }

    private String exchangeGitHubCodeForToken(String code) throws Exception {
        String tokenUrl = "https://github.com/login/oauth/access_token";

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("code", code);
        params.add("client_id", githubClientId);
        params.add("client_secret", githubClientSecret);
        params.add("redirect_uri", githubRedirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(params, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(tokenUrl, request, String.class);

        JsonNode jsonNode = objectMapper.readTree(response.getBody());
        return jsonNode.get("access_token").asText();
    }

    @Override
    public OAuthUserInfo getGoogleUserInfo(String accessToken) {
        try {
            String userInfoUrl = "https://www.googleapis.com/oauth2/v2/userinfo";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    userInfoUrl,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            String email = jsonNode.get("email").asText();
            String name = jsonNode.has("name") ? jsonNode.get("name").asText() : email.split("@")[0];
            String profileImageUrl = jsonNode.has("picture") ? jsonNode.get("picture").asText() : null;
            String oauthId = jsonNode.get("id").asText();

            return OAuthUserInfo.builder()
                    .oauthId(oauthId)
                    .email(email.toLowerCase().trim())
                    .name(name)
                    .profileImageUrl(profileImageUrl)
                    .provider("GOOGLE")
                    .suggestedUsername(generateUsernameFromEmail(email))
                    .build();
        } catch (Exception e) {
            throw new BadRequestException("Failed to fetch Google user info: " + e.getMessage());
        }
    }

    @Override
    public OAuthUserInfo getGitHubUserInfo(String accessToken) {
        try {
            String userInfoUrl = "https://api.github.com/user";

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            headers.set("Accept", "application/vnd.github.v3+json");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    userInfoUrl,
                    HttpMethod.GET,
                    entity,
                    String.class
            );

            JsonNode jsonNode = objectMapper.readTree(response.getBody());

            String oauthId = jsonNode.get("id").asText();
            String name = jsonNode.has("name") && !jsonNode.get("name").isNull()
                    ? jsonNode.get("name").asText()
                    : jsonNode.get("login").asText();
            String profileImageUrl = jsonNode.has("avatar_url") ? jsonNode.get("avatar_url").asText() : null;
            String githubUsername = jsonNode.get("login").asText();

            // GitHub doesn't always provide email in user endpoint, fetch from emails endpoint
            String email = getGitHubPrimaryEmail(accessToken);

            return OAuthUserInfo.builder()
                    .oauthId(oauthId)
                    .email(email.toLowerCase().trim())
                    .name(name)
                    .profileImageUrl(profileImageUrl)
                    .provider("GITHUB")
                    .suggestedUsername(generateUsernameFromGitHub(githubUsername))
                    .build();
        } catch (Exception e) {
            throw new BadRequestException("Failed to fetch GitHub user info: " + e.getMessage());
        }
    }

    private String getGitHubPrimaryEmail(String accessToken) throws Exception {
        String emailUrl = "https://api.github.com/user/emails";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.set("Accept", "application/vnd.github.v3+json");

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                emailUrl,
                HttpMethod.GET,
                entity,
                String.class
        );

        JsonNode emails = objectMapper.readTree(response.getBody());

        // Find primary verified email
        for (JsonNode emailNode : emails) {
            if (emailNode.get("primary").asBoolean() && emailNode.get("verified").asBoolean()) {
                return emailNode.get("email").asText();
            }
        }

        // Fallback to first verified email
        for (JsonNode emailNode : emails) {
            if (emailNode.get("verified").asBoolean()) {
                return emailNode.get("email").asText();
            }
        }

        throw new BadRequestException("No verified email found for GitHub account");
    }

    @Override
    @Transactional
    public OAuthResponse handleOAuthCallback(OAuthUserInfo oauthUserInfo) {
        String email = oauthUserInfo.getEmail();
        AuthProvider provider = AuthProvider.valueOf(oauthUserInfo.getProvider());

        // Check if user exists with this email
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Check if email is registered with password (LOCAL)
            if (user.getAuthProvider() == AuthProvider.LOCAL) {
                throw new BadRequestException(
                        "This email is already registered with email/password. Please login with your password."
                );
            }

            // Check if registered with different OAuth provider
            if (user.getAuthProvider() != provider) {
                throw new BadRequestException(
                        "This email is already registered with " + user.getAuthProvider() + ". Please use that provider to login."
                );
            }

            // Existing OAuth user - login directly
            if (!user.isOnboardingComplete() || user.getUsername() == null) {
                // Onboarding not complete, redirect to username selection
                String oauthToken = generateOAuthToken();
                oauthSessions.put(oauthToken, oauthUserInfo);

                return OAuthResponse.builder()
                        .requiresOnboarding(true)
                        .oauthToken(oauthToken)
                        .suggestedUsername(oauthUserInfo.getSuggestedUsername())
                        .email(email)
                        .name(oauthUserInfo.getName())
                        .profileImageUrl(oauthUserInfo.getProfileImageUrl())
                        .build();
            }

            // Complete user - generate JWT and login
            String token = generateJwtToken(user);

            return OAuthResponse.builder()
                    .requiresOnboarding(false)
                    .token(token)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .build();
        }

        // New user - requires onboarding
        String oauthToken = generateOAuthToken();
        oauthSessions.put(oauthToken, oauthUserInfo);

        return OAuthResponse.builder()
                .requiresOnboarding(true)
                .oauthToken(oauthToken)
                .suggestedUsername(oauthUserInfo.getSuggestedUsername())
                .email(email)
                .name(oauthUserInfo.getName())
                .profileImageUrl(oauthUserInfo.getProfileImageUrl())
                .build();
    }

    @Override
    @Transactional
    public OAuthResponse completeOAuthRegistration(OAuthRegisterRequest request) {
        // Retrieve OAuth session
        OAuthUserInfo oauthUserInfo = oauthSessions.get(request.getOauthToken());
        if (oauthUserInfo == null) {
            throw new BadRequestException("Invalid or expired OAuth session");
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

        // Check if user already exists by email
        Optional<User> existingUser = userRepository.findByEmail(oauthUserInfo.getEmail());

        User user;
        if (existingUser.isPresent()) {
            // Update existing user with username
            user = existingUser.get();
            user.setUsername(normalizedUsername);
            user.setOnboardingComplete(true);
        } else {
            // Create new user
            user = new User();
            user.setEmail(oauthUserInfo.getEmail());
            user.setUsername(normalizedUsername);
            user.setDisplayName(oauthUserInfo.getName());
            user.setProfileImageUrl(oauthUserInfo.getProfileImageUrl());
            user.setAuthProvider(AuthProvider.valueOf(oauthUserInfo.getProvider()));
            user.setOauthId(oauthUserInfo.getOauthId());
            user.setVerified(true); // OAuth emails are pre-verified
            user.setOnboardingComplete(true);
            user.setPassword(null); // No password for OAuth users

            // Set default role
            Set<Role> roles = new HashSet<>();
            roles.add(Role.ROLE_USER);
            user.setRoles(roles);
        }

        userRepository.save(user);

        // Remove OAuth session
        oauthSessions.remove(request.getOauthToken());

        // Send welcome email
        emailService.sendWelcomeEmail(user);

        // Generate JWT token
        String token = generateJwtToken(user);

        return OAuthResponse.builder()
                .requiresOnboarding(false)
                .token(token)
                .userId(user.getId())
                .username(user.getUsername())
                .build();
    }

    private String generateJwtToken(User user) {
        Authentication authentication = new UsernamePasswordAuthenticationToken(
                user.getUsername(),
                null,
                user.getRoles().stream()
                        .map(role -> new SimpleGrantedAuthority(role.name()))
                        .collect(Collectors.toList())
        );
        return jwtTokenProvider.generateToken(authentication);
    }

    private String generateOAuthToken() {
        return UUID.randomUUID().toString();
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

        return username;
    }

    private String generateUsernameFromGitHub(String githubUsername) {
        String username = githubUsername
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

        return username;
    }
}