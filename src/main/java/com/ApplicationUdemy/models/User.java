package com.ApplicationUdemy.models;
//import jakarta.persistence.*;
import com.ApplicationUdemy.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

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
    @Enumerated(EnumType.STRING)
   // @Column(nullable = false)
    private UserRole role ;//= UserRole.ADMIN;//


    //---Relationship
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "address_id",referencedColumnName = "id")
    private Address address;

    @CreationTimestamp
    private LocalDateTime cratedAt;
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
