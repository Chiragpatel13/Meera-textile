package com.miratextile.clothingmanagement.dto.mapper;

import com.miratextile.clothingmanagement.dto.request.SignupRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;
import com.miratextile.clothingmanagement.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "role", source = "role")
    User toEntity(SignupRequestDto signupRequestDto);

    @Mapping(source = "userId", target = "id")
    @Mapping(source = "role", target = "role", resultType = String.class)
    UserResponseDto toDto(User user);
}