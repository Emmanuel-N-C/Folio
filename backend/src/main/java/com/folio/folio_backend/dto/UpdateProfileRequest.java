package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {
    private String displayName;
    private String username;
    private String bio;
    private String profileImageUrl;
    private String githubUrl;
    private String websiteUrl;
    private String location;
    private String profession;
}