package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.Like;
import com.folio.folio_backend.model.Post;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.LikeRepository;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.service.LikeService;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LikeServiceImpl implements LikeService {
    
    @Autowired
    private LikeRepository likeRepository;
    
    @Autowired
    private PostRepository postRepository;
    
    @Autowired
    private UserService userService;
    
    @Override
    public void likePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + postId));
        
        if (likeRepository.existsByUserIdAndPostId(currentUser.getId(), postId)) {
            throw new BadRequestException("You have already liked this post");
        }
        
        Like like = new Like();
        like.setUser(currentUser);
        like.setPost(post);
        
        likeRepository.save(like);
    }
    
    @Override
    public void unlikePost(Long postId) {
        User currentUser = userService.getCurrentUser();
        
        Like like = likeRepository.findByUserIdAndPostId(currentUser.getId(), postId)
                .orElseThrow(() -> new BadRequestException("You haven't liked this post"));
        
        likeRepository.delete(like);
    }
    
    @Override
    public boolean isPostLikedByUser(Long postId, Long userId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }
    
    @Override
    public int getLikesCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}

