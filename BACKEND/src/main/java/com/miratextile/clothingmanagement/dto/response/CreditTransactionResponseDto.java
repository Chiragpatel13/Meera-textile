package com.miratextile.clothingmanagement.dto.response;

import java.time.LocalDate;
import java.time.ZonedDateTime;

public class CreditTransactionResponseDto {
    private Integer creditId;
    private Integer customerId;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Double totalAmount;
    private Double paidAmount;
    private String status;
    private ZonedDateTime createdAt;
}