package com.otymus.api_transporte.entities.Solicitacao.Dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record SolicitacaoCadastroDto(
        @NotNull(message = "A data da solicitação é obrigatória")
        LocalDate dataSolicitacao,

        @NotBlank(message = "O destino é obrigatório")
        String destino,

        @NotBlank(message = "O status é obrigatório")
        String status,

        @NotNull(message = "O carro é obrigatório")
        Long idCarro,

        @NotNull(message = "O motorista é obrigatório")
        Long idMotorista,

        @NotNull(message = "O setor é obrigatório")
        Long idSetor,

        @NotNull(message = "O setor é obrigatório")
        Integer kmInicial,
        @NotNull(message = "O setor é obrigatório")
        Integer kmFinal,
        @NotNull(message = "O setor é obrigatório")
        LocalTime horaSaida,
        @NotNull(message = "O setor é obrigatório")
        LocalTime horaChegada


) {}

