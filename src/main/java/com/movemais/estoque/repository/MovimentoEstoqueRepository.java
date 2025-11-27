package com.movemais.estoque.repository;

import com.movemais.estoque.entity.MovimentoEstoque;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;

public interface MovimentoEstoqueRepository extends JpaRepository<MovimentoEstoque, Long> {

    @Query("""
           SELECT m
           FROM MovimentoEstoque m
           WHERE (:tipo IS NULL OR m.tipoMovimento = :tipo)
             AND (:produtoId IS NULL OR m.produto.id = :produtoId)
             AND (:depositoId IS NULL OR m.deposito.id = :depositoId)
             AND (:dataInicio IS NULL OR m.dataHoraMovimento >= :dataInicio)
             AND (:dataFim IS NULL OR m.dataHoraMovimento <= :dataFim)
           """)
    Page<MovimentoEstoque> buscarPorFiltros(@Param("tipo") MovimentoEstoque.TipoMovimento tipo,
                                            @Param("produtoId") Long produtoId,
                                            @Param("depositoId") Long depositoId,
                                            @Param("dataInicio") OffsetDateTime dataInicio,
                                            @Param("dataFim") OffsetDateTime dataFim,
                                            Pageable pageable);
}