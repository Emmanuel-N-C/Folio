package com.folio.folio_backend.repository;

import com.folio.folio_backend.model.AuthProvider;
import com.folio.folio_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Standard queries (username is already lowercase in DB)
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    // For login: accept any case, convert to lowercase
    @Query("SELECT u FROM User u WHERE LOWER(u.username) = LOWER(:usernameOrEmail) OR LOWER(u.email) = LOWER(:usernameOrEmail)")
    Optional<User> findByUsernameOrEmailIgnoreCase(@Param("usernameOrEmail") String usernameOrEmail);

    // Existence checks (normalize input before calling)
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

    // OAuth queries
    Optional<User> findByEmailAndAuthProvider(String email, AuthProvider authProvider);
    Optional<User> findByOauthIdAndAuthProvider(String oauthId, AuthProvider authProvider);
}