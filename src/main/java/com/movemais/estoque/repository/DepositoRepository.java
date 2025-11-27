package com.movemais.estoque.repository;

import com.movemais.estoque.entity.Deposito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepositoRepository extends JpaRepository<Deposito, Long> {
    boolean existsByCodigo(String codigo);
}