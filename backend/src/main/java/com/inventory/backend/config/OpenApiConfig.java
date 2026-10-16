package com.inventory.backend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(info = @Info(title = "Inventory Management API", version = "1.0.0", description = "REST API for managing inventory products. "
        + "Supports creating, listing, updating, "
        + "retrieving, and deleting products."))
public class OpenApiConfig {
}
