package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;

public class CustomerResponseDto {
    private Integer customerId;
    private String fullName;
    private String phoneNumber;
    private String email;
    private String address;
    private Double totalPurchases;
    private ZonedDateTime createdAt;
    private ZonedDateTime lastPurchaseDate;
}