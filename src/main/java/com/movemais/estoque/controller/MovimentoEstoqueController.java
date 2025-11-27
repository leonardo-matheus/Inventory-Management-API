package com.movemais.estoque.controller;

import com.movemais.estoque.dto.movimento.MovimentoCreateRequest;
import com.movemais.estoque.dto.movimento.MovimentoResponse;
import com.movemais.estoque.entity.MovimentoEstoque;
import com.movemais.estoque.service.MovimentoEstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;

@RestController
@RequestMapping("/api/movimentos")
@RequiredArgsConstructor
public class MovimentoEstoqueController {

    private final MovimentoEstoqueService service;

    @PostMapping("/entrada")
    public MovimentoResponse entrada(@Valid @RequestBody MovimentoCreateRequest request) {
        return service.registrarEntrada(request);
    }

    @PostMapping("/saida")
    public MovimentoResponse saida(@Valid @RequestBody MovimentoCreateRequest request) {
        return service.registrarSaida(request);
    }

    @GetMapping
    public Page<MovimentoResponse> listar(Pageable pageable) {
        return service.listar(pageable);
    }

    @GetMapping("/relatorio")
    public Page<MovimentoResponse> relatorio(
            @RequestParam(required = false) MovimentoEstoque.TipoMovimento tipo,
            @RequestParam(required = false) Long produtoId,
            @RequestParam(required = false) Long depositoId,
            @RequestParam(required = false) OffsetDateTime dataInicio,
            @RequestParam(required = false) OffsetDateTime dataFim,
            Pageable pageable) {

        return service.relatorio(tipo, produtoId, depositoId, dataInicio, dataFim, pageable);
    }
}