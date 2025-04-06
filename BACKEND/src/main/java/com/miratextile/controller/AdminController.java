package com.miratextile.controller;

import com.miratextile.dto.UserCreationRequest;
import com.miratextile.dto.ApiResponse;
import com.miratextile.model.User;
import com.miratextile.service.UserService;
import com.miratextile.exception.UserAlreadyExistsException;
import com.miratextile.security.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('STORE_MANAGER') or hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody UserCreationRequest request) {
        try {
            log.info("Creating new user with username: {}", request.getUsername());
            User user = userService.createUser(request);
            log.info("User created successfully with ID: {}", user.getUserId());
            return ResponseEntity.ok(new ApiResponse<>(true, "User created successfully", user));
        } catch (UserAlreadyExistsException e) {
            log.warn("Failed to create user: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, e.getMessage(), null));
        } catch (Exception e) {
            log.error("Unexpected error creating user", e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, "Failed to create user: " + e.getMessage(), null));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        try {
            log.info("Fetching all users");
            List<User> users = userService.getAllUsers();
            log.info("Found {} users", users.size());
            return ResponseEntity.ok(new ApiResponse<>(true, "Users retrieved successfully", users));
        } catch (Exception e) {
            log.error("Failed to fetch users", e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, "Failed to fetch users: " + e.getMessage(), null));
        }
    }

    @PostMapping("/users/{userId}/deactivate")
    public ResponseEntity<ApiResponse<Void>> deactivateUser(@PathVariable Long userId) {
        try {
            log.info("Deactivating user with ID: {}", userId);
            userService.deactivateUser(userId);
            log.info("User deactivated successfully");
            return ResponseEntity.ok(new ApiResponse<>(true, "User deactivated successfully", null));
        } catch (Exception e) {
            log.error("Failed to deactivate user", e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, "Failed to deactivate user: " + e.getMessage(), null));
        }
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<ApiResponse<Void>> activateUser(@PathVariable Long userId) {
        try {
            log.info("Activating user with ID: {}", userId);
            userService.activateUser(userId);
            log.info("User activated successfully");
            return ResponseEntity.ok(new ApiResponse<>(true, "User activated successfully", null));
        } catch (Exception e) {
            log.error("Failed to activate user", e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, "Failed to activate user: " + e.getMessage(), null));
        }
    }

    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetUserPassword(@PathVariable Long userId) {
        try {
            log.info("Resetting password for user with ID: {}", userId);
            userService.resetUserPassword(userId);
            log.info("Password reset successfully");
            return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successfully", null));
        } catch (Exception e) {
            log.error("Failed to reset password", e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, "Failed to reset password: " + e.getMessage(), null));
        }
    }

    @GetMapping("/users/current")
    public ResponseEntity<ApiResponse<User>> getCurrentUser(@RequestHeader("Authorization") String token) {
        try {
            log.info("Fetching current user information");
            // Extract username from token
            String username = jwtTokenProvider.getUsernameFromToken(token.substring(7));
            User user = userService.getUserByUsername(username);
            if (user == null) {
                log.warn("User not found for username: {}", username);
                return ResponseEntity.notFound().build();
            }
            log.info("Found user: {}", user.getUsername());
            return ResponseEntity.ok(new ApiResponse<>(true, "User retrieved successfully", user));
        } catch (Exception e) {
            log.error("Error fetching current user", e);
            return ResponseEntity.internalServerError()
                .body(new ApiResponse<>(false, "Failed to fetch user: " + e.getMessage(), null));
        }
    }
}