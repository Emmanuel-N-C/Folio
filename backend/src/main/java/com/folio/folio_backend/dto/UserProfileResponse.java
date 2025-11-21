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
    private String email;
    private String bio;
    private String profileImageUrl;
    private String githubUrl;
    private String websiteUrl;
    private LocalDateTime createdAt;
    private int postsCount;
}

