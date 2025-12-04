package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.UpdateProfileRequest;
import com.folio.folio_backend.dto.UserProfileResponse;
import com.folio.folio_backend.model.User;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserProfileResponse getUserProfile(Long userId);
    UserProfileResponse updateUserProfile(Long userId, UpdateProfileRequest request);
    UserProfileResponse uploadProfilePicture(Long userId, MultipartFile file);
    User getCurrentUser();
    Long getCurrentUserId();

    // NEW METHODS
    boolean isUsernameExists(String username);
    UserProfileResponse removeProfilePicture(Long userId);
    void deleteUserAccount(Long userId);
}