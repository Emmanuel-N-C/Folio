package com.folio.folio_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private String content;
    private Long userId;
    private String username;
    private String displayName;
    private String userProfileImageUrl;
    private Long postId;
    private Long parentCommentId;  // null for top-level comments
    private int likesCount;
    private int repliesCount;
    private boolean likedByCurrentUser;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

