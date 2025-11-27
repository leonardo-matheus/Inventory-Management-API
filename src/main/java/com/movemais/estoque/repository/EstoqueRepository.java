package com.movemais.estoque.repository;

import com.movemais.estoque.entity.Deposito;
import com.movemais.estoque.entity.Estoque;
import com.movemais.estoque.entity.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    Optional<Estoque> findByProdutoAndDeposito(Produto produto, Deposito deposito);

    Page<Estoque> findByDeposito(Deposito deposito, Pageable pageable);
}