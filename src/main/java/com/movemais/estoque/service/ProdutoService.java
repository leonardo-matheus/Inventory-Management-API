package com.movemais.estoque.service;

import com.movemais.estoque.dto.produto.*;
import com.movemais.estoque.entity.Produto;
import com.movemais.estoque.exception.BusinessException;
import com.movemais.estoque.exception.NotFoundException;
import com.movemais.estoque.repository.ProdutoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoResponse criar(ProdutoCreateRequest request) {
        if (produtoRepository.existsBySku(request.sku())) {
            throw new BusinessException("Já existe produto com esse SKU.");
        }
        Produto p = Produto.builder()
                .sku(request.sku())
                .nome(request.nome())
                .descricao(request.descricao())
                .precoUnitario(request.precoUnitario())
                .ativo(true)
                .build();
        p = produtoRepository.save(p);
        return toResponse(p);
    }

    public ProdutoResponse atualizar(Long id, ProdutoUpdateRequest request) {
        Produto p = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));

        p.setNome(request.nome());
        p.setDescricao(request.descricao());
        p.setPrecoUnitario(request.precoUnitario());
        p.setAtivo(request.ativo());

        p = produtoRepository.save(p);
        return toResponse(p);
    }

    public void inativar(Long id) {
        Produto p = produtoRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Produto não encontrado"));
        p.setAtivo(false);
        produtoRepository.save(p);
    }

    public Page<ProdutoResponse> listar(String nome, String sku, boolean ativo, Pageable pageable) {
        Page<Produto> page;
        if (nome != null && !nome.isBlank()) {
            page = produtoRepository.findByNomeContainingIgnoreCaseAndAtivo(nome, ativo, pageable);
        } else if (sku != null && !sku.isBlank()) {
            page = produtoRepository.findBySkuContainingIgnoreCaseAndAtivo(sku, ativo, pageable);
        } else {
            page = produtoRepository.findAll(pageable);
        }
        return page.map(this::toResponse);
    }

    private ProdutoResponse toResponse(Produto p) {
        return new ProdutoResponse(
                p.getId(),
                p.getSku(),
                p.getNome(),
                p.getDescricao(),
                p.getPrecoUnitario(),
                p.isAtivo()
        );
    }
}