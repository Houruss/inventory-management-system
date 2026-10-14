package com.inventory.backend.dto;

public record ErrorResponse(
        int status,
        String message) {
}
