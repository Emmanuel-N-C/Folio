package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.UpdateProfileRequest;
import com.folio.folio_backend.dto.UserProfileResponse;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return mapToUserProfileResponse(user);
    }
    
    @Override
    public UserProfileResponse updateUserProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }
        if (request.getGithubUrl() != null) {
            user.setGithubUrl(request.getGithubUrl());
        }
        if (request.getWebsiteUrl() != null) {
            user.setWebsiteUrl(request.getWebsiteUrl());
        }
        
        User updatedUser = userRepository.save(user);
        return mapToUserProfileResponse(updatedUser);
    }
    
    @Override
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return userRepository.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
        }
        throw new ResourceNotFoundException("No authenticated user found");
    }
    
    @Override
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }
    
    private UserProfileResponse mapToUserProfileResponse(User user) {
        UserProfileResponse response = new UserProfileResponse();
        response.setId(user.getId());
        response.setUsername(user.getUsername());
        response.setEmail(user.getEmail());
        response.setBio(user.getBio());
        response.setProfileImageUrl(user.getProfileImageUrl());
        response.setGithubUrl(user.getGithubUrl());
        response.setWebsiteUrl(user.getWebsiteUrl());
        response.setCreatedAt(user.getCreatedAt());
        response.setPostsCount(user.getPosts() != null ? user.getPosts().size() : 0);
        return response;
    }
}

