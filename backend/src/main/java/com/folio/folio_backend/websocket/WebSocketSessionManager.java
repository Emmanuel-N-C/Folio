package com.folio.folio_backend.websocket;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class WebSocketSessionManager {

    private final Map<Long, Set<String>> userSessions = new ConcurrentHashMap<>();

    public void addSession(Long userId, String sessionId) {
        userSessions.computeIfAbsent(userId, k -> new CopyOnWriteArraySet<>()).add(sessionId);
    }

    public void removeSession(Long userId, String sessionId) {
        Set<String> sessions = userSessions.get(userId);
        if (sessions != null) {
            sessions.remove(sessionId);
            if (sessions.isEmpty()) {
                userSessions.remove(userId);
            }
        }
    }

    public boolean isUserOnline(Long userId) {
        Set<String> sessions = userSessions.get(userId);
        return sessions != null && !sessions.isEmpty();
    }

    public Set<Long> getOnlineUsers() {
        return userSessions.keySet();
    }

    public int getSessionCount(Long userId) {
        Set<String> sessions = userSessions.get(userId);
        return sessions != null ? sessions.size() : 0;
    }
}