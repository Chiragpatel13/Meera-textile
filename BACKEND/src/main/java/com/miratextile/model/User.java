package com.miratextile.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class User {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String passwordHash;
    private String role;
    private boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime lastLogin;
}