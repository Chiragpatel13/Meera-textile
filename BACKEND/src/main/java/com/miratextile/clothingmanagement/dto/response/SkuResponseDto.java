package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;

public class SkuResponseDto {
    private Integer skuId;
    private String skuCode;
    private String fabricType;
    private String color;
    private String pattern;
    private Double pricePerMeter;
    private ZonedDateTime createdAt;
    private ZonedDateTime lastUpdatedAt;
}