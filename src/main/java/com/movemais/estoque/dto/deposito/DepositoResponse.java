package com.movemais.estoque.dto.deposito;

public record DepositoResponse(
        Long id,
        String nome,
        String codigo,
        String endereco
) {}