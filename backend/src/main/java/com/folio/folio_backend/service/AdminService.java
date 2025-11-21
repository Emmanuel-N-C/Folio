package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.UserProfileResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface AdminService {
    Page<UserProfileResponse> getAllUsers(Pageable pageable);
    void deleteUser(Long userId);
    void deletePost(Long postId);
    void deleteComment(Long commentId);
    Map<String, Object> getDashboardStats();
}