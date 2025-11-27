package com.movemais.estoque.repository;

import com.movemais.estoque.entity.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EstoqueRepository extends JpaRepository<Estoque, Long> {

    Optional<Estoque> findByProdutoAndDeposito(Produto produto, Deposito deposito);

    Page<Estoque> findByDeposito(Deposito deposito, Pageable pageable);
}