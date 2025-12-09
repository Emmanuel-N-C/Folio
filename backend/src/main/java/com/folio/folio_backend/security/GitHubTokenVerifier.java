package com.folio.folio_backend.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class GitHubTokenVerifier {

    @Value("${oauth.github.client-id}")
    private String githubClientId;

    @Value("${oauth.github.client-secret}")
    private String githubClientSecret;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Exchange GitHub authorization code for access token (SERVER-SIDE - SECURE)
     */
    public String exchangeCodeForToken(String code, String redirectUri) throws Exception {
        String tokenUrl = "https://github.com/login/oauth/access_token";

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("client_id", githubClientId);
        requestBody.put("client_secret", githubClientSecret);
        requestBody.put("code", code);
        requestBody.put("redirect_uri", redirectUri);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Accept", "application/json");

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<String> response = restTemplate.exchange(
                tokenUrl,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new IllegalArgumentException("Failed to exchange GitHub code for token");
        }

        JsonNode responseJson = objectMapper.readTree(response.getBody());

        if (responseJson.has("error")) {
            throw new IllegalArgumentException("GitHub OAuth error: " + responseJson.get("error_description").asText());
        }

        String accessToken = responseJson.get("access_token").asText();

        if (accessToken == null || accessToken.isEmpty()) {
            throw new IllegalArgumentException("No access token received from GitHub");
        }

        return accessToken;
    }

    /**
     * Verify GitHub access token and return user info
     */
    public JsonNode verifyTokenAndGetUserInfo(String accessToken) throws Exception {
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

        if (response.getStatusCode() != HttpStatus.OK) {
            throw new IllegalArgumentException("Invalid GitHub access token");
        }

        return objectMapper.readTree(response.getBody());
    }

    /**
     * Get primary verified email from GitHub
     */
    public String getPrimaryEmail(String accessToken) throws Exception {
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

        throw new IllegalArgumentException("No verified email found for GitHub account");
    }
}