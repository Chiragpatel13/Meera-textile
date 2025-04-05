package com.miratextile.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessagePreparator;

import jakarta.mail.internet.MimeMessage;
import java.io.InputStream;
import java.util.Objects;

@Slf4j
public class NoOpMailSender implements JavaMailSender {

    @Override
    public void send(SimpleMailMessage simpleMessage) throws MailException {
        log.info("Development mode - Email would have been sent to: {}", Objects.requireNonNull(simpleMessage.getTo())[0]);
        log.info("Subject: {}", simpleMessage.getSubject());
        log.info("Text: {}", simpleMessage.getText());
    }

    @Override
    public void send(SimpleMailMessage... simpleMessages) throws MailException {

    }

    @Override
    public MimeMessage createMimeMessage() {
        return null;
    }

    @Override
    public MimeMessage createMimeMessage(InputStream contentStream) throws MailException {
        return null;
    }

    @Override
    public void send(MimeMessage mimeMessage) throws MailException {
        JavaMailSender.super.send(mimeMessage);
    }

    @Override
    public void send(MimeMessage... mimeMessages) throws MailException {

    }

    @Override
    public void send(MimeMessagePreparator mimeMessagePreparator) throws MailException {
        JavaMailSender.super.send(mimeMessagePreparator);
    }

    @Override
    public void send(MimeMessagePreparator... mimeMessagePreparators) throws MailException {
        JavaMailSender.super.send(mimeMessagePreparators);
    }
}