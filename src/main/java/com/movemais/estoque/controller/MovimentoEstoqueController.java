package com.movemais.estoque.controller;

import com.movemais.estoque.dto.movimento.MovimentoCreateRequest;
import com.movemais.estoque.dto.movimento.MovimentoResponse;
import com.movemais.estoque.service.MovimentoEstoqueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

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
}