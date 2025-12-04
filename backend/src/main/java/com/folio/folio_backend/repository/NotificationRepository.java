package com.folio.folio_backend.repository;

import com.folio.folio_backend.model.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n " +
            "LEFT JOIN FETCH n.actor " +
            "LEFT JOIN FETCH n.post " +
            "LEFT JOIN FETCH n.comment " +
            "WHERE n.recipient.id = :userId " +
            "ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdWithDetails(@Param("userId") Long userId, Pageable pageable);

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipient.id = :userId AND n.read = false")
    long countUnreadByRecipientId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.recipient.id = :userId")
    void markAllAsReadByRecipientId(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.read = true WHERE n.id = :notificationId AND n.recipient.id = :userId")
    void markAsRead(@Param("notificationId") Long notificationId, @Param("userId") Long userId);
}