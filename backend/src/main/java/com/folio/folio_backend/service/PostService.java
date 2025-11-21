package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.CreatePostRequest;
import com.folio.folio_backend.dto.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostService {
    PostResponse createPost(CreatePostRequest request);
    PostResponse getPostById(Long postId);
    Page<PostResponse> getAllPosts(Pageable pageable);
    Page<PostResponse> getTrendingPosts(Pageable pageable);
    List<PostResponse> getUserPosts(Long userId);
    Page<PostResponse> searchPosts(String keyword, Pageable pageable);
    Page<PostResponse> getPostsByTag(String tag, Pageable pageable);
    PostResponse updatePost(Long postId, CreatePostRequest request);
    void deletePost(Long postId);
}

