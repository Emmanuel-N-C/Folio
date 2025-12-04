package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.CommentResponse;
import com.folio.folio_backend.dto.CreateCommentRequest;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.*;
import com.folio.folio_backend.repository.CommentLikeRepository;
import com.folio.folio_backend.repository.CommentRepository;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.service.CommentService;
import com.folio.folio_backend.service.NotificationService;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CommentLikeRepository commentLikeRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public CommentResponse createComment(Long postId, CreateCommentRequest request) {
        User currentUser = userService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Comment comment = new Comment();
        comment.setContent(request.getContent());
        comment.setUser(currentUser);
        comment.setPost(post);
        comment.setParentComment(null);  // Top-level comment

        Comment savedComment = commentRepository.save(comment);

        // Create notification for post owner
        notificationService.createPostCommentNotification(postId, savedComment.getId(), currentUser.getId());

        return mapToCommentResponse(savedComment, currentUser.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getPostComments(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new ResourceNotFoundException("Post not found with id: " + postId);
        }

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated
        }

        // Get only top-level comments (no parent)
        List<Comment> comments = commentRepository.findTopLevelCommentsByPostId(postId);
        final Long userId = currentUserId;
        return comments.stream()
                .map(comment -> mapToCommentResponse(comment, userId))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, Long postId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        User currentUser = userService.getCurrentUser();

        // Get the post to check if user is post owner
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // Allow deletion if user is: comment author OR post owner OR admin
        boolean isCommentAuthor = comment.getUser().getId().equals(currentUser.getId());
        boolean isPostOwner = post.getPostedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().contains(Role.ROLE_ADMIN);

        if (!isCommentAuthor && !isPostOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }

    @Override
    @Transactional
    public CommentResponse updateComment(Long commentId, CreateCommentRequest request) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        User currentUser = userService.getCurrentUser();

        // Only the owner can edit their comment
        if (!comment.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to update this comment");
        }

        comment.setContent(request.getContent());
        Comment updatedComment = commentRepository.save(comment);
        return mapToCommentResponse(updatedComment, currentUser.getId());
    }

    @Override
    @Transactional
    public CommentResponse likeComment(Long commentId) {
        User currentUser = userService.getCurrentUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Check if already liked
        if (commentLikeRepository.existsByUserIdAndCommentId(currentUser.getId(), commentId)) {
            throw new BadRequestException("You have already liked this comment");
        }

        CommentLike like = new CommentLike();
        like.setUser(currentUser);
        like.setComment(comment);
        commentLikeRepository.save(like);

        // Create notification for comment owner
        notificationService.createCommentLikeNotification(commentId, currentUser.getId());

        return mapToCommentResponse(comment, currentUser.getId());
    }

    @Override
    @Transactional
    public CommentResponse unlikeComment(Long commentId) {
        User currentUser = userService.getCurrentUser();

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        CommentLike like = commentLikeRepository.findByUserIdAndCommentId(currentUser.getId(), commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found"));

        commentLikeRepository.delete(like);

        return mapToCommentResponse(comment, currentUser.getId());
    }

    @Override
    @Transactional
    public CommentResponse createReply(Long commentId, CreateCommentRequest request) {
        User currentUser = userService.getCurrentUser();

        Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        // Prevent replies to replies (one level deep only)
        if (parentComment.getParentComment() != null) {
            throw new BadRequestException("Cannot reply to a reply. Please reply to the original comment.");
        }

        Comment reply = new Comment();
        reply.setContent(request.getContent());
        reply.setUser(currentUser);
        reply.setPost(parentComment.getPost());
        reply.setParentComment(parentComment);

        Comment savedReply = commentRepository.save(reply);

        // Create notification for parent comment owner
        notificationService.createCommentReplyNotification(commentId, savedReply.getId(), currentUser.getId());

        return mapToCommentResponse(savedReply, currentUser.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public List<CommentResponse> getReplies(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("Comment not found with id: " + commentId);
        }

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated
        }

        List<Comment> replies = commentRepository.findRepliesByParentCommentId(commentId);
        final Long userId = currentUserId;
        return replies.stream()
                .map(reply -> mapToCommentResponse(reply, userId))
                .collect(Collectors.toList());
    }

    private CommentResponse mapToCommentResponse(Comment comment, Long currentUserId) {
        CommentResponse response = new CommentResponse();
        response.setId(comment.getId());
        response.setContent(comment.getContent());
        response.setUserId(comment.getUser().getId());
        response.setUsername(comment.getUser().getUsername());
        response.setUserProfileImageUrl(comment.getUser().getProfileImageUrl());
        response.setPostId(comment.getPost().getId());
        response.setParentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null);
        response.setLikesCount(comment.getLikesCount());
        response.setRepliesCount(comment.getRepliesCount());
        response.setCreatedAt(comment.getCreatedAt());
        response.setUpdatedAt(comment.getUpdatedAt());

        if (currentUserId != null) {
            response.setLikedByCurrentUser(
                    commentLikeRepository.existsByUserIdAndCommentId(currentUserId, comment.getId())
            );
        } else {
            response.setLikedByCurrentUser(false);
        }

        return response;
    }
}