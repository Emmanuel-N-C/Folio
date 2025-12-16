package com.folio.folio_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Username can be null initially for OAuth users (set during onboarding)
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    @Pattern(
            regexp = "^[a-z][a-z0-9]*(?:[._-][a-z0-9]+)*$",
            message = "Username must start with a letter, end with a letter or number, and cannot have consecutive special characters"
    )
    @Column(unique = true, length = 20)
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Column(unique = true, nullable = false)
    private String email;

    // Password can be null for OAuth users
    @Column(nullable = true)
    private String password;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Set<Role> roles = new HashSet<>();

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String profileImageUrl;

    private String githubUrl;

    private String websiteUrl;

    private String displayName;

    private String location;

    private String profession;

    // OAuth fields
    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private AuthProvider authProvider; // GOOGLE, GITHUB, LOCAL

    @Column(length = 100)
    private String oauthId; // OAuth provider's user ID

    // Email verification fields
    @Column(nullable = false)
    private boolean verified = false;

    @Column(length = 6)
    private String verificationCode;

    private LocalDateTime verificationCodeExpiration;

    // Password reset fields
    @Column(length = 36)
    private String passwordResetToken;

    private LocalDateTime passwordResetTokenExpiration;

    // OAuth onboarding tracking
    @Column(nullable = false)
    private boolean onboardingComplete = false;

    // Terms and Conditions acceptance tracking
    @Column(nullable = false)
    private boolean termsAccepted = false;

    @Column(nullable = true)
    private LocalDateTime termsAcceptedAt;

    @Column(length = 10, nullable = true)
    private String termsVersion; // e.g., "1.0", "1.1"

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "postedBy", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    // Notifications where this user is the recipient
    @OneToMany(mappedBy = "recipient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> receivedNotifications = new ArrayList<>();

    // Notifications where this user is the actor
    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Notification> sentNotifications = new ArrayList<>();

    // Automatically normalize username and email to lowercase before saving
    @PrePersist
    @PreUpdate
    private void normalizeFields() {
        if (this.username != null) {
            this.username = this.username.toLowerCase().trim();
        }
        if (this.email != null) {
            this.email = this.email.toLowerCase().trim();
        }
    }
}