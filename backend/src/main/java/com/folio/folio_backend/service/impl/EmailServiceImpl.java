package com.folio.folio_backend.service.impl;

import com.folio.folio_backend.model.User;
import com.folio.folio_backend.service.EmailService;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Value("${sendgrid.api-key}")
    private String sendGridApiKey;

    @Value("${mail.from.email}")
    private String fromEmail;

    @Value("${mail.from.name}")
    private String fromName;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Override
    public void sendVerificationEmail(User user) {
        String subject = "Verify Your Folio Account";
        String htmlContent = buildVerificationEmailTemplate(user);
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    @Override
    public void sendPasswordResetEmail(User user) {
        String subject = "Reset Your Folio Password";
        String htmlContent = buildPasswordResetEmailTemplate(user);
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    @Override
    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to Folio!";
        String htmlContent = buildWelcomeEmailTemplate(user);
        sendEmail(user.getEmail(), subject, htmlContent);
    }

    private void sendEmail(String toEmail, String subject, String htmlContent) {
        Email from = new Email(fromEmail, fromName);
        Email to = new Email(toEmail);
        Content content = new Content("text/html", htmlContent);
        Mail mail = new Mail(from, subject, to, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                logger.info("Email sent successfully to: {}", toEmail);
            } else {
                logger.error("Failed to send email. Status: {}, Body: {}",
                        response.getStatusCode(), response.getBody());
            }
        } catch (IOException ex) {
            logger.error("Error sending email to {}: {}", toEmail, ex.getMessage());
        }
    }

    private String buildVerificationEmailTemplate(User user) {
        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Verify Your Email</title>" +
                "    <style>" +
                "        * { margin: 0; padding: 0; box-sizing: border-box; }" +
                "        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 0; line-height: 1.6; }" +
                "        .email-wrapper { background-color: #fafafa; padding: 40px 20px; }" +
                "        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }" +
                "        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; padding: 48px 40px; text-align: center; }" +
                "        .logo { display: inline-flex; align-items: center; justify-content: center; width: 56px; height: 56px; background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%); border-radius: 14px; margin-bottom: 20px; }" +
                "        .logo-text { font-size: 28px; font-weight: 700; color: #1a1a1a; }" +
                "        .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }" +
                "        .content { padding: 48px 40px; }" +
                "        .content p { color: #525252; line-height: 1.7; margin: 0 0 20px; font-size: 16px; }" +
                "        .greeting { color: #1a1a1a; font-size: 18px; font-weight: 600; margin-bottom: 24px; }" +
                "        .code-box { background: #fafafa; border: 2px solid #e5e5e5; border-radius: 12px; padding: 32px 24px; text-align: center; margin: 32px 0; }" +
                "        .code-label { color: #737373; font-size: 14px; font-weight: 500; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }" +
                "        .code { font-size: 36px; font-weight: 700; color: #1a1a1a; letter-spacing: 12px; font-family: 'Courier New', monospace; margin: 12px 0; }" +
                "        .expiry-notice { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 24px 0; }" +
                "        .expiry-notice p { color: #92400e; margin: 0; font-size: 14px; font-weight: 500; }" +
                "        .footer { background: #fafafa; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e5e5; }" +
                "        .footer p { color: #737373; font-size: 14px; margin: 8px 0; }" +
                "        .footer-brand { color: #1a1a1a; font-weight: 600; }" +
                "        .divider { height: 1px; background: #e5e5e5; margin: 32px 0; }" +
                "        @media only screen and (max-width: 600px) {" +
                "            .email-wrapper { padding: 20px 10px; }" +
                "            .header, .content, .footer { padding: 32px 24px; }" +
                "            .code { font-size: 28px; letter-spacing: 8px; }" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"email-wrapper\">" +
                "        <div class=\"container\">" +
                "            <div class=\"header\">" +
                "                <div class=\"logo\">" +
                "                    <span class=\"logo-text\">F</span>" +
                "                </div>" +
                "                <h1>Verify Your Email</h1>" +
                "            </div>" +
                "            <div class=\"content\">" +
                "                <p class=\"greeting\">Hi " + user.getUsername() + ",</p>" +
                "                <p>Thank you for signing up for Folio! We're excited to have you join our community of developers showcasing their amazing projects.</p>" +
                "                <p>To complete your registration and activate your account, please enter this verification code:</p>" +
                "                <div class=\"code-box\">" +
                "                    <div class=\"code-label\">Verification Code</div>" +
                "                    <div class=\"code\">" + user.getVerificationCode() + "</div>" +
                "                </div>" +
                "                <div class=\"expiry-notice\">" +
                "                    <p>⏱️ mvnThis code will expire in 10 minutes for security purposes.</p>" +
                "                </div>" +
                "                <div class=\"divider\"></div>" +
                "                <p style=\"color: #737373; font-size: 14px;\">If you didn't create a Folio account, you can safely ignore this email. No account will be created without verification.</p>" +
                "            </div>" +
                "            <div class=\"footer\">" +
                "                <p class=\"footer-brand\">Folio</p>" +
                "                <p>&copy; 2025 Folio. Built with care for developers.</p>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    private String buildPasswordResetEmailTemplate(User user) {
        String resetUrl = frontendUrl + "/reset-password?token=" + user.getPasswordResetToken();

        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Reset Your Password</title>" +
                "    <style>" +
                "        * { margin: 0; padding: 0; box-sizing: border-box; }" +
                "        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 0; line-height: 1.6; }" +
                "        .email-wrapper { background-color: #fafafa; padding: 40px 20px; }" +
                "        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }" +
                "        .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; padding: 48px 40px; text-align: center; }" +
                "        .icon { font-size: 48px; margin-bottom: 16px; }" +
                "        .header h1 { margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px; }" +
                "        .content { padding: 48px 40px; }" +
                "        .content p { color: #525252; line-height: 1.7; margin: 0 0 20px; font-size: 16px; }" +
                "        .greeting { color: #1a1a1a; font-size: 18px; font-weight: 600; margin-bottom: 24px; }" +
                "        .button-container { text-align: center; margin: 36px 0; }" +
                "        .button { display: inline-block; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; padding: 16px 48px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(26,26,26,0.2); transition: transform 0.2s; }" +
                "        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26,26,26,0.3); }" +
                "        .security-notice { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; border-radius: 8px; margin: 24px 0; }" +
                "        .security-notice p { color: #92400e; margin: 0; font-size: 14px; font-weight: 500; }" +
                "        .link-box { background: #fafafa; border: 1px solid #e5e5e5; border-radius: 8px; padding: 16px; margin: 24px 0; word-break: break-all; }" +
                "        .link-box p { color: #737373; font-size: 13px; margin: 0 0 8px; }" +
                "        .link-box a { color: #1a1a1a; font-size: 13px; }" +
                "        .footer { background: #fafafa; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e5e5; }" +
                "        .footer p { color: #737373; font-size: 14px; margin: 8px 0; }" +
                "        .footer-brand { color: #1a1a1a; font-weight: 600; }" +
                "        .divider { height: 1px; background: #e5e5e5; margin: 32px 0; }" +
                "        @media only screen and (max-width: 600px) {" +
                "            .email-wrapper { padding: 20px 10px; }" +
                "            .header, .content, .footer { padding: 32px 24px; }" +
                "            .button { padding: 14px 32px; font-size: 15px; }" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"email-wrapper\">" +
                "        <div class=\"container\">" +
                "            <div class=\"header\">" +
                "                <div class=\"icon\">🔐</div>" +
                "                <h1>Password Reset Request</h1>" +
                "            </div>" +
                "            <div class=\"content\">" +
                "                <p class=\"greeting\">Hi " + user.getUsername() + ",</p>" +
                "                <p>We received a request to reset the password for your Folio account. If you made this request, click the button below to create a new password:</p>" +
                "                <div class=\"button-container\">" +
                "                    <a href=\"" + resetUrl + "\" class=\"button\">Reset My Password</a>" +
                "                </div>" +
                "                <div class=\"security-notice\">" +
                "                    <p>⏱️ <strong>Important:</strong> This password reset link will expire in 15 minutes for security purposes.</p>" +
                "                </div>" +
                "                <div class=\"divider\"></div>" +
                "                <p style=\"color: #737373; font-size: 14px;\">If you didn't request a password reset, please ignore this email. Your password will remain unchanged and your account is secure.</p>" +
                "                <div class=\"link-box\">" +
                "                    <p><strong>Button not working?</strong> Copy and paste this link into your browser:</p>" +
                "                    <a href=\"" + resetUrl + "\">" + resetUrl + "</a>" +
                "                </div>" +
                "            </div>" +
                "            <div class=\"footer\">" +
                "                <p class=\"footer-brand\">Folio</p>" +
                "                <p>&copy; 2025 Folio. Built with care for developers.</p>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }

    private String buildWelcomeEmailTemplate(User user) {
        String loginUrl = frontendUrl + "/login";
        String exploreUrl = frontendUrl + "/feed";

        return "<!DOCTYPE html>" +
                "<html lang=\"en\">" +
                "<head>" +
                "    <meta charset=\"UTF-8\">" +
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "    <title>Welcome to Folio</title>" +
                "    <style>" +
                "        * { margin: 0; padding: 0; box-sizing: border-box; }" +
                "        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', 'Roboto', 'Helvetica Neue', Arial, sans-serif; background-color: #fafafa; margin: 0; padding: 0; line-height: 1.6; }" +
                "        .email-wrapper { background-color: #fafafa; padding: 40px 20px; }" +
                "        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }" +
                "        .header { background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; padding: 48px 40px; text-align: center; }" +
                "        .celebration { font-size: 64px; margin-bottom: 20px; }" +
                "        .header h1 { margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px; }" +
                "        .header p { margin: 12px 0 0; font-size: 16px; opacity: 0.9; font-weight: 400; }" +
                "        .content { padding: 48px 40px; }" +
                "        .content p { color: #525252; line-height: 1.7; margin: 0 0 20px; font-size: 16px; }" +
                "        .greeting { color: #1a1a1a; font-size: 18px; font-weight: 600; margin-bottom: 24px; }" +
                "        .features { background: #fafafa; border-radius: 12px; padding: 32px 28px; margin: 32px 0; border: 1px solid #e5e5e5; }" +
                "        .features h3 { color: #1a1a1a; margin: 0 0 20px; font-size: 18px; font-weight: 600; }" +
                "        .features ul { margin: 0; padding-left: 0; list-style: none; }" +
                "        .features li { color: #525252; margin: 16px 0; line-height: 1.6; padding-left: 28px; position: relative; }" +
                "        .features li:before { content: '✓'; position: absolute; left: 0; color: #1a1a1a; font-weight: 700; font-size: 18px; }" +
                "        .features strong { color: #1a1a1a; font-weight: 600; }" +
                "        .button-container { text-align: center; margin: 36px 0; }" +
                "        .button { display: inline-block; background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); color: #ffffff; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 16px; margin: 8px; box-shadow: 0 4px 12px rgba(26,26,26,0.2); transition: transform 0.2s; }" +
                "        .button:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(26,26,26,0.3); }" +
                "        .button-secondary { background: #ffffff; color: #1a1a1a; border: 2px solid #1a1a1a; box-shadow: none; }" +
                "        .button-secondary:hover { background: #fafafa; box-shadow: none; }" +
                "        .footer { background: #fafafa; padding: 32px 40px; text-align: center; border-top: 1px solid #e5e5e5; }" +
                "        .footer p { color: #737373; font-size: 14px; margin: 8px 0; }" +
                "        .footer-brand { color: #1a1a1a; font-weight: 600; }" +
                "        .divider { height: 1px; background: #e5e5e5; margin: 32px 0; }" +
                "        @media only screen and (max-width: 600px) {" +
                "            .email-wrapper { padding: 20px 10px; }" +
                "            .header, .content, .footer { padding: 32px 24px; }" +
                "            .celebration { font-size: 48px; }" +
                "            .button { display: block; margin: 8px 0; }" +
                "        }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"email-wrapper\">" +
                "        <div class=\"container\">" +
                "            <div class=\"header\">" +
                "                <div class=\"celebration\">🎉</div>" +
                "                <h1>Welcome to Folio!</h1>" +
                "                <p>Your account is now verified and ready to use</p>" +
                "            </div>" +
                "            <div class=\"content\">" +
                "                <p class=\"greeting\">Hi " + user.getUsername() + ",</p>" +
                "                <p>Congratulations! Your email has been successfully verified, and your Folio account is now active. You're all set to start showcasing your amazing projects to the world!</p>" +
                "                <div class=\"features\">" +
                "                    <h3>What you can do now:</h3>" +
                "                    <ul>" +
                "                        <li><strong>Create Projects:</strong> Share your work with detailed descriptions, screenshots, and live demos</li>" +
                "                        <li><strong>Build Your Profile:</strong> Customize your profile to showcase your skills and experience</li>" +
                "                        <li><strong>Connect & Engage:</strong> Like, comment, and follow other developers' projects</li>" +
                "                        <li><strong>Get Discovered:</strong> Let recruiters and collaborators find your amazing work</li>" +
                "                    </ul>" +
                "                </div>" +
                "                <p>Ready to get started? Log in to your account and begin your journey!</p>" +
                "                <div class=\"button-container\">" +
                "                    <a href=\"" + loginUrl + "\" class=\"button\">Log In Now</a>" +
                "                    <a href=\"" + exploreUrl + "\" class=\"button button-secondary\">Explore Projects</a>" +
                "                </div>" +
                "                <div class=\"divider\"></div>" +
                "                <p style=\"color: #737373; font-size: 14px;\">If you have any questions or need help getting started, feel free to reach out to our support team. We're here to help!</p>" +
                "                <p style=\"font-size: 18px; margin-top: 24px;\">Happy showcasing! 🚀</p>" +
                "            </div>" +
                "            <div class=\"footer\">" +
                "                <p class=\"footer-brand\">Folio</p>" +
                "                <p>&copy; 2025 Folio. Built with care for developers.</p>" +
                "            </div>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}