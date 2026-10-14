package com.ApplicationUdemy.repository;

import com.ApplicationUdemy.models.CartItem;
import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    List<CartItem> findByUser(User user);
    void deleteByUser(User user);
}
