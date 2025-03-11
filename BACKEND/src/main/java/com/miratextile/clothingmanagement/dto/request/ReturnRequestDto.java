package com.miratextile.clothingmanagement.dto.request;

import java.util.List;

public class ReturnRequestDto {
    private Integer orderId;
    private String reason;
    private List<ReturnItemRequestDto> returnItems;

    public static class ReturnItemRequestDto {
        private Integer orderItemId;
        private Double quantity;
        private String reason;
    }
}