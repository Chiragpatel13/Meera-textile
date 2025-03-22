package com.miratextile.clothingmanagement.service.impl;


import com.miratextile.clothingmanagement.dto.mapper.UserMapper;
import com.miratextile.clothingmanagement.dto.request.UserRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;
import com.miratextile.clothingmanagement.enums.UserRole;
import com.miratextile.clothingmanagement.exception.ResourceNotFoundException;
import com.miratextile.clothingmanagement.model.User;
import com.miratextile.clothingmanagement.repository.UserRepository;
import com.miratextile.clothingmanagement.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserResponseDto createUser(UserRequestDto userRequestDto) {
        User user = userMapper.toEntity(userRequestDto);
        user.setPasswordHash(passwordEncoder.encode(userRequestDto.getPassword()));
        user.setRole(UserRole.valueOf(userRequestDto.getRole()));
        User savedUser = userRepository.save(user);
        return userMapper.toDto(savedUser);
    }

    @Override
    public UserResponseDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return userMapper.toDto(user);
    }

    @Override
    public List<UserResponseDto> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream().map(userMapper::toDto).collect(Collectors.toList());
    }

    @Override
    public UserResponseDto updateUser(Long id, UserRequestDto userRequestDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userMapper.updateEntityFromDto(userRequestDto, user);
        if (userRequestDto.getPassword() != null && !userRequestDto.getPassword().isEmpty()) {
            user.setPasswordHash(passwordEncoder.encode(userRequestDto.getPassword()));
        }
        user.setRole(UserRole.valueOf(userRequestDto.getRole()));
        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        userRepository.delete(user);
    }
}