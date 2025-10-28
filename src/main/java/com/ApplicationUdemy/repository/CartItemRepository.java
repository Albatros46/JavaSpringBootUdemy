package com.ApplicationUdemy.repository;

import com.ApplicationUdemy.models.CartItem;
import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem,Long> {
    CartItem findByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
    List<CartItem> findByUser( User user);
    @Modifying
    @Transactional
    void deleteByUser(User user);
}
