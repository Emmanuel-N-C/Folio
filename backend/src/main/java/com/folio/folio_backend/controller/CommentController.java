package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.CommentResponse;
import com.folio.folio_backend.dto.CreateCommentRequest;
import com.folio.folio_backend.dto.MessageResponse;
import com.folio.folio_backend.service.CommentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@CrossOrigin(origins = "*", maxAge = 3600)
public class CommentController {
    
    @Autowired
    private CommentService commentService;
    
    @PostMapping
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createComment(postId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    @GetMapping
    public ResponseEntity<List<CommentResponse>> getPostComments(@PathVariable Long postId) {
        List<CommentResponse> response = commentService.getPostComments(postId);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{commentId}")
    public ResponseEntity<MessageResponse> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId) {
        commentService.deleteComment(commentId, postId);
        return ResponseEntity.ok(new MessageResponse("Comment deleted successfully"));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.updateComment(commentId, request);
        return ResponseEntity.ok(response);
    }
    
    // Like a comment
    @PostMapping("/{commentId}/like")
    public ResponseEntity<CommentResponse> likeComment(@PathVariable Long commentId) {
        CommentResponse response = commentService.likeComment(commentId);
        return ResponseEntity.ok(response);
    }
    
    // Unlike a comment
    @DeleteMapping("/{commentId}/like")
    public ResponseEntity<CommentResponse> unlikeComment(@PathVariable Long commentId) {
        CommentResponse response = commentService.unlikeComment(commentId);
        return ResponseEntity.ok(response);
    }
    
    // Reply to a comment
    @PostMapping("/{commentId}/replies")
    public ResponseEntity<CommentResponse> createReply(
            @PathVariable Long commentId,
            @Valid @RequestBody CreateCommentRequest request) {
        CommentResponse response = commentService.createReply(commentId, request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    // Get replies to a comment
    @GetMapping("/{commentId}/replies")
    public ResponseEntity<List<CommentResponse>> getReplies(@PathVariable Long commentId) {
        List<CommentResponse> response = commentService.getReplies(commentId);
        return ResponseEntity.ok(response);
    }
}

