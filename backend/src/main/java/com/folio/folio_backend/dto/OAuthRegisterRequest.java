package com.folio.folio_backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OAuthRegisterRequest {
    @NotBlank(message = "Token is required")
    private String token; // ID token from Google or access token from GitHub

    @NotBlank(message = "Provider is required")
    private String provider; // "google" or "github"

    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(
            regexp = "^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$",
            message = "Username must start with a letter, end with a letter or number, and cannot have consecutive special characters"
    )
    private String username;
}