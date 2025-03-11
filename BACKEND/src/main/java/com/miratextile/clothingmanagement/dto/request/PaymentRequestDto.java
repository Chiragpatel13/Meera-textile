package com.miratextile.clothingmanagement.dto.request;

public class PaymentRequestDto {
    private Integer orderId;
    private Double amount;
    private String paymentMethod; // "CASH" or "QR_CODE"
}