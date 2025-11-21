package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.MessageResponse;
import com.folio.folio_backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/likes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class LikeController {
    
    @Autowired
    private LikeService likeService;
    
    @PostMapping
    public ResponseEntity<MessageResponse> likePost(@PathVariable Long postId) {
        likeService.likePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post liked successfully"));
    }
    
    @DeleteMapping
    public ResponseEntity<MessageResponse> unlikePost(@PathVariable Long postId) {
        likeService.unlikePost(postId);
        return ResponseEntity.ok(new MessageResponse("Post unliked successfully"));
    }
    
    @GetMapping("/count")
    public ResponseEntity<Integer> getLikesCount(@PathVariable Long postId) {
        int count = likeService.getLikesCount(postId);
        return ResponseEntity.ok(count);
    }
}

