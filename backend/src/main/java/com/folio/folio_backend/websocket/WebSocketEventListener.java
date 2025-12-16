package com.folio.folio_backend.websocket;

import com.folio.folio_backend.model.User;
import com.folio.folio_backend.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired
    private WebSocketSessionManager sessionManager;

    @Autowired
    private UserService userService;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getUser() instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) headerAccessor.getUser();
            String username = auth.getName();
            String sessionId = headerAccessor.getSessionId();

            try {
                User user = userService.getUserByUsername(username);
                sessionManager.addSession(user.getId(), sessionId);
                logger.info("WebSocket connected: user={}, session={}", username, sessionId);
            } catch (Exception e) {
                logger.error("WebSocket connection error for user: {}", username, e);
            }
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        if (headerAccessor.getUser() instanceof UsernamePasswordAuthenticationToken) {
            UsernamePasswordAuthenticationToken auth = (UsernamePasswordAuthenticationToken) headerAccessor.getUser();
            String username = auth.getName();
            String sessionId = headerAccessor.getSessionId();

            try {
                User user = userService.getUserByUsername(username);
                sessionManager.removeSession(user.getId(), sessionId);
                logger.info("WebSocket disconnected: user={}, session={}", username, sessionId);
            } catch (Exception e) {
                logger.error("WebSocket disconnection error for user: {}", username, e);
            }
        }
    }
}