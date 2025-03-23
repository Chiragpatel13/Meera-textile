package com.miratextile.clothingmanagement.dto.mapper;


import com.miratextile.clothingmanagement.dto.request.UserRequestDto;
import com.miratextile.clothingmanagement.dto.response.UserResponseDto;
import com.miratextile.clothingmanagement.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "role", source = "role")
    User toEntity(UserRequestDto userRequestDto);

    @Mapping(source = "userId", target = "id")
    @Mapping(source = "role", target = "role", resultType = String.class)
    UserResponseDto toDto(User user);

    @Mapping(target = "userId", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "passwordHash", source = "password")
    @Mapping(target = "role", source = "role")
    void updateEntityFromDto(UserRequestDto userRequestDto, @MappingTarget User user);
}