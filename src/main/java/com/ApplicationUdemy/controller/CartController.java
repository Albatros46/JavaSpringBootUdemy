package com.ApplicationUdemy.controller;

import com.ApplicationUdemy.dtos.request.CartItemRequest;
import com.ApplicationUdemy.models.CartItem;
import com.ApplicationUdemy.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    @PostMapping
    public ResponseEntity<String> addToCart(
            @RequestHeader("X-User-ID") String userId,
            @RequestBody CartItemRequest request) {

        boolean isAdded = cartService.addToCart(userId, request);

        if (!isAdded) {
            return ResponseEntity
                    .badRequest()
                    .body("Product out of stock, user not found, or product not found!");
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body("Product successfully added to cart!");
    }
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @RequestHeader("X-User-ID") String userId,
            @PathVariable Long productId
    ) {
        boolean deleted = cartService.deleteItemFromCart(userId, productId);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    @GetMapping("/getAllcartItem")
    public ResponseEntity<List<CartItem>>getCart( @RequestHeader("X-User-ID")String userId){
        return ResponseEntity.ok(cartService.getCart(userId));
    }

}
