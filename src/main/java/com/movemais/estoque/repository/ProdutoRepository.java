package com.movemais.estoque.repository;

import com.movemais.estoque.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    boolean existsBySku(String sku);

    Page<Produto> findByNomeContainingIgnoreCaseAndAtivo(String nome, boolean ativo, Pageable pageable);

    Page<Produto> findBySkuContainingIgnoreCaseAndAtivo(String sku, boolean ativo, Pageable pageable);
}