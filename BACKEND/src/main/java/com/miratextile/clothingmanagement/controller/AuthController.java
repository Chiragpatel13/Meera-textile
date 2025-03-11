package com.miratextile.clothingmanagement.controller;

import com.miratextile.clothingmanagement.dto.request.SignupRequestDto;
import com.miratextile.clothingmanagement.dto.response.AuthResponseDto;
import com.miratextile.clothingmanagement.dto.response.SigninRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;
import com.miratextile.clothingmanagement.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> signup(@RequestBody SignupRequestDto signupRequestDto) {
        UserResponseDto user = authService.signup(signupRequestDto);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponseDto> signin(@RequestBody SigninRequestDto signinRequestDto) {
        String token = authService.signin(signinRequestDto);
        return ResponseEntity.ok(new AuthResponseDto(token));
    }
}