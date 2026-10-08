package com.app.user_management_app.dto;

import java.time.LocalDate;

import com.app.user_management_app.entity.Gender;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;

public record UpdateUserRequest(

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name cannot exceed 50 characters")
    String name,

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name cannot exceed 50 characters")
    String surname,

    @NotNull(message = "Gender is required")
    Gender gender,

    @NotNull(message = "Birthdate is required")
    @Past(message = "Birthdate must be in the past")
    LocalDate birthdate,

    @Size(max = 255, message = "Home address cannot exceed 255 characters")
    String homeAddress,

    @Size(max = 255, message = "Work address cannot exceed 255 characters")
    String workAddress
    
) {

}

