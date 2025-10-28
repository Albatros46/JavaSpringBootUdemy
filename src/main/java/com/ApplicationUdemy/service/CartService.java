package com.ApplicationUdemy.service;

import com.ApplicationUdemy.dtos.request.CartItemRequest;
import com.ApplicationUdemy.models.CartItem;
import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import com.ApplicationUdemy.repository.CartItemRepository;
import com.ApplicationUdemy.repository.ProductRepository;
import com.ApplicationUdemy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public boolean addToCart(String userId, CartItemRequest request) {
        // 1. Ürün kontrolü
        Optional<Product> productOptional = productRepository.findById(request.getProductId());
        if (productOptional.isEmpty()) {
            return false;
        }

        Product product = productOptional.get();

        // 2. Stok kontrolü
        if (product.getStockQuantity() < request.getQuantity()) {
            return false;
        }

        // 3. Kullanıcı kontrolü
        Optional<User> userOptional = userRepository.findById(Long.valueOf(userId));
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // 4. Daha önce eklenmiş mi kontrolü
        Optional<CartItem> existingCartItemOptional = Optional.ofNullable(
                cartItemRepository.findByUserAndProduct(user, product)
        );

        if (existingCartItemOptional.isPresent()) {
            // --- Sepette ürün varsa: miktar ve fiyat güncelle
            CartItem existingCartItem = existingCartItemOptional.get();
            int newQuantity = existingCartItem.getQuantity() + request.getQuantity();
            existingCartItem.setQuantity(newQuantity);
            existingCartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
            cartItemRepository.save(existingCartItem);
        } else {
            // --- Sepette ürün yoksa: yeni CartItem oluştur
            CartItem cartItem = new CartItem();
            cartItem.setUser(user);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cartItemRepository.save(cartItem);
        }

        return true;
    }


    public boolean deleteItemFromCart(String userId, Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        Optional<User> userOpt = userRepository.findById(Long.valueOf(userId));

        if (productOpt.isPresent() && userOpt.isPresent()) {
            cartItemRepository.deleteByUserAndProduct(userOpt.get(), productOpt.get());
            return true;
        }
        return false;
    }

    public List<CartItem> getCart(String userId) {
        return userRepository.findById(Long.valueOf(userId))
                .map(cartItemRepository::findByUser)
                .orElseGet(List::of);
    }
    @Transactional
    public void clearCart(String userId) {
        userRepository.findById(Long.valueOf(userId)).ifPresent(
                cartItemRepository::deleteByUser);
    }
}
