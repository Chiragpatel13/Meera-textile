package com.miratextile.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public boolean sendCredentials(String to, String username, String password) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Your Account Credentials");
            message.setText(String.format("""
                Hello,
                
                Your account has been created with the following credentials:
                Username: %s
                Password: %s
                
                Please change your password after first login.
                
                Best regards,
                System Administrator
                """, username, password));

            mailSender.send(message);
            log.info("Credentials email sent successfully to: {}", to);
            return true;
        } catch (MailException e) {
            log.error("Failed to send credentials email to: {}", to, e);
            return false;
        }
    }
    public void sendPasswordReset(String to, String username, String newPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Password Reset - Clothing Management System");
        message.setText(String.format("""
            Dear User,
            
            Your password has been reset.
            
            Username: %s
            New Password: %s
            
            Please change your password after logging in.
            
            Best regards,
            System Administrator
            """, username, newPassword));

        mailSender.send(message);
    }
}