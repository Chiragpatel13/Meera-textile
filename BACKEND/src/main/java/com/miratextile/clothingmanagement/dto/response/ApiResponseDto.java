package com.miratextile.clothingmanagement.dto.response;

public class ApiResponseDto<T> {
    private boolean success;
    private T data;
    private String message;
    private String errorCode;

    public ApiResponseDto(boolean success, T data, String message, String errorCode) {
        this.success = success;
        this.data = data;
        this.message = message;
        this.errorCode = errorCode;
    }

    public static <T> ApiResponseDto<T> success(T data, String message) {
        return new ApiResponseDto<>(true, data, message, null);
    }

    public static <T> ApiResponseDto<T> error(String message, String errorCode) {
        return new ApiResponseDto<>(false, null, message, errorCode);
    }
}