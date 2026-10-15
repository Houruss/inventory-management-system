
package com.inventory.backend.service;

import com.inventory.backend.repository.ProductRepository;
import com.inventory.backend.mapper.ProductMapper;
import com.inventory.backend.exception.ProductNotFoundException;
import com.inventory.backend.entity.Product;
import java.math.BigDecimal;
import static org.mockito.Mockito.verify;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    @Test
    void getProductById_whenProductDoesNotExist_throwsException() {

        Long id = 999L;

        when(productRepository.findById(id))
                .thenReturn(Optional.empty());

        assertThrows(
                ProductNotFoundException.class,
                () -> productService.getProductById(id));
    }

    @Test
    void deleteProduct_whenProductExists_deletesProduct() {

        Long id = 1L;
        Product product = new Product(
                "Teclado Logitech",
                "Teclado mecanico",
                new BigDecimal("450.00"),
                12,
                "Perifericos");
        when(productRepository.findById(id))
                .thenReturn(Optional.of(product));
        productService.deleteProduct(id);
        verify(productRepository).delete(product);
    }
}
