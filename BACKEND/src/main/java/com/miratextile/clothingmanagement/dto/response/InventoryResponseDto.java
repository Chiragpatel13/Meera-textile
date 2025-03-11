package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;

public class InventoryResponseDto {
    private Integer inventoryId;
    private Integer skuId;
    private Double totalQuantity;
    private Double reorderPoint;
    private ZonedDateTime lastRestockedAt;
    private ZonedDateTime lastUpdatedAt;
}