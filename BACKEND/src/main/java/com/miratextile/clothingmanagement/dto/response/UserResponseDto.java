package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;

public class UserResponseDto {
    private Integer userId;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private Boolean isActive;
    private ZonedDateTime createdAt;
    private ZonedDateTime lastLogin;
}