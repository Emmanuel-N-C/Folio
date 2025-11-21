package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.PostResponse;
import com.folio.folio_backend.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/feed")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedController {
    
    @Autowired
    private PostService postService;
    
    @GetMapping
    public ResponseEntity<Page<PostResponse>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<PostResponse> response = postService.getAllPosts(pageable);
        return ResponseEntity.ok(response);
    }
}

