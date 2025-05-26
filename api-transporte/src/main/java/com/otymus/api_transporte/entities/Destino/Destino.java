package com.otymus.api_transporte.entities.Destino;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "tb_destino")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Destino {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;


    //Relacionamento com Solicitação - um destino pode ter várias solicitações
    @OneToMany(mappedBy = "destino")
    @JsonIgnore
    private List<Solicitacao> solicitacoes;
}
