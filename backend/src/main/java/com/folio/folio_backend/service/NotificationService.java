package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.NotificationResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationService {

    void createPostLikeNotification(Long postId, Long actorId);

    void createPostCommentNotification(Long postId, Long commentId, Long actorId);

    void createCommentReplyNotification(Long commentId, Long replyId, Long actorId);

    void createCommentLikeNotification(Long commentId, Long actorId);

    Page<NotificationResponse> getUserNotifications(Long userId, Pageable pageable);

    long getUnreadCount(Long userId);

    void markAsRead(Long notificationId, Long userId);

    void markAllAsRead(Long userId);
}