package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.CreatePostRequest;
import com.folio.folio_backend.dto.PostResponse;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.Post;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.model.Role;
import com.folio.folio_backend.repository.LikeRepository;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.service.PostService;
import com.folio.folio_backend.service.UserService;
import com.folio.folio_backend.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private S3Service s3Service;

    @Override
    @Transactional
    public PostResponse createPost(CreatePostRequest request) {
        User currentUser = userService.getCurrentUser();

        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setTechStack(request.getTechStack());
        post.setLiveDemoUrl(request.getLiveDemoUrl());
        post.setGithubUrl(request.getGithubUrl());
        post.setScreenshotUrls(request.getScreenshotUrls());
        post.setTags(request.getTags());
        post.setPostedBy(currentUser);

        Post savedPost = postRepository.save(post);
        return mapToPostResponse(savedPost, currentUser.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findByIdWithDetails(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated - public access
        }

        return mapToPostResponse(post, currentUserId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAllWithDetails(pageable);

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated - public access
        }

        final Long userId = currentUserId;
        return posts.map(post -> mapToPostResponse(post, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getTrendingPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findTrendingPostsWithDetails(pageable);

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated
        }

        final Long userId = currentUserId;
        return posts.map(post -> mapToPostResponse(post, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostResponse> getUserPosts(Long userId) {
        List<Post> posts = postRepository.findByPostedByIdWithDetails(userId);

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated
        }

        final Long currentUserIdFinal = currentUserId;
        return posts.stream()
                .map(post -> mapToPostResponse(post, currentUserIdFinal))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> searchPosts(String keyword, Pageable pageable) {
        Page<Post> posts = postRepository.searchPostsWithDetails(keyword, pageable);

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated
        }

        final Long userId = currentUserId;
        return posts.map(post -> mapToPostResponse(post, userId));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PostResponse> getPostsByTag(String tag, Pageable pageable) {
        Page<Post> posts = postRepository.findByTagWithDetails(tag, pageable);

        Long currentUserId = null;
        try {
            currentUserId = userService.getCurrentUserId();
        } catch (Exception e) {
            // User not authenticated
        }

        final Long userId = currentUserId;
        return posts.map(post -> mapToPostResponse(post, userId));
    }

    @Override
    @Transactional
    public PostResponse updatePost(Long postId, CreatePostRequest request) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User currentUser = userService.getCurrentUser();

        if (!post.getPostedBy().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to update this post");
        }

        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setTechStack(request.getTechStack());
        post.setLiveDemoUrl(request.getLiveDemoUrl());
        post.setGithubUrl(request.getGithubUrl());
        post.setScreenshotUrls(request.getScreenshotUrls());
        post.setTags(request.getTags());

        Post updatedPost = postRepository.save(post);
        return mapToPostResponse(updatedPost, currentUser.getId());
    }

    @Override
    @Transactional
    public PostResponse uploadPostScreenshots(Long postId, List<MultipartFile> files) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        // Verify the current user owns this post
        User currentUser = userService.getCurrentUser();
        if (!post.getPostedBy().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only upload screenshots to your own posts");
        }

        // Upload screenshots to S3
        List<String> newScreenshotUrls = s3Service.uploadPostScreenshots(files, postId);

        // Add new URLs to existing screenshots
        post.getScreenshotUrls().addAll(newScreenshotUrls);
        postRepository.save(post);

        return mapToPostResponse(post, currentUser.getId());
    }

    @Override
    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));

        User currentUser = userService.getCurrentUser();

        // Allow deletion if user is the owner OR an admin
        boolean isOwner = post.getPostedBy().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRoles().contains(Role.ROLE_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new BadRequestException("You are not authorized to delete this post");
        }

        // Delete all screenshots from S3
        for (String screenshotUrl : post.getScreenshotUrls()) {
            try {
                String key = s3Service.extractKeyFromUrl(screenshotUrl);
                s3Service.deleteFile(key);
            } catch (Exception e) {
                System.err.println("Failed to delete screenshot: " + e.getMessage());
            }
        }

        postRepository.delete(post);
    }

    private PostResponse mapToPostResponse(Post post, Long currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setDescription(post.getDescription());
        response.setTechStack(post.getTechStack());
        response.setLiveDemoUrl(post.getLiveDemoUrl());
        response.setGithubUrl(post.getGithubUrl());

        // Access element collections - will be lazy loaded within transaction
        response.setScreenshotUrls(post.getScreenshotUrls() != null ? post.getScreenshotUrls() : List.of());
        response.setTags(post.getTags() != null ? post.getTags() : List.of());

        // User fields (already fetched)
        response.setUserId(post.getPostedBy().getId());
        response.setUsername(post.getPostedBy().getUsername());
        response.setDisplayName(post.getPostedBy().getDisplayName());  // NEW LINE
        response.setUserProfileImageUrl(post.getPostedBy().getProfileImageUrl());

        // Lazy load counts within transaction
        response.setLikesCount(post.getLikes() != null ? post.getLikes().size() : 0);
        response.setCommentsCount(post.getComments() != null ? post.getComments().size() : 0);

        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        if (currentUserId != null) {
            response.setLikedByCurrentUser(likeRepository.existsByUserIdAndPostId(currentUserId, post.getId()));
        } else {
            response.setLikedByCurrentUser(false);
        }

        return response;
    }
}