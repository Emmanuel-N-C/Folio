package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.CommentResponse;
import com.folio.folio_backend.dto.CreateCommentRequest;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long postId, CreateCommentRequest request);
    List<CommentResponse> getPostComments(Long postId);
    void deleteComment(Long commentId);
    CommentResponse updateComment(Long commentId, CreateCommentRequest request);
}

