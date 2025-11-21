package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.UpdateProfileRequest;
import com.folio.folio_backend.dto.UserProfileResponse;
import com.folio.folio_backend.model.User;

public interface UserService {
    UserProfileResponse getUserProfile(Long userId);
    UserProfileResponse updateUserProfile(Long userId, UpdateProfileRequest request);
    User getCurrentUser();
    Long getCurrentUserId();
}

