package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthUserInfo {
    private String oauthId;
    private String email;
    private String name;
    private String profileImageUrl;
    private String provider; // "GOOGLE" or "GITHUB"
    private String suggestedUsername;
}