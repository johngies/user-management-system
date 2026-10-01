package com.app.user_management_app.dto;

public record UserSummaryResponse(
    Long id,
    String name,
    String surname
) {
}
