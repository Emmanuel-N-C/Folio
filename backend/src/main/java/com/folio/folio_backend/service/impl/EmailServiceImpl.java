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
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; }" +
                "        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; padding: 40px 30px; text-align: center; }" +
                "        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
                "        .content { padding: 40px 30px; }" +
                "        .content p { color: #333333; line-height: 1.6; margin: 0 0 20px; font-size: 16px; }" +
                "        .code-box { background: #f8f9fa; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }" +
                "        .code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace; }" +
                "        .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666666; font-size: 14px; }" +
                "        .footer p { margin: 5px 0; }" +
                "        .highlight { color: #667eea; font-weight: 600; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"container\">" +
                "        <div class=\"header\">" +
                "            <h1>Welcome to Folio!</h1>" +
                "        </div>" +
                "        <div class=\"content\">" +
                "            <p>Hi <span class=\"highlight\">" + user.getUsername() + "</span>,</p>" +
                "            <p>Thank you for signing up! To complete your registration and start showcasing your projects, please verify your email address.</p>" +
                "            <p>Enter this verification code in the app:</p>" +
                "            <div class=\"code-box\">" +
                "                <div class=\"code\">" + user.getVerificationCode() + "</div>" +
                "            </div>" +
                "            <p><strong>This code will expire in 10 minutes.</strong></p>" +
                "            <p>If you didn't create an account with Folio, you can safely ignore this email.</p>" +
                "        </div>" +
                "        <div class=\"footer\">" +
                "            <p>&copy; 2024 Folio. All rights reserved.</p>" +
                "            <p>Building the future of project showcasing.</p>" +
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
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f9; margin: 0; padding: 0; }" +
                "        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }" +
                "        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; padding: 40px 30px; text-align: center; }" +
                "        .header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
                "        .content { padding: 40px 30px; }" +
                "        .content p { color: #333333; line-height: 1.6; margin: 0 0 20px; font-size: 16px; }" +
                "        .button-container { text-align: center; margin: 30px 0; }" +
                "        .button { display: inline-block; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; }" +
                "        .button:hover { opacity: 0.9; }" +
                "        .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666666; font-size: 14px; }" +
                "        .footer p { margin: 5px 0; }" +
                "        .highlight { color: #f5576c; font-weight: 600; }" +
                "        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }" +
                "    </style>" +
                "</head>" +
                "<body>" +
                "    <div class=\"container\">" +
                "        <div class=\"header\">" +
                "            <h1>Password Reset Request</h1>" +
                "        </div>" +
                "        <div class=\"content\">" +
                "            <p>Hi <span class=\"highlight\">" + user.getUsername() + "</span>,</p>" +
                "            <p>We received a request to reset your password for your Folio account. Click the button below to create a new password:</p>" +
                "            <div class=\"button-container\">" +
                "                <a href=\"" + resetUrl + "\" class=\"button\">Reset Password</a>" +
                "            </div>" +
                "            <div class=\"warning\">" +
                "                <p style=\"margin: 0;\"><strong>Important:</strong> This link will expire in 15 minutes.</p>" +
                "            </div>" +
                "            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>" +
                "            <p style=\"font-size: 14px; color: #666;\">If the button doesn't work, copy and paste this link into your browser:<br>" +
                "            <a href=\"" + resetUrl + "\" style=\"color: #f5576c; word-break: break-all;\">" + resetUrl + "</a></p>" +
                "        </div>" +
                "        <div class=\"footer\">" +
                "            <p>&copy; 2024 Folio. All rights reserved.</p>" +
                "            <p>Secure. Simple. Reliable.</p>" +
                "        </div>" +
                "    </div>" +
                "</body>" +
                "</html>";
    }
}