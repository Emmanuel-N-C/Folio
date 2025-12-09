package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.OAuthRegisterRequest;
import com.folio.folio_backend.dto.OAuthResponse;
import com.folio.folio_backend.dto.OAuthUserInfo;

public interface OAuthService {
    OAuthUserInfo getGoogleUserInfo(String accessToken);
    OAuthUserInfo getGitHubUserInfo(String accessToken);
    OAuthResponse handleOAuthCallback(OAuthUserInfo oauthUserInfo);
    OAuthResponse completeOAuthRegistration(OAuthRegisterRequest request);
    String exchangeCodeForToken(String code, String provider);
}