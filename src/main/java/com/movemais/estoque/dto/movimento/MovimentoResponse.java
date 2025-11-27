package com.movemais.estoque.dto.movimento;

import java.time.OffsetDateTime;

public record MovimentoResponse(
        Long id,
        String tipoMovimento,
        Long produtoId,
        Long depositoId,
        Long quantidade,
        OffsetDateTime dataHoraMovimento,
        String observacao,
        String usuarioResponsavel
) {}