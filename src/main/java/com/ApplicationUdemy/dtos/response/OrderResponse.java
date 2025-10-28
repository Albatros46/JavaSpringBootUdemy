package com.ApplicationUdemy.dtos.response;

import com.ApplicationUdemy.dtos.OrderItemDTO;
import com.ApplicationUdemy.enums.OrderStatus;
import com.ApplicationUdemy.models.OrderItem;
import com.ApplicationUdemy.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
@Data
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private List<OrderItemDTO> items;
    private LocalDateTime createdAt;
   // private LocalDateTime updatedAt;
}
