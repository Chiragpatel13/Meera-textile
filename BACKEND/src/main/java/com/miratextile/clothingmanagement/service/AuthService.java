package com.miratextile.clothingmanagement.service;


import com.miratextile.clothingmanagement.dto.request.UserRequestDto;

public interface AuthService {
    String login(UserRequestDto loginRequest);
}