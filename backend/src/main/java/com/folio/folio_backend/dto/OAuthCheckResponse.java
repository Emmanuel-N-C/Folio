package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OAuthCheckResponse {
    private boolean exists;
    private String email;
    private String name;
    private String profileImageUrl;
    private String suggestedUsername;
}