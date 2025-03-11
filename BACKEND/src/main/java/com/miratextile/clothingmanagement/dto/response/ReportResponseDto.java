package com.miratextile.clothingmanagement.dto.response;

import java.time.ZonedDateTime;

public class ReportResponseDto {
    private String reportType;
    private ZonedDateTime generatedAt;
    private String data; // JSON or formatted string depending on report type
}