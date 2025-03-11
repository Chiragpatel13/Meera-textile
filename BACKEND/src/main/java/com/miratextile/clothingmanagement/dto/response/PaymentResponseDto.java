package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;

public class PaymentResponseDto {
    private Integer paymentId;
    private Integer orderId;
    private Double amount;
    private String paymentMethod;
    private String paymentStatus;
    private String qrCodeReference;
    private ZonedDateTime transactionTime;
}