package com.ApplicationUdemy.dtos.request;

import lombok.Data;

@Data

public class CartItemRequest {
    private Long productId;
    private Integer quantity;
}
