package com.ApplicationUdemy.service;

import com.ApplicationUdemy.dtos.OrderItemDTO;
import com.ApplicationUdemy.dtos.response.OrderResponse;
import com.ApplicationUdemy.enums.OrderStatus;
import com.ApplicationUdemy.models.CartItem;
import com.ApplicationUdemy.models.Order;
import com.ApplicationUdemy.models.OrderItem;
import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import com.ApplicationUdemy.repository.OrderRepository;
import com.ApplicationUdemy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final CartService cartService;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    @Transactional
    public Optional<OrderResponse> createOrder(String userId) {
        //Validate for user
        Optional<User> userOptional =userRepository.findById(Long.valueOf(userId));
        if(userOptional.isEmpty()){
            return Optional.empty();
        }
        User user=userOptional.get();

        //Validate for cart items
        List<CartItem> cartItems=cartService.getCart(userId);
        if(cartItems.isEmpty()){
            return Optional.empty();
        }

        //Validate products: still active and enough stock
        boolean allAvailable = cartItems.stream().allMatch(item -> {
            Product product = item.getProduct();
            return Boolean.TRUE.equals(product.getActive())
                    && product.getStockQuantity() != null
                    && product.getStockQuantity() >= item.getQuantity();
        });
        if (!allAvailable) {
            return Optional.empty();
        }

        // Create order (unit price = current product price)
        Order order=new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.CONFIRMED);
        List<OrderItem> orderItems=cartItems.stream().map(
                item->new OrderItem(
                        null, item.getProduct(),
                        item.getQuantity(),
                        item.getProduct().getPrice(),
                        order
                )).collect(Collectors.toCollection(ArrayList::new));
        order.setItems(orderItems);

        //Calculate total price
        BigDecimal totalPrice=orderItems.stream()
                .map(orderItem -> orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())))
                .reduce(BigDecimal.ZERO,BigDecimal::add);
        order.setTotalAmount(totalPrice);

        // Decrease stock
        cartItems.forEach(item -> {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
        });

        Order savedOrder=orderRepository.save(order);

        // Clear the cart
        cartService.clearCart(userId);

        return Optional.of(mapToOrderResponse(savedOrder));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrders(String userId) {
        return userRepository.findById(Long.valueOf(userId))
                .map(orderRepository::findByUserOrderByCreatedAtDesc)
                .orElseGet(List::of)
                .stream()
                .map(this::mapToOrderResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public Optional<OrderResponse> getOrder(String userId, Long orderId) {
        return userRepository.findById(Long.valueOf(userId))
                .flatMap(user -> orderRepository.findByIdAndUser(orderId, user))
                .map(this::mapToOrderResponse);
    }

    private OrderResponse mapToOrderResponse(Order order) {
        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getItems().stream().map(orderItem->new OrderItemDTO(
                        orderItem.getId(),
                        orderItem.getProduct().getId(),
                        orderItem.getQuantity(),
                        orderItem.getPrice(),
                        orderItem.getPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity()))
                )).toList(), order.getCreatedAt()
        );
    }
}
