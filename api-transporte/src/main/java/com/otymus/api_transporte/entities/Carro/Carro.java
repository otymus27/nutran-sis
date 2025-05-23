package com.otymus.api_transporte.entities.Carro;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "tb_carro")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Carro {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String marca;

    @Column(nullable = false)
    private String modelo;

    @Column(nullable = false, unique = true)
    private String placa;

    //Relacionamento com Solicitacao - um carro pode estar vinculado a várias solicitações
    @OneToMany(mappedBy = "carro")
    @JsonBackReference("carro-solicitacoes")
    private List<Solicitacao> solicitacoes;
}
