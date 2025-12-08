package com.folio.folio_backend.service;

import com.folio.folio_backend.model.User;

public interface EmailService {
    void sendVerificationEmail(User user);
    void sendPasswordResetEmail(User user);
    void sendWelcomeEmail(User user);
}