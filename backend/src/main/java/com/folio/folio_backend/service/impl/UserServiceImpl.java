package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.UpdateProfileRequest;
import com.folio.folio_backend.dto.UserProfileResponse;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.service.UserService;
import com.folio.folio_backend.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private S3Service s3Service;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return mapToUserProfileResponse(user);
    }

    @Override
    @Transactional
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
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    @Override
    @Transactional
    public UserProfileResponse uploadProfilePicture(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Verify the current user is updating their own profile
        Long currentUserId = getCurrentUserId();
        if (!user.getId().equals(currentUserId)) {
            throw new BadRequestException("You can only update your own profile picture");
        }

        // Delete old profile picture if exists
        if (user.getProfileImageUrl() != null && !user.getProfileImageUrl().isEmpty()) {
            try {
                String oldKey = s3Service.extractKeyFromUrl(user.getProfileImageUrl());
                s3Service.deleteFile(oldKey);
            } catch (Exception e) {
                // Log error but continue with upload
                System.err.println("Failed to delete old profile picture: " + e.getMessage());
            }
        }

        // Upload new profile picture
        String imageUrl = s3Service.uploadProfilePicture(file, userId);
        user.setProfileImageUrl(imageUrl);
        userRepository.save(user);

        return mapToUserProfileResponse(user);
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

        // Use repository count instead of accessing lazy collection
        response.setPostsCount((int) postRepository.findByPostedByIdOrderByCreatedAtDesc(user.getId()).stream().count());

        return response;
    }

}