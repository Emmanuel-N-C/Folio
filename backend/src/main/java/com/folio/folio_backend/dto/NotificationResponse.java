package com.folio.folio_backend.dto;

import com.folio.folio_backend.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private String type;
    private boolean read;
    private LocalDateTime createdAt;

    // Actor (person who performed the action)
    private ActorInfo actor;

    // Related content
    private Long postId;
    private String postTitle;
    private Long commentId;
    private String commentContent;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActorInfo {
        private Long id;
        private String username;
        private String profileImageUrl;
    }

    public static NotificationResponse fromNotification(Notification notification) {
        NotificationResponse response = new NotificationResponse();
        response.setId(notification.getId());
        response.setType(notification.getType().name());
        response.setRead(notification.isRead());
        response.setCreatedAt(notification.getCreatedAt());

        // Actor info
        ActorInfo actor = new ActorInfo();
        actor.setId(notification.getActor().getId());
        actor.setUsername(notification.getActor().getUsername());
        actor.setProfileImageUrl(notification.getActor().getProfileImageUrl());
        response.setActor(actor);

        // Post info
        if (notification.getPost() != null) {
            response.setPostId(notification.getPost().getId());
            response.setPostTitle(notification.getPost().getTitle());
        }

        // Comment info
        if (notification.getComment() != null) {
            response.setCommentId(notification.getComment().getId());
            response.setCommentContent(notification.getComment().getContent());
        }

        return response;
    }
}