package com.inventory.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.inventory.backend.entity.Product;

public interface ProductRepository
        extends JpaRepository<Product, Long> {
}
