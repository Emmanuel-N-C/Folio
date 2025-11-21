package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.dto.CreatePostRequest;
import com.folio.folio_backend.dto.PostResponse;
import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.Post;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.LikeRepository;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.service.PostService;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class PostServiceImpl implements PostService {
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Override
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
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
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
    public Page<PostResponse> getAllPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        
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
    public Page<PostResponse> getTrendingPosts(Pageable pageable) {
        Page<Post> posts = postRepository.findTrendingPosts(pageable);
        
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
    public List<PostResponse> getUserPosts(Long userId) {
        List<Post> posts = postRepository.findByPostedByIdOrderByCreatedAtDesc(userId);
        
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
    public Page<PostResponse> searchPosts(String keyword, Pageable pageable) {
        Page<Post> posts = postRepository.searchPosts(keyword, pageable);
        
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
    public Page<PostResponse> getPostsByTag(String tag, Pageable pageable) {
        Page<Post> posts = postRepository.findByTag(tag, pageable);
        
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
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        User currentUser = userService.getCurrentUser();
        
        if (!post.getPostedBy().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are not authorized to delete this post");
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
        response.setScreenshotUrls(post.getScreenshotUrls());
        response.setTags(post.getTags());
        response.setUserId(post.getPostedBy().getId());
        response.setUsername(post.getPostedBy().getUsername());
        response.setUserProfileImageUrl(post.getPostedBy().getProfileImageUrl());
        response.setLikesCount(post.getLikesCount());
        response.setCommentsCount(post.getCommentsCount());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        
        if (currentUserId != null) {
            response.setLikedByCurrentUser(likeRepository.existsByUserIdAndPostId(currentUserId, post.getId()));
        }
        
        return response;
    }
}

