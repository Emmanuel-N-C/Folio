package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.*;

public interface OAuthService {

    /**
     * Exchange GitHub authorization code for access token (server-side)
     */
    GitHubTokenResponse exchangeGitHubCode(GitHubCodeExchangeRequest request);

    /**
     * Check if OAuth user exists
     */
    OAuthCheckResponse checkOAuthUser(OAuthCheckRequest request);

    /**
     * Login existing OAuth user
     */
    OAuthResponse loginOAuthUser(OAuthLoginRequest request);

    /**
     * Register new OAuth user
     */
    OAuthResponse registerOAuthUser(OAuthRegisterRequest request);
}