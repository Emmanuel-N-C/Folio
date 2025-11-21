package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.AuthResponse;
import com.folio.folio_backend.dto.LoginRequest;
import com.folio.folio_backend.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}

