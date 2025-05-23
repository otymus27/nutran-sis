package com.otymus.api_transporte.entities.Solicitacao;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.otymus.api_transporte.entities.Carro.Carro;
import com.otymus.api_transporte.entities.Motorista.Motorista;
import com.otymus.api_transporte.entities.Setor.Setor;
import com.otymus.api_transporte.entities.Usuario.Usuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "tb_solicitacao")
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Solicitacao {

    @EqualsAndHashCode.Include
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "data_solicitacao", nullable = false)
    private LocalDate dataSolicitacao;

    @Column(nullable = false)
    private String destino;

    @Column(nullable = false)
    private String status; // PENDENTE, APROVADA, RECUSADA

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_carro", nullable = false)
    private Carro carro;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_motorista", nullable = false)
    private Motorista motorista;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_setor", nullable = false)
    private Setor setor;

    @Column(name = "km_inicial")
    private Integer kmInicial;

    @Column(name = "km_final")
    private Integer kmFinal;

    @Column(name = "hora_saida")
    private LocalTime horaSaida;

    @Column(name = "hora_chegada")
    private LocalTime horaChegada;

}
