package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthResponse {
    private boolean requiresOnboarding;
    private String oauthToken; // Temporary token for onboarding
    private String suggestedUsername;
    private String email;
    private String name;
    private String profileImageUrl;

    // If onboarding not required, return auth token
    private String token;
    private Long userId;
    private String username;
}