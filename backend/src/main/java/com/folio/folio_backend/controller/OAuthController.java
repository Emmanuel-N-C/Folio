package com.folio.folio_backend.controller;

import com.folio.folio_backend.dto.MessageResponse;
import com.folio.folio_backend.dto.OAuthRegisterRequest;
import com.folio.folio_backend.dto.OAuthResponse;
import com.folio.folio_backend.dto.OAuthUserInfo;
import com.folio.folio_backend.service.OAuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth/oauth2")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OAuthController {

    @Autowired
    private OAuthService oauthService;

    @Value("${oauth.frontend.success.url}")
    private String frontendSuccessUrl;

    @Value("${oauth.frontend.failure.url}")
    private String frontendFailureUrl;

    /**
     * OAuth callback endpoint for Google
     */
    @GetMapping("/callback/google")
    public ResponseEntity<String> googleCallback(@RequestParam("code") String code) {
        try {
            // Exchange code for access token
            String accessToken = oauthService.exchangeCodeForToken(code, "google");

            // Get user info from Google
            OAuthUserInfo userInfo = oauthService.getGoogleUserInfo(accessToken);

            // Handle OAuth callback (login or registration)
            OAuthResponse response = oauthService.handleOAuthCallback(userInfo);

            // Redirect to frontend with response
            return redirectToFrontend(response);

        } catch (Exception e) {
            return redirectToFrontendError(e.getMessage());
        }
    }

    /**
     * OAuth callback endpoint for GitHub
     */
    @GetMapping("/callback/github")
    public ResponseEntity<String> githubCallback(@RequestParam("code") String code) {
        try {
            // Exchange code for access token
            String accessToken = oauthService.exchangeCodeForToken(code, "github");

            // Get user info from GitHub
            OAuthUserInfo userInfo = oauthService.getGitHubUserInfo(accessToken);

            // Handle OAuth callback (login or registration)
            OAuthResponse response = oauthService.handleOAuthCallback(userInfo);

            // Redirect to frontend with response
            return redirectToFrontend(response);

        } catch (Exception e) {
            return redirectToFrontendError(e.getMessage());
        }
    }

    /**
     * Complete OAuth registration with username
     */
    @PostMapping("/complete-registration")
    public ResponseEntity<OAuthResponse> completeRegistration(@Valid @RequestBody OAuthRegisterRequest request) {
        OAuthResponse response = oauthService.completeOAuthRegistration(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Check username availability (for OAuth onboarding)
     */
    @GetMapping("/check-username")
    public ResponseEntity<MessageResponse> checkUsername(@RequestParam String username) {
        // This endpoint is handled by UserController, but we can add it here too
        return ResponseEntity.ok(new MessageResponse("Username availability check"));
    }

    private ResponseEntity<String> redirectToFrontend(OAuthResponse response) {
        try {
            StringBuilder redirectUrl = new StringBuilder(frontendSuccessUrl);
            redirectUrl.append("?requiresOnboarding=").append(response.isRequiresOnboarding());

            if (response.isRequiresOnboarding()) {
                redirectUrl.append("&oauthToken=").append(URLEncoder.encode(response.getOauthToken(), StandardCharsets.UTF_8));
                redirectUrl.append("&suggestedUsername=").append(URLEncoder.encode(response.getSuggestedUsername(), StandardCharsets.UTF_8));
                redirectUrl.append("&email=").append(URLEncoder.encode(response.getEmail(), StandardCharsets.UTF_8));
                redirectUrl.append("&name=").append(URLEncoder.encode(response.getName(), StandardCharsets.UTF_8));
                if (response.getProfileImageUrl() != null) {
                    redirectUrl.append("&profileImageUrl=").append(URLEncoder.encode(response.getProfileImageUrl(), StandardCharsets.UTF_8));
                }
            } else {
                redirectUrl.append("&token=").append(URLEncoder.encode(response.getToken(), StandardCharsets.UTF_8));
                redirectUrl.append("&userId=").append(response.getUserId());
                redirectUrl.append("&username=").append(URLEncoder.encode(response.getUsername(), StandardCharsets.UTF_8));
            }

            String html = "<!DOCTYPE html>" +
                    "<html><head><title>Redirecting...</title></head>" +
                    "<body><script>window.location.href='" + redirectUrl.toString() + "';</script>" +
                    "<p>Redirecting...</p></body></html>";

            return ResponseEntity.ok()
                    .header("Content-Type", "text/html")
                    .body(html);

        } catch (Exception e) {
            return redirectToFrontendError("Redirect failed: " + e.getMessage());
        }
    }

    private ResponseEntity<String> redirectToFrontendError(String errorMessage) {
        try {
            String redirectUrl = frontendFailureUrl + "?error=" +
                    URLEncoder.encode(errorMessage, StandardCharsets.UTF_8);

            String html = "<!DOCTYPE html>" +
                    "<html><head><title>Error</title></head>" +
                    "<body><script>window.location.href='" + redirectUrl + "';</script>" +
                    "<p>Error occurred. Redirecting...</p></body></html>";

            return ResponseEntity.status(HttpStatus.FOUND)
                    .header("Content-Type", "text/html")
                    .body(html);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error: " + errorMessage);
        }
    }
}