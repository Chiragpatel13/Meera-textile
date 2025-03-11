package com.miratextile.clothingmanagement.dto.request;

import java.time.LocalDate;

public class CreditTransactionRequestDto {
    private Integer customerId;
    private LocalDate startDate;
    private LocalDate dueDate;
    private Double totalAmount;
}