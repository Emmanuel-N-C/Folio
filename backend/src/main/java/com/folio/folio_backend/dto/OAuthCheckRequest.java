package com.folio.folio_backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthCheckRequest {
    @NotBlank(message = "Token is required")
    private String token;

    @NotBlank(message = "Provider is required")
    private String provider; // "google" or "github"
}