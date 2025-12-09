package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.*;

public interface OAuthService {
    OAuthCheckResponse checkOAuthUser(OAuthCheckRequest request);
    OAuthResponse loginOAuthUser(OAuthLoginRequest request);
    OAuthResponse registerOAuthUser(OAuthRegisterRequest request);
}