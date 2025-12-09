package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.*;
import com.folio.folio_backend.service.OAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth/oauth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OAuthController {

    @Autowired
    private OAuthService oauthService;

    /**
     * Step 1: Check if OAuth user exists
     * Frontend sends Google ID token or GitHub access token
     */
    @PostMapping("/check")
    public ResponseEntity<OAuthCheckResponse> checkOAuthUser(@Valid @RequestBody OAuthCheckRequest request) {
        OAuthCheckResponse response = oauthService.checkOAuthUser(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Step 2a: Login existing OAuth user
     */
    @PostMapping("/login")
    public ResponseEntity<OAuthResponse> loginOAuthUser(@Valid @RequestBody OAuthLoginRequest request) {
        OAuthResponse response = oauthService.loginOAuthUser(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Step 2b: Register new OAuth user with username
     */
    @PostMapping("/register")
    public ResponseEntity<OAuthResponse> registerOAuthUser(@Valid @RequestBody OAuthRegisterRequest request) {
        OAuthResponse response = oauthService.registerOAuthUser(request);
        return ResponseEntity.ok(response);
    }
}