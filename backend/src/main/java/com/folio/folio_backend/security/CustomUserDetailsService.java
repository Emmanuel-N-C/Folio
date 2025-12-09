package com.folio.folio_backend.security;

import com.folio.folio_backend.model.User;
import com.folio.folio_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.stream.Collectors;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Use case-insensitive lookup
        User user = userRepository.findByUsernameOrEmailIgnoreCase(usernameOrEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + usernameOrEmail));

        // FIX: Handle null or empty password for OAuth users
        String password = user.getPassword();
        if (password == null || password.trim().isEmpty()) {
            // OAuth users don't have passwords, use a placeholder that can't be used for login
            password = "{noop}OAUTH_USER_NO_PASSWORD_" + System.currentTimeMillis();
        }

        // Ensure roles are not empty
        Collection<? extends GrantedAuthority> authorities = mapRolesToAuthorities(user);
        if (authorities.isEmpty()) {
            throw new UsernameNotFoundException("User has no roles assigned");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), // Return stored lowercase username
                password,           // Now guaranteed to be non-null and non-empty
                true,               // enabled
                true,               // accountNonExpired
                true,               // credentialsNonExpired
                true,               // accountNonLocked
                authorities
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(User user) {
        return user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.name()))
                .collect(Collectors.toList());
    }
}