package com.miratextile.service;

import com.miratextile.dto.UserCreationRequest;
import com.miratextile.exception.UserAlreadyExistsException;
import com.miratextile.exception.UserNotFoundException;
import com.miratextile.model.User;
import com.miratextile.repository.UserRepository;
import com.miratextile.util.PasswordGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordGenerator passwordGenerator;
    private final EmailService emailService; // For sending credentials

    @Transactional
    public User createUser(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("Email is already registered");
        }

        // Generate a secure random password
        String rawPassword = passwordGenerator.generateSecurePassword();
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(encodedPassword);
        user.setRole(request.getRole());
        user.setActive(true);
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepository.save(user);

        // Try to send email but don't roll back if it fails
        boolean emailSent = emailService.sendCredentials(user.getEmail(), user.getUsername(), rawPassword);
        if (!emailSent) {
            log.warn("User created but email notification failed. Username: {}", user.getUsername());
            // You might want to store this information somewhere to retry later
        }

        return savedUser;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deactivateUser(Long userId) {
        userRepository.updateActiveStatus(userId, false);
    }

    public void activateUser(Long userId) {
        userRepository.updateActiveStatus(userId, true);
    }

    public void resetUserPassword(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new UserNotFoundException("User not found"));

        String newPassword = passwordGenerator.generateSecurePassword();
        userRepository.updatePassword(userId, passwordEncoder.encode(newPassword));

        // Send new password via email
        emailService.sendPasswordReset(user.getEmail(), user.getUsername(), newPassword);
    }
}