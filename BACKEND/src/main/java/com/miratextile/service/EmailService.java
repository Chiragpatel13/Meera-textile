package com.miratextile.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void sendCredentials(String to, String username, String password) {
        try {
            logger.info("Sending credentials email to: {}", to);
            Context context = new Context();
            context.setVariable("username", username);
            context.setVariable("password", password);
            
            String content = templateEngine.process("credentials", context);
            logger.debug("Processed credentials email template");
            
            sendEmail(to, "Your Account Credentials", content);
            logger.info("Credentials email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send credentials email to: {}. Error: {}", to, e.getMessage(), e);
            // Don't throw the exception - allow user creation to continue
        }
    }

    public void sendPasswordReset(String to, String newPassword) {
        try {
            logger.info("Sending password reset email to: {}", to);
            Context context = new Context();
            context.setVariable("newPassword", newPassword);
            
            String content = templateEngine.process("password-reset", context);
            logger.debug("Processed password reset email template");
            
            sendEmail(to, "Password Reset", content);
            logger.info("Password reset email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}. Error: {}", to, e.getMessage(), e);
            // Don't throw the exception - allow password reset to continue
        }
    }

    private void sendEmail(String to, String subject, String content) throws MessagingException {
        logger.debug("Creating MimeMessage for: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(content, true);
        
        logger.debug("Sending email to: {} with subject: {}", to, subject);
        mailSender.send(message);
        logger.debug("Email sent successfully");
    }
}