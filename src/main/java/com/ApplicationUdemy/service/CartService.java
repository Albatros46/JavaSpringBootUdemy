package com.ApplicationUdemy.service;

import com.ApplicationUdemy.dtos.request.CartItemRequest;
import com.ApplicationUdemy.dtos.response.CartItemResponse;
import com.ApplicationUdemy.models.CartItem;
import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import com.ApplicationUdemy.repository.CartItemRepository;
import com.ApplicationUdemy.repository.ProductRepository;
import com.ApplicationUdemy.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @Transactional
    public boolean addToCart(String userId, CartItemRequest request) {
        // 0. İstek kontrolü
        if (request.getProductId() == null || request.getQuantity() == null || request.getQuantity() <= 0) {
            return false;
        }

        // 1. Ürün kontrolü (silinmiş/pasif ürün sepete eklenemez)
        Optional<Product> productOptional = productRepository.findById(request.getProductId());
        if (productOptional.isEmpty() || !Boolean.TRUE.equals(productOptional.get().getActive())) {
            return false;
        }

        Product product = productOptional.get();

        // 2. Kullanıcı kontrolü
        Optional<User> userOptional = userRepository.findById(Long.valueOf(userId));
        if (userOptional.isEmpty()) {
            return false;
        }

        User user = userOptional.get();

        // 3. Daha önce eklenmiş mi kontrolü
        Optional<CartItem> existingCartItemOptional = cartItemRepository.findByUserAndProduct(user, product);
        int quantityInCart = existingCartItemOptional.map(CartItem::getQuantity).orElse(0);
        int newQuantity = quantityInCart + request.getQuantity();

        // 4. Stok kontrolü (sepette zaten bulunan miktar da hesaba katılır)
        if (product.getStockQuantity() == null || product.getStockQuantity() < newQuantity) {
            return false;
        }

        // --- Sepette ürün varsa miktar güncellenir, yoksa yeni CartItem oluşturulur
        CartItem cartItem = existingCartItemOptional.orElseGet(() -> {
            CartItem newItem = new CartItem();
            newItem.setUser(user);
            newItem.setProduct(product);
            return newItem;
        });
        cartItem.setQuantity(newQuantity);
        cartItem.setPrice(product.getPrice().multiply(BigDecimal.valueOf(newQuantity)));
        cartItemRepository.save(cartItem);

        return true;
    }

    @Transactional
    public boolean deleteItemFromCart(String userId, Long productId) {
        Optional<Product> productOpt = productRepository.findById(productId);
        Optional<User> userOpt = userRepository.findById(Long.valueOf(userId));

        if (productOpt.isEmpty() || userOpt.isEmpty()) {
            return false;
        }

        // Ürün kullanıcının sepetinde yoksa 404 dönebilmek için false
        return cartItemRepository.findByUserAndProduct(userOpt.get(), productOpt.get())
                .map(cartItem -> {
                    cartItemRepository.delete(cartItem);
                    return true;
                })
                .orElse(false);
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCart(String userId) {
        return userRepository.findById(Long.valueOf(userId))
                .map(cartItemRepository::findByUser)
                .orElseGet(List::of);
    }

    @Transactional(readOnly = true)
    public List<CartItemResponse> getCartItems(String userId) {
        return getCart(userId).stream()
                .map(this::mapToCartItemResponse)
                .toList();
    }

    @Transactional
    public void clearCart(String userId) {
        userRepository.findById(Long.valueOf(userId)).ifPresent(
                cartItemRepository::deleteByUser);
    }

    private CartItemResponse mapToCartItemResponse(CartItem cartItem) {
        return new CartItemResponse(
                cartItem.getId(),
                cartItem.getProduct().getId(),
                cartItem.getProduct().getName(),
                cartItem.getQuantity(),
                cartItem.getProduct().getPrice(),
                cartItem.getPrice()
        );
    }
}
