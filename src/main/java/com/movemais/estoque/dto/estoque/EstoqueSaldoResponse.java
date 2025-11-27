package com.movemais.estoque.dto.estoque;

public record EstoqueSaldoResponse(
        Long produtoId,
        String produtoSku,
        String produtoNome,
        Long depositoId,
        String depositoCodigo,
        String depositoNome,
        Long quantidadeAtual
) {}