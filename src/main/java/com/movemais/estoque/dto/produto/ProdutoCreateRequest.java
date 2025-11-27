package com.movemais.estoque.dto.produto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record ProdutoCreateRequest(
        @NotBlank String sku,
        @NotBlank String nome,
        String descricao,
        @NotNull @Positive BigDecimal precoUnitario
) {}