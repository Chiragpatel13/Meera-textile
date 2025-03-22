package com.miratextile.clothingmanagement.service.impl;

import com.miratextile.clothingmanagement.dto.mapper.UserMapper;
import com.miratextile.clothingmanagement.dto.request.SignupRequestDto;
import com.miratextile.clothingmanagement.dto.request.UserRequestDto;
import com.miratextile.clothingmanagement.dto.response.SignInRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;
import com.miratextile.clothingmanagement.enums.UserRole;
import com.miratextile.clothingmanagement.model.User;
import com.miratextile.clothingmanagement.repository.UserRepository;
import com.miratextile.clothingmanagement.service.AuthService;
import com.miratextile.clothingmanagement.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder,
                           AuthenticationManager authenticationManager, UserDetailsService userDetailsService,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public UserResponseDto signUp(SignupRequestDto signupRequestDto) {
        if (userRepository.findByUsername(signupRequestDto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.findByEmail(signupRequestDto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        UserRequestDto userRequestDto = new UserRequestDto();
        userRequestDto.setEmail(signupRequestDto.getEmail());
        userRequestDto.setFullName(signupRequestDto.getFullName());
        userRequestDto.setPassword(signupRequestDto.getPassword());
        userRequestDto.setUsername(signupRequestDto.getUsername());
        userRequestDto.setRole(signupRequestDto.getRole());

        User user = userMapper.toEntity(userRequestDto);
        user.setPasswordHash(passwordEncoder.encode(signupRequestDto.getPassword()));
        user.setRole(UserRole.valueOf(signupRequestDto.getRole()));
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    public String signIn(SignInRequestDto signinRequestDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(signinRequestDto.getUsername(), signinRequestDto.getPassword())
        );
        UserDetails userDetails = userDetailsService.loadUserByUsername(signinRequestDto.getUsername());
        return jwtUtil.generateToken(userDetails);
    }
}