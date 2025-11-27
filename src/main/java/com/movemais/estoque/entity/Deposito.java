package com.movemais.estoque.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "deposito",
        uniqueConstraints = @UniqueConstraint(name = "uk_deposito_codigo", columnNames = "codigo"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Deposito {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String nome;

    @Column(nullable = false, length = 30)
    private String codigo;

    @Column(length = 255)
    private String endereco;
}