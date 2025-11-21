package com.folio.folio_backend.repository;

import com.folio.folio_backend.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
    
    List<Post> findByPostedByIdOrderByCreatedAtDesc(Long userId);
    
    @Query("SELECT p FROM Post p LEFT JOIN p.likes l GROUP BY p.id ORDER BY COUNT(l) DESC, p.createdAt DESC")
    Page<Post> findTrendingPosts(Pageable pageable);
    
    @Query("SELECT p FROM Post p WHERE " +
           "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Post> searchPosts(@Param("keyword") String keyword, Pageable pageable);
    
    @Query("SELECT p FROM Post p JOIN p.tags t WHERE LOWER(t) = LOWER(:tag)")
    Page<Post> findByTag(@Param("tag") String tag, Pageable pageable);
}

