package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.UpdateProfileRequest;
import com.folio.folio_backend.dto.UserProfileResponse;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long userId) {
        UserProfileResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile() {
        Long currentUserId = userService.getCurrentUserId();
        UserProfileResponse response = userService.getUserProfile(currentUserId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<UserProfileResponse> updateProfile(@RequestBody UpdateProfileRequest request) {
        Long currentUserId = userService.getCurrentUserId();
        UserProfileResponse response = userService.updateUserProfile(currentUserId, request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/{userId}/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> uploadProfilePicture(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        UserProfileResponse response = userService.uploadProfilePicture(userId, file);
        return ResponseEntity.ok(response);
    }

    // NEW ENDPOINT: Check username availability
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@PathVariable String username) {
        boolean available = !userService.isUsernameExists(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    // NEW ENDPOINT: Remove profile picture
    @DeleteMapping("/me/profile-picture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> removeProfilePicture() {
        Long currentUserId = userService.getCurrentUserId();
        UserProfileResponse response = userService.removeProfilePicture(currentUserId);
        return ResponseEntity.ok(response);
    }

    // NEW ENDPOINT: Delete account
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteAccount() {
        Long currentUserId = userService.getCurrentUserId();
        userService.deleteUserAccount(currentUserId);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}