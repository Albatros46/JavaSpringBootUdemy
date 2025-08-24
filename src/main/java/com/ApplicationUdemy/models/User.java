package com.ApplicationUdemy.models;
//import jakarta.persistence.*;
import com.ApplicationUdemy.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

//@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Getter
@Setter
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @JsonProperty("firstName")
    private String firstName;
    @JsonProperty("lastName")
    private String lastName;
    @JsonProperty("email")
    private String email;
    @JsonProperty("phone")
    private String phone;
    @Enumerated(EnumType.ORDINAL)
    private UserRole role = UserRole.CUSTOMER;




}
