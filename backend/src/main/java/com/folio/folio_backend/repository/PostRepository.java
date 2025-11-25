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

    // For single post - can use multiple fetches
    @Query("SELECT DISTINCT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN FETCH p.likes " +
            "LEFT JOIN FETCH p.comments " +
            "WHERE p.id = :id")
    Optional<Post> findByIdWithDetails(@Param("id") Long id);

    // For paginated queries - only fetch the user, not collections
    @Query(value = "SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "ORDER BY p.createdAt DESC",
            countQuery = "SELECT COUNT(p) FROM Post p")
    Page<Post> findAllWithDetails(Pageable pageable);

    @Query("SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "WHERE p.postedBy.id = :userId " +
            "ORDER BY p.createdAt DESC")
    List<Post> findByPostedByIdWithDetails(@Param("userId") Long userId);

    @Query(value = "SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "LEFT JOIN p.likes l " +
            "GROUP BY p.id, p.postedBy.id " +
            "ORDER BY COUNT(l) DESC, p.createdAt DESC",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Post p")
    Page<Post> findTrendingPostsWithDetails(Pageable pageable);

    @Query(value = "SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "WHERE LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :keyword, '%'))",
            countQuery = "SELECT COUNT(p) FROM Post p WHERE " +
                    "LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
                    "LOWER(p.techStack) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Post> searchPostsWithDetails(@Param("keyword") String keyword, Pageable pageable);

    @Query(value = "SELECT p FROM Post p " +
            "LEFT JOIN FETCH p.postedBy " +
            "JOIN p.tags t WHERE LOWER(t) = LOWER(:tag)",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Post p JOIN p.tags t WHERE LOWER(t) = LOWER(:tag)")
    Page<Post> findByTagWithDetails(@Param("tag") String tag, Pageable pageable);

    // Legacy methods for compatibility
    List<Post> findByPostedByIdOrderByCreatedAtDesc(Long userId);
}