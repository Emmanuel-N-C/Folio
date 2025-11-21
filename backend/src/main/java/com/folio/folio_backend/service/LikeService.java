package com.folio.folio_backend.service;

public interface LikeService {
    void likePost(Long postId);
    void unlikePost(Long postId);
    boolean isPostLikedByUser(Long postId, Long userId);
    int getLikesCount(Long postId);
}

