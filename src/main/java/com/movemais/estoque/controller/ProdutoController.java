package com.movemais.estoque.controller;

import com.movemais.estoque.dto.produto.*;
import com.movemais.estoque.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    @PostMapping
    public ProdutoResponse criar(@Valid @RequestBody ProdutoCreateRequest request) {
        return produtoService.criar(request);
    }

    @PutMapping("/{id}")
    public ProdutoResponse atualizar(@PathVariable Long id,
                                     @Valid @RequestBody ProdutoUpdateRequest request) {
        return produtoService.atualizar(id, request);
    }

    @PatchMapping("/{id}/inativar")
    public void inativar(@PathVariable Long id) {
        produtoService.inativar(id);
    }

    @GetMapping
    public Page<ProdutoResponse> listar(@RequestParam(required = false) String nome,
                                        @RequestParam(required = false) String sku,
                                        @RequestParam(defaultValue = "true") boolean ativo,
                                        Pageable pageable) {
        return produtoService.listar(nome, sku, ativo, pageable);
    }
}