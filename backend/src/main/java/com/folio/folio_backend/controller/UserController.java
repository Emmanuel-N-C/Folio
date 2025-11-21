package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.UpdateProfileRequest;
import com.folio.folio_backend.dto.UserProfileResponse;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
}

