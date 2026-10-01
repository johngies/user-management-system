package com.app.user_management_app.exception;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public record ErrorResponse(
    int status,
    String error,
    String message,
    LocalDateTime timestamp,
    Map<String, String> validationErrors
) {

    public ErrorResponse(int status, String error, String message) {
        this(status, error, message, LocalDateTime.now(), null);
    }

    public ErrorResponse(int status, String error, String message, Map<String, String> validationErrors) {
        this(status, error, message, LocalDateTime.now(), validationErrors);
    }
}
