package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private Long id;
    private String title;
    private String description;
    private String techStack;
    private String liveDemoUrl;
    private String githubUrl;
    private List<String> screenshotUrls = new ArrayList<>();
    private List<String> tags = new ArrayList<>();
    private Long userId;
    private String username;
    private String displayName;
    private String userProfileImageUrl;
    private int likesCount;
    private int commentsCount;
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

