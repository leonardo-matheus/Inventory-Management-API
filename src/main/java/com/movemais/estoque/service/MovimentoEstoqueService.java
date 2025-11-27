package com.movemais.estoque.service;

import com.movemais.estoque.dto.movimento.MovimentoCreateRequest;
import com.movemais.estoque.dto.movimento.MovimentoResponse;
import com.movemais.estoque.entity.*;
import com.movemais.estoque.entity.MovimentoEstoque.TipoMovimento;
import com.movemais.estoque.exception.BusinessException;
import com.movemais.estoque.exception.NotFoundException;
import com.movemais.estoque.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class MovimentoEstoqueService {

    private final ProdutoRepository produtoRepository;
    private final DepositoRepository depositoRepository;
    private final EstoqueRepository estoqueRepository;
    private final MovimentoEstoqueRepository movimentoRepository;

    @Transactional
    public MovimentoResponse registrarEntrada(MovimentoCreateRequest request) {
        MovimentoEstoque mov = registrarMovimento(TipoMovimento.ENTRADA, request);
        return toResponse(mov);
    }

    @Transactional
    public MovimentoResponse registrarSaida(MovimentoCreateRequest request) {
        MovimentoEstoque mov = registrarMovimento(TipoMovimento.SAIDA, request);
        return toResponse(mov);
    }

    private MovimentoEstoque registrarMovimento(TipoMovimento tipo, MovimentoCreateRequest req) {
        if (req.quantidade() <= 0) {
            throw new BusinessException("Quantidade deve ser maior que zero.");
        }

        Produto produto = produtoRepository.findById(req.produtoId())
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        Deposito deposito = depositoRepository.findById(req.depositoId())
                .orElseThrow(() -> new NotFoundException("Depósito não encontrado"));

        Estoque estoque = estoqueRepository.findByProdutoAndDeposito(produto, deposito)
                .orElseGet(() -> Estoque.builder()
                        .produto(produto)
                        .deposito(deposito)
                        .quantidadeAtual(0L)
                        .build());

        long saldoAtual = estoque.getQuantidadeAtual();

        if (tipo == TipoMovimento.SAIDA && req.quantidade() > saldoAtual) {
            throw new BusinessException("Saldo insuficiente para saída. Saldo atual: " + saldoAtual);
        }

        long novoSaldo = (tipo == TipoMovimento.ENTRADA)
                ? saldoAtual + req.quantidade()
                : saldoAtual - req.quantidade();

        estoque.setQuantidadeAtual(novoSaldo);
        estoqueRepository.save(estoque);

        String usuario = SecurityContextHolder.getContext().getAuthentication() != null
                ? SecurityContextHolder.getContext().getAuthentication().getName()
                : "sistema";

        MovimentoEstoque movimento = MovimentoEstoque.builder()
                .tipoMovimento(tipo)
                .produto(produto)
                .deposito(deposito)
                .quantidade(req.quantidade())
                .observacao(req.observacao())
                .dataHoraMovimento(OffsetDateTime.now())
                .usuarioResponsavel(usuario)
                .build();

        return movimentoRepository.save(movimento);
    }

    public Page<MovimentoResponse> listar(Pageable pageable) {
        return movimentoRepository.findAll(pageable).map(this::toResponse);
    }

    private MovimentoResponse toResponse(MovimentoEstoque m) {
        return new MovimentoResponse(
                m.getId(),
                m.getTipoMovimento().name(),
                m.getProduto().getId(),
                m.getDeposito().getId(),
                m.getQuantidade(),
                m.getDataHoraMovimento(),
                m.getObservacao(),
                m.getUsuarioResponsavel()
        );
    }
}