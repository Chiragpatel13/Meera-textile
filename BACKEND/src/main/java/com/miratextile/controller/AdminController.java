package com.miratextile.controller;

import com.miratextile.dto.UserCreationRequest;
import com.miratextile.model.User;
import com.miratextile.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('STORE_MANAGER')")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @PostMapping("/users")
    public ResponseEntity<User> createUser(@Valid @RequestBody UserCreationRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping("/users/{userId}/deactivate")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/activate")
    public ResponseEntity<?> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/reset-password")
    public ResponseEntity<?> resetUserPassword(@PathVariable Long userId) {
        userService.resetUserPassword(userId);
        return ResponseEntity.ok().build();
    }
}