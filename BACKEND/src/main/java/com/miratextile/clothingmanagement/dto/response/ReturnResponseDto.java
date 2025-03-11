package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;
import java.util.List;

public class ReturnResponseDto {
    private Integer returnId;
    private Integer orderId;
    private Double totalReturnAmount;
    private String status;
    private String reason;
    private ZonedDateTime returnDate;
    private List<ReturnItemResponseDto> returnItems;

    public static class ReturnItemResponseDto {
        private Integer returnItemId;
        private Integer orderItemId;
        private Double quantity;
        private String reason;
    }
}