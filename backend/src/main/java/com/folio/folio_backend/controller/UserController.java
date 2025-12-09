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

    // Check username availability - MOVED TO TOP TO AVOID CONFLICT
    @GetMapping("/check-username")
    public ResponseEntity<Map<String, Boolean>> checkUsernameAvailability(@RequestParam String username) {
        boolean available = !userService.isUsernameExists(username);
        return ResponseEntity.ok(Map.of("available", available));
    }

    // Check email availability - MOVED TO TOP TO AVOID CONFLICT
    @GetMapping("/check-email")
    public ResponseEntity<Map<String, Boolean>> checkEmailAvailability(@RequestParam String email) {
        boolean available = !userService.isEmailExists(email);
        return ResponseEntity.ok(Map.of("available", available));
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

    @PostMapping(value = "/me/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> uploadProfilePicture(
            @RequestParam("file") MultipartFile file) {
        Long currentUserId = userService.getCurrentUserId();
        UserProfileResponse response = userService.uploadProfilePicture(currentUserId, file);
        return ResponseEntity.ok(response);
    }

    // Remove profile picture
    @DeleteMapping("/me/profile-picture")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> removeProfilePicture() {
        Long currentUserId = userService.getCurrentUserId();
        UserProfileResponse response = userService.removeProfilePicture(currentUserId);
        return ResponseEntity.ok(response);
    }

    // Delete account
    @DeleteMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, String>> deleteAccount() {
        Long currentUserId = userService.getCurrentUserId();
        userService.deleteUserAccount(currentUserId);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }

    // Get user profile by ID - MOVED TO BOTTOM TO AVOID CATCHING OTHER ROUTES
    @GetMapping("/{userId}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable Long userId) {
        UserProfileResponse response = userService.getUserProfile(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping(value = "/{userId}/profile-picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserProfileResponse> uploadProfilePictureById(
            @PathVariable Long userId,
            @RequestParam("file") MultipartFile file) {
        UserProfileResponse response = userService.uploadProfilePicture(userId, file);
        return ResponseEntity.ok(response);
    }
}