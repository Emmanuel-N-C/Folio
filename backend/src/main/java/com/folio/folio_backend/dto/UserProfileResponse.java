package com.folio.folio_backend.dto;

import com.folio.folio_backend.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String username;
    private String displayName;
    private String email;
    private String bio;
    private String profileImageUrl;
    private String githubUrl;
    private String websiteUrl;
    private String location;
    private String profession;
    private LocalDateTime createdAt;
    private int postsCount;
    private Set<Role> roles;
}