package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;
import java.util.List;

public class OrderResponseDto {
    private Integer orderId;
    private Integer customerId;
    private Double totalAmount;
    private Double discountPercentage;
    private Double taxAmount;
    private Double netAmount;
    private ZonedDateTime orderDate;
    private List<OrderItemResponseDto> orderItems;

    public static class OrderItemResponseDto {
        private Integer orderItemId;
        private Integer skuId;
        private Double quantity;
        private Double unitPrice;
        private Double subtotal;
    }
}