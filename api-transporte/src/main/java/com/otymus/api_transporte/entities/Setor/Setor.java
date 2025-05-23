package com.otymus.api_transporte.entities.Setor;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Entity
@Table(name = "tb_setor")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Setor {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    //Relacionamento com Solicitação - um setor pode ter várias solicitações
    @OneToMany(mappedBy = "setor")
    @JsonIgnore
    private List<Solicitacao> solicitacoes;

}
