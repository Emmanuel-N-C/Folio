package com.folio.folio_backend.repository;

import com.folio.folio_backend.model.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Fetch joins to eagerly load all lazy collections
    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "LEFT JOIN FETCH p.screenshotUrls " +
            "LEFT JOIN FETCH p.tags " +
            "WHERE p.id = :id")
    Optional<Post> findByIdWithDetails(@Param("id") Long id);

    @Query(value = "SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "ORDER BY p.createdAt DESC",
            countQuery = "SELECT COUNT(p) FROM Post p")
    Page<Post> findAllWithDetails(Pageable pageable);

    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "WHERE p.postedBy.id = :userId " +
            "ORDER BY p.createdAt DESC")
    List<Post> findByPostedByIdWithDetails(@Param("userId") Long userId);

    @Query(value = "SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "ORDER BY SIZE(p.likes) DESC, p.createdAt DESC",
            countQuery = "SELECT COUNT(p) FROM Post p")
    Page<Post> findTrendingPostsWithDetails(Pageable pageable);

    @Query(value = "SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :keyword, '%'))",
            countQuery = "SELECT COUNT(p) FROM Post p WHERE " +
                    "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Post> searchPostsWithDetails(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "JOIN p.tags t WHERE LOWER(t) = LOWER(:tag)",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Post p JOIN p.tags t WHERE LOWER(t) = LOWER(:tag)")
    Page<Post> findByTagWithDetails(@Param("tag") String tag, Pageable pageable);

    // Legacy methods (keep for compatibility but add fetch joins)
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