package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.exception.BadRequestException;
import com.folio.folio_backend.exception.ResourceNotFoundException;
import com.folio.folio_backend.model.Like;
import com.folio.folio_backend.model.Post;
import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.LikeRepository;
import com.folio.folio_backend.repository.PostRepository;
import com.folio.folio_backend.repository.UserRepository;
import com.folio.folio_backend.service.LikeService;
import com.folio.folio_backend.service.NotificationService;
import com.folio.folio_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class LikeServiceImpl implements LikeService {

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Override
    @Transactional
    public void likePost(Long postId) {
        Long userId = userService.getCurrentUserId();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (likeRepository.existsByUserIdAndPostId(userId, postId)) {
            throw new BadRequestException("You have already liked this post");
        }

        Like like = new Like();
        like.setUser(user);
        like.setPost(post);

        likeRepository.save(like);

        // Create notification
        notificationService.createPostLikeNotification(postId, userId);
    }

    @Override
    @Transactional
    public void unlikePost(Long postId) {
        Long userId = userService.getCurrentUserId();

        Like like = likeRepository.findByUserIdAndPostId(userId, postId)
                .orElseThrow(() -> new ResourceNotFoundException("Like not found"));

        likeRepository.delete(like);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean isPostLikedByUser(Long postId, Long userId) {
        return likeRepository.existsByUserIdAndPostId(userId, postId);
    }

    @Override
    @Transactional(readOnly = true)
    public int getLikesCount(Long postId) {
        return likeRepository.countByPostId(postId);
    }
}