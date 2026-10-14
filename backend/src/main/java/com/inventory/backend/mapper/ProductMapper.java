package com.inventory.backend.mapper;

import org.springframework.stereotype.Component;
import com.inventory.backend.dto.ProductRequest;
import com.inventory.backend.dto.ProductResponse;
import com.inventory.backend.entity.Product;

@Component
public class ProductMapper {
    public Product toEntity(ProductRequest productRequest) {
        return new Product(
                productRequest.name(),
                productRequest.description(),
                productRequest.price(),
                productRequest.stock(),
                productRequest.category());
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getCategory());
    }

    public void updateEntityFromRequest(ProductRequest request, Product product) {
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        product.setCategory(request.category());
    }
}
