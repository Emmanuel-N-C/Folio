package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.CreatePostRequest;
import com.folio.folio_backend.dto.PostResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

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
    PostResponse uploadPostScreenshots(Long postId, List<MultipartFile> files);
    void deletePost(Long postId);
}