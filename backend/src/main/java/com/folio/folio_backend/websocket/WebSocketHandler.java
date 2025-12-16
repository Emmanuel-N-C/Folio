package com.folio.folio_backend.websocket;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.folio.folio_backend.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketHandler.class);
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();
    private final Map<String, Long> sessionToUserId = new ConcurrentHashMap<>();

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String token = extractToken(session);

        if (token != null && tokenProvider.validateToken(token)) {
            String username = tokenProvider.getUsernameFromToken(token);
            sessions.put(session.getId(), session);
            logger.info("WebSocket connected: session={}", session.getId());
        } else {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Invalid token"));
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.remove(session.getId());
        sessionToUserId.remove(session.getId());
        logger.info("WebSocket disconnected: session={}", session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        // Handle incoming messages if needed (e.g., heartbeat ping)
    }

    public void sendToUser(Long userId, Object message) {
        sessions.values().stream()
                .filter(session -> userId.equals(sessionToUserId.get(session.getId())))
                .forEach(session -> {
                    try {
                        String json = objectMapper.writeValueAsString(message);
                        session.sendMessage(new TextMessage(json));
                    } catch (IOException e) {
                        logger.error("Error sending message to user {}", userId, e);
                    }
                });
    }

    private String extractToken(WebSocketSession session) {
        String query = session.getUri().getQuery();
        if (query != null && query.contains("token=")) {
            return query.split("token=")[1].split("&")[0];
        }
        return null;
    }

    public void registerUser(String sessionId, Long userId) {
        sessionToUserId.put(sessionId, userId);
    }
}