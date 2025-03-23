package com.miratextile.clothingmanagement.service;

import com.miratextile.clothingmanagement.dto.request.SignupRequestDto;
import com.miratextile.clothingmanagement.dto.request.SigninRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;

public interface AuthService {
    UserResponseDto signUp(SignupRequestDto signupRequestDto);
    String signIn(SigninRequestDto signinRequestDto);
}