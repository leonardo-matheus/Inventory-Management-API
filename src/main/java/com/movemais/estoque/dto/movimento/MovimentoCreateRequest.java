package com.movemais.estoque.dto.movimento;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MovimentoCreateRequest(
        @NotNull Long produtoId,
        @NotNull Long depositoId,
        @NotNull @Positive Long quantidade,
        String observacao
) {}