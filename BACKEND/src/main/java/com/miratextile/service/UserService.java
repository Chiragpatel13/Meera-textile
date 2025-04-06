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
    private final EmailService emailService;

    @Transactional
    public User createUser(UserCreationRequest request) {
        log.info("Starting user creation process...");
        log.info("Request data: username={}, email={}, role={}", 
            request.getUsername(), request.getEmail(), request.getRole());
        
        try {
            // Validate request
            if (request == null) {
                log.error("User creation request is null");
                throw new IllegalArgumentException("Request cannot be null");
            }
            
            // Trim and validate input values
            String username = request.getUsername() != null ? request.getUsername().trim() : null;
            String email = request.getEmail() != null ? request.getEmail().trim() : null;
            String fullName = request.getFullName() != null ? request.getFullName().trim() : "";
            String role = request.getRole() != null ? request.getRole().trim() : null;
            
            log.info("Processed input values: username={}, email={}, fullName={}, role={}", 
                username, email, fullName, role);
            
            // Validate required fields
            if (username == null || username.isEmpty()) {
                log.error("Username is required");
                throw new IllegalArgumentException("Username is required");
            }
            if (email == null || email.isEmpty()) {
                log.error("Email is required");
                throw new IllegalArgumentException("Email is required");
            }
            if (role == null || role.isEmpty()) {
                log.error("Role is required");
                throw new IllegalArgumentException("Role is required");
            }
            
            // Validate role format
            if (!role.equals("SALES_STAFF") && !role.equals("INVENTORY_STAFF") && 
                !role.equals("ADMIN") && !role.equals("STORE_MANAGER")) {
                log.error("Invalid role: {}. Must be either SALES_STAFF, INVENTORY_STAFF, ADMIN, or STORE_MANAGER", role);
                throw new IllegalArgumentException("Role must be either SALES_STAFF, INVENTORY_STAFF, ADMIN, or STORE_MANAGER");
            }

            log.info("Checking for existing username: {}", username);
            if (userRepository.existsByUsername(username)) {
                log.warn("Username already exists: {}", username);
                throw new UserAlreadyExistsException("Username is already taken");
            }

            log.info("Checking for existing email: {}", email);
            if (userRepository.existsByEmail(email)) {
                log.warn("Email already exists: {}", email);
                throw new UserAlreadyExistsException("Email is already registered");
            }

            // Handle password
            String rawPassword = request.getPassword();
            if (rawPassword == null || rawPassword.trim().isEmpty()) {
                log.info("No password provided, generating random password");
                rawPassword = passwordGenerator.generateSecurePassword();
                log.info("Generated password: {}", rawPassword);
            } else {
                rawPassword = rawPassword.trim();
                log.info("Using provided password");
            }
            
            log.info("Encoding password");
            String encodedPassword = passwordEncoder.encode(rawPassword);

            // Create user entity
            log.info("Creating user entity");
            User user = new User();
            user.setUsername(username);
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPasswordHash(encodedPassword);
            user.setRole(role);
            user.setActive(true);
            user.setCreatedAt(LocalDateTime.now());

            // Save user to database
            log.info("Attempting to save user to database");
            try {
                log.info("User entity before save: {}", user);
                User savedUser = userRepository.save(user);
                log.info("User saved successfully. User after save: {}", savedUser);

                // Send credentials email
                try {
                    log.info("Sending credentials email to: {}", email);
                    emailService.sendCredentials(email, username, rawPassword);
                    log.info("Credentials email sent successfully");
                } catch (Exception e) {
                    log.warn("Email sending failed but user was created. Error: {}", e.getMessage(), e);
                }

                return savedUser;
            } catch (Exception e) {
                log.error("Database error while saving user: {}", e.getMessage(), e);
                throw new RuntimeException("Failed to save user to database: " + e.getMessage());
            }
        } catch (Exception e) {
            log.error("Error in createUser: {}", e.getMessage(), e);
            throw e;
        }
    }

    public List<User> getAllUsers() {
        log.debug("Fetching all users");
        try {
            List<User> users = userRepository.findAll();
            log.debug("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            log.error("Error fetching users", e);
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    @Transactional
    public void deactivateUser(Long userId) {
        log.debug("Deactivating user with ID: {}", userId);
        try {
            userRepository.deactivateUser(userId);
            log.info("User {} deactivated successfully", userId);
        } catch (Exception e) {
            log.error("Error deactivating user {}", userId, e);
            throw new RuntimeException("Failed to deactivate user", e);
        }
    }

    @Transactional
    public void activateUser(Long userId) {
        log.debug("Activating user with ID: {}", userId);
        try {
            userRepository.activateUser(userId);
            log.info("User {} activated successfully", userId);
        } catch (Exception e) {
            log.error("Error activating user {}", userId, e);
            throw new RuntimeException("Failed to activate user", e);
        }
    }

    @Transactional
    public void resetUserPassword(Long userId) {
        log.debug("Resetting password for user ID: {}", userId);
        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

            String newPassword = passwordGenerator.generateSecurePassword();
            userRepository.updatePassword(userId, passwordEncoder.encode(newPassword));

            try {
                emailService.sendPasswordReset(user.getEmail(), newPassword);
                log.info("Password reset email sent successfully to: {}", user.getEmail());
            } catch (Exception e) {
                log.warn("Password reset but email notification failed. Username: {}. Error: {}", 
                        user.getUsername(), e.getMessage());
            }
            log.info("Password reset successful for user ID: {}", userId);
        } catch (Exception e) {
            log.error("Error resetting password for user {}", userId, e);
            throw new RuntimeException("Failed to reset password", e);
        }
    }

    @Transactional
    public void updatePassword(Long userId, String newPassword) {
        log.debug("Updating password for user ID: {}", userId);
        try {
            String encodedPassword = passwordEncoder.encode(newPassword);
            userRepository.updatePassword(userId, encodedPassword);
            log.info("Password updated successfully for user ID: {}", userId);
        } catch (Exception e) {
            log.error("Error updating password for user {}", userId, e);
            throw new RuntimeException("Failed to update password", e);
        }
    }

    public User getUserByUsername(String username) {
        log.debug("Fetching user by username: {}", username);
        try {
            return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found with username: " + username));
        } catch (Exception e) {
            log.error("Error fetching user by username: {}", username, e);
            throw new RuntimeException("Failed to fetch user", e);
        }
    }
}
