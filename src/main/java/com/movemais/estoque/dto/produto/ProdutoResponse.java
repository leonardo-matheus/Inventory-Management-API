package com.movemais.estoque.dto.produto;

import java.math.BigDecimal;

public record ProdutoResponse(
        Long id,
        String sku,
        String nome,
        String descricao,
        BigDecimal precoUnitario,
        boolean ativo
) {}