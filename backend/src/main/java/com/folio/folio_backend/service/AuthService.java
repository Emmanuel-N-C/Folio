package com.folio.folio_backend.service;

import com.folio.folio_backend.dto.*;

public interface AuthService {
    MessageResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    MessageResponse verifyEmail(VerifyEmailRequest request);
    MessageResponse resendVerification(ResendVerificationRequest request);
    MessageResponse forgotPassword(ForgotPasswordRequest request);
    MessageResponse resetPassword(ResetPasswordRequest request);
}