package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.NotificationResponse;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.Comment;
import com.folio.folio_backend.model.Notification;
import com.folio.folio_backend.model.Post;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.CommentRepository;
import com.folio.folio_backend.repository.NotificationRepository;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.service.NotificationService;
import com.folio.folio_backend.websocket.WebSocketNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WebSocketNotificationService webSocketNotificationService;

    @Override
    @Transactional
    public void createPostLikeNotification(Long postId, Long actorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (post.getPostedBy().getId().equals(actorId)) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(post.getPostedBy());
        notification.setActor(actor);
        notification.setType(Notification.NotificationType.POST_LIKE);
        notification.setPost(post);

        notification = notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.fromNotification(notification);
        webSocketNotificationService.sendNotificationToUser(post.getPostedBy().getId(), response);

        long unreadCount = getUnreadCount(post.getPostedBy().getId());
        webSocketNotificationService.sendUnreadCountToUser(post.getPostedBy().getId(), unreadCount);
    }

    @Override
    @Transactional
    public void createPostCommentNotification(Long postId, Long commentId, Long actorId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (post.getPostedBy().getId().equals(actorId)) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(post.getPostedBy());
        notification.setActor(actor);
        notification.setType(Notification.NotificationType.POST_COMMENT);
        notification.setPost(post);
        notification.setComment(comment);

        notification = notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.fromNotification(notification);
        webSocketNotificationService.sendNotificationToUser(post.getPostedBy().getId(), response);

        long unreadCount = getUnreadCount(post.getPostedBy().getId());
        webSocketNotificationService.sendUnreadCountToUser(post.getPostedBy().getId(), unreadCount);
    }

    @Override
    @Transactional
    public void createCommentReplyNotification(Long commentId, Long replyId, Long actorId) {
        Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        Comment reply = commentRepository.findById(replyId)
                .orElseThrow(() -> new ResourceNotFoundException("Reply not found"));

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (parentComment.getUser().getId().equals(actorId)) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(parentComment.getUser());
        notification.setActor(actor);
        notification.setType(Notification.NotificationType.COMMENT_REPLY);
        notification.setPost(parentComment.getPost());
        notification.setComment(reply);

        notification = notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.fromNotification(notification);
        webSocketNotificationService.sendNotificationToUser(parentComment.getUser().getId(), response);

        long unreadCount = getUnreadCount(parentComment.getUser().getId());
        webSocketNotificationService.sendUnreadCountToUser(parentComment.getUser().getId(), unreadCount);
    }

    @Override
    @Transactional
    public void createCommentLikeNotification(Long commentId, Long actorId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (comment.getUser().getId().equals(actorId)) {
            return;
        }

        Notification notification = new Notification();
        notification.setRecipient(comment.getUser());
        notification.setActor(actor);
        notification.setType(Notification.NotificationType.COMMENT_LIKE);
        notification.setPost(comment.getPost());
        notification.setComment(comment);

        notification = notificationRepository.save(notification);

        NotificationResponse response = NotificationResponse.fromNotification(notification);
        webSocketNotificationService.sendNotificationToUser(comment.getUser().getId(), response);

        long unreadCount = getUnreadCount(comment.getUser().getId());
        webSocketNotificationService.sendUnreadCountToUser(comment.getUser().getId(), unreadCount);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable) {
        Page<Notification> notifications = notificationRepository.findByRecipientIdWithDetails(userId, pageable);
        return notifications.map(NotificationResponse::fromNotification);
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepository.countUnreadByRecipientId(userId);
    }

    @Override
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        notificationRepository.markAsRead(notificationId, userId);

        long unreadCount = getUnreadCount(userId);
        webSocketNotificationService.sendUnreadCountToUser(userId, unreadCount);
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadByRecipientId(userId);
        webSocketNotificationService.sendUnreadCountToUser(userId, 0);
    }
}