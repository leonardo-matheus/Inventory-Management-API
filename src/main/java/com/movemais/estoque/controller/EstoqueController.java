package com.movemais.estoque.controller;

import com.movemais.estoque.dto.estoque.EstoqueSaldoResponse;
import com.movemais.estoque.service.EstoqueService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estoques")
@RequiredArgsConstructor
public class EstoqueController {

    private final EstoqueService estoqueService;

    @GetMapping("/saldo")
    public EstoqueSaldoResponse consultarSaldo(@RequestParam Long produtoId,
                                               @RequestParam Long depositoId) {
        return estoqueService.consultarSaldo(produtoId, depositoId);
    }

    @GetMapping("/deposito/{depositoId}")
    public Page<EstoqueSaldoResponse> listarPorDeposito(
            @PathVariable Long depositoId,
            @RequestParam(required = false) Long produtoId,
            Pageable pageable) {
        return estoqueService.listarPorDeposito(depositoId, produtoId, pageable);
    }
}