package com.movemais.estoque.dto.deposito;

import jakarta.validation.constraints.NotBlank;

public record DepositoUpdateRequest(
        @NotBlank String nome,
        @NotBlank String codigo,
        String endereco
) {}