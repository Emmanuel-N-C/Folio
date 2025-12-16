package com.folio.folio_backend.websocket;

import com.folio.folio_backend.dto.NotificationResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class WebSocketNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketNotificationService.class);

    @Autowired
    private WebSocketHandler webSocketHandler;

    public void sendNotificationToUser(Long userId, NotificationResponse notification) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("type", "notification");
            message.put("data", notification);

            webSocketHandler.sendToUser(userId, message);
            logger.debug("Notification sent to user: userId={}, type={}", userId, notification.getType());
        } catch (Exception e) {
            logger.error("Error sending notification to user: userId={}", userId, e);
        }
    }

    public void sendUnreadCountToUser(Long userId, long count) {
        try {
            Map<String, Object> message = new HashMap<>();
            message.put("type", "unread_count");
            message.put("count", count);

            webSocketHandler.sendToUser(userId, message);
            logger.debug("Unread count sent to user: userId={}, count={}", userId, count);
        } catch (Exception e) {
            logger.error("Error sending unread count to user: userId={}", userId, e);
        }
    }
}