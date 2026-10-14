package com.ApplicationUdemy;

import com.ApplicationUdemy.models.Product;
import com.ApplicationUdemy.models.User;
import com.ApplicationUdemy.repository.ProductRepository;
import com.ApplicationUdemy.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OrderFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;

    private User createUser() {
        User user = new User();
        user.setFirstName("Test");
        user.setLastName("User");
        return userRepository.save(user);
    }

    private Product createProduct(String price, int stock) {
        Product product = new Product();
        product.setName("Laptop");
        product.setPrice(new BigDecimal(price));
        product.setStockQuantity(stock);
        return productRepository.save(product);
    }

    private void addToCart(Long userId, Long productId, int quantity, int expectedStatus) throws Exception {
        mockMvc.perform(post("/api/cart")
                        .header("X-User-ID", userId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"productId\":" + productId + ",\"quantity\":" + quantity + "}"))
                .andExpect(status().is(expectedStatus));
    }

    @Test
    void createOrder_calculatesTotalsDecreasesStockAndClearsCart() throws Exception {
        User user = createUser();
        Product product = createProduct("100.00", 5);

        addToCart(user.getId(), product.getId(), 2, 201);
        addToCart(user.getId(), product.getId(), 1, 201);

        mockMvc.perform(get("/api/cart").header("X-User-ID", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].quantity").value(3))
                .andExpect(jsonPath("$[0].price").value(300.00))
                .andExpect(jsonPath("$[0].user").doesNotExist());

        mockMvc.perform(post("/api/order").header("X-User-ID", user.getId()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.totalAmount").value(300.00))
                .andExpect(jsonPath("$.status").value("CONFIRMED"))
                .andExpect(jsonPath("$.items[0].price").value(100.00))
                .andExpect(jsonPath("$.items[0].subTotal").value(300.00));

        assertThat(productRepository.findById(product.getId()).orElseThrow().getStockQuantity()).isEqualTo(2);

        mockMvc.perform(get("/api/cart").header("X-User-ID", user.getId()))
                .andExpect(jsonPath("$").isEmpty());

        mockMvc.perform(get("/api/order").header("X-User-ID", user.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));
    }

    @Test
    void addToCart_rejectsQuantityAboveStockIncludingExistingCartItems() throws Exception {
        User user = createUser();
        Product product = createProduct("10.00", 3);

        addToCart(user.getId(), product.getId(), 2, 201);
        addToCart(user.getId(), product.getId(), 2, 400);
        addToCart(user.getId(), product.getId(), 0, 400);
    }

    @Test
    void removeFromCart_returnsNotFoundWhenItemNotInCart() throws Exception {
        User user = createUser();
        Product product = createProduct("10.00", 3);

        mockMvc.perform(delete("/api/cart/items/" + product.getId()).header("X-User-ID", user.getId()))
                .andExpect(status().isNotFound());

        addToCart(user.getId(), product.getId(), 1, 201);
        mockMvc.perform(delete("/api/cart/items/" + product.getId()).header("X-User-ID", user.getId()))
                .andExpect(status().isNoContent());
    }

    @Test
    void invalidUserHeader_returnsBadRequest() throws Exception {
        mockMvc.perform(get("/api/cart").header("X-User-ID", "abc"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void newUser_getsCustomerRole() throws Exception {
        User user = createUser();
        mockMvc.perform(get("/api/users/" + user.getId()))
                .andExpect(jsonPath("$.role").value("CUSTOMER"));
    }
}
