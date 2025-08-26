package com.ApplicationUdemy.dtos.response;

import com.ApplicationUdemy.dtos.AddressDto;
import com.ApplicationUdemy.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UserResponse {
    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private UserRole role ;
    private AddressDto address;
}
