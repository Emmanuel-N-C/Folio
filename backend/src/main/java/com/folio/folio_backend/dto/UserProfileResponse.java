package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String displayName;
    private String email;
    private String bio;
    private String profileImageUrl;
    private String githubUrl;
    private String websiteUrl;
    private String location;
    private String profession;
    private LocalDateTime createdAt;
    private int postsCount;
}