package com.movemais.estoque.controller;

import com.movemais.estoque.dto.deposito.*;
import com.movemais.estoque.service.DepositoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/depositos")
@RequiredArgsConstructor
public class DepositoController {

    private final DepositoService depositoService;

    @PostMapping
    public DepositoResponse criar(@Valid @RequestBody DepositoCreateRequest request) {
        return depositoService.criar(request);
    }

    @PutMapping("/{id}")
    public DepositoResponse atualizar(@PathVariable("id") Long id,
                                      @Valid @RequestBody DepositoUpdateRequest request) {
        return depositoService.atualizar(id, request);
    }

    @GetMapping
    public Page<DepositoResponse> listar(Pageable pageable) {
        return depositoService.listar(pageable);
    }

    @GetMapping("/{id}")
    public DepositoResponse buscarPorId(@PathVariable("id") Long id) {
        return depositoService.buscarPorId(id);
    }
}