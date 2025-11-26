package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.CommentResponse;
import com.folio.folio_backend.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long postId, CreateCommentRequest request);
    List<CommentResponse> getPostComments(Long postId);
    void deleteComment(Long commentId, Long postId);  // Added postId parameter
    CommentResponse updateComment(Long commentId, CreateCommentRequest request);
    
    // New methods for likes
    CommentResponse likeComment(Long commentId);
    CommentResponse unlikeComment(Long commentId);
    
    // New methods for replies
    CommentResponse createReply(Long commentId, CreateCommentRequest request);
    List<CommentResponse> getReplies(Long commentId);
}

