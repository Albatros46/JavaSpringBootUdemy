package com.ApplicationUdemy.dtos.request;

import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data

public class CartItemRequest {
    private Long productId;
    private Integer quantity;
}
