package com.app.user_management_app.dto;

import java.time.LocalDate;

import com.app.user_management_app.entity.Gender;

public record UserResponse(
    Long id,
    String name,
    String surname,
    Gender gender,
    LocalDate birthdate,
    String homeAddress,
    String workAddress
) {
}
