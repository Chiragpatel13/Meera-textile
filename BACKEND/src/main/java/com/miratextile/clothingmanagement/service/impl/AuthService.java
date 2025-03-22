package com.miratextile.clothingmanagement.service.impl;

import com.miratextile.clothingmanagement.dto.request.SignupRequestDto;
import com.miratextile.clothingmanagement.dto.request.SigninRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;

public interface AuthService {
    UserResponseDto signup(SignupRequestDto signupRequestDto);
    String signin(SigninRequestDto signinRequestDto);
}