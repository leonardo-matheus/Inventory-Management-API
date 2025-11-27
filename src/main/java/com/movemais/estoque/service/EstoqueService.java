package com.movemais.estoque.service;

import com.movemais.estoque.dto.estoque.EstoqueSaldoResponse;
import com.movemais.estoque.entity.*;
import com.movemais.estoque.exception.NotFoundException;
import com.movemais.estoque.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final ProdutoRepository produtoRepository;
    private final DepositoRepository depositoRepository;
    private final EstoqueRepository estoqueRepository;

    @Transactional(readOnly = true)
    public EstoqueSaldoResponse consultarSaldo(Long produtoId, Long depositoId) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        Deposito deposito = depositoRepository.findById(depositoId)
                .orElseThrow(() -> new NotFoundException("Depósito não encontrado"));

        Estoque estoque = estoqueRepository.findByProdutoAndDeposito(produto, deposito)
                .orElseThrow(() -> new NotFoundException("Não há estoque para este produto neste depósito"));

        return toResponse(estoque);
    }

    @Transactional(readOnly = true)
    public Page<EstoqueSaldoResponse> listarPorDeposito(Long depositoId, Long produtoId, Pageable pageable) {
        Deposito deposito = depositoRepository.findById(depositoId)
                .orElseThrow(() -> new NotFoundException("Depósito não encontrado"));

        if (produtoId != null) {
            Produto produto = produtoRepository.findById(produtoId)
                    .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

            var opt = estoqueRepository.findByProdutoAndDeposito(produto, deposito);
            if (opt.isEmpty()) {
                return Page.empty(pageable);
            }

            List<EstoqueSaldoResponse> content = List.of(toResponse(opt.get()));
            return new PageImpl<>(content, pageable, 1);
        }

        Page<Estoque> page = estoqueRepository.findByDeposito(deposito, pageable);
        return page.map(this::toResponse);
    }

    private EstoqueSaldoResponse toResponse(Estoque e) {
        return new EstoqueSaldoResponse(
                e.getProduto().getId(),
                e.getProduto().getSku(),
                e.getProduto().getNome(),
                e.getDeposito().getId(),
                e.getDeposito().getCodigo(),
                e.getDeposito().getNome(),
                e.getQuantidadeAtual()
        );
    }
}