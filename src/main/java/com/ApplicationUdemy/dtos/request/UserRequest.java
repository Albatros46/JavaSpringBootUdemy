package com.ApplicationUdemy.dtos.request;

import com.ApplicationUdemy.dtos.AddressDto;
import com.ApplicationUdemy.enums.UserRole;
import lombok.Data;

@Data
public class UserRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private AddressDto address;
}
