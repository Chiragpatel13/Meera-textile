package com.miratextile.clothingmanagement.dto.request;

import java.util.List;

public class OrderRequestDto {
    private Integer customerId;
    private Double discountPercentage;
    private List<OrderItemRequestDto> orderItems;

    public static class OrderItemRequestDto {
        private Integer skuId;
        private Double quantity;
    }
}