package com.movemais.estoque.controller;

import com.movemais.estoque.dto.produto.ProdutoCreateRequest;
import com.movemais.estoque.dto.produto.ProdutoResponse;
import com.movemais.estoque.dto.produto.ProdutoUpdateRequest;
import com.movemais.estoque.service.ProdutoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    public ProdutoResponse atualizar(@PathVariable("id") Long id,
                                     @Valid @RequestBody ProdutoUpdateRequest request) {
        return produtoService.atualizar(id, request);
    }

    @PatchMapping("/{id}/inativar")
    public void inativar(@PathVariable("id") Long id) {
        produtoService.inativar(id);
    }

    @GetMapping
    public Page<ProdutoResponse> listar(
            @RequestParam(name = "nome", required = false) String nome,
            @RequestParam(name = "sku", required = false) String sku,
            @RequestParam(name = "ativo", defaultValue = "true") boolean ativo,
            Pageable pageable) {

        return produtoService.listar(nome, sku, ativo, pageable);
    }
}