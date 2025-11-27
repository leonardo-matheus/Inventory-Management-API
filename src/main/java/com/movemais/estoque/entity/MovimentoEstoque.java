package com.movemais.estoque.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "movimento_estoque")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MovimentoEstoque {

    public enum TipoMovimento {
        ENTRADA, SAIDA
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_movimento", nullable = false, length = 10)
    private TipoMovimento tipoMovimento;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "produto_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_movimento_produto"))
    private Produto produto;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "deposito_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_movimento_deposito"))
    private Deposito deposito;

    @Column(nullable = false)
    private Long quantidade;

    @Column(name = "data_hora_movimento", nullable = false)
    private OffsetDateTime dataHoraMovimento;

    @Column(length = 255)
    private String observacao;

    @Column(name = "usuario_responsavel", length = 80)
    private String usuarioResponsavel;
}