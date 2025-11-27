package com.movemais.estoque.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "estoque",
       uniqueConstraints = @UniqueConstraint(name = "uk_estoque_produto_deposito",
                                             columnNames = {"produto_id", "deposito_id"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_estoque_produto"))
    private Produto produto;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "deposito_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_estoque_deposito"))
    private Deposito deposito;

    @Column(name = "quantidade_atual", nullable = false)
    private Long quantidadeAtual;
}