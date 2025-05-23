package com.otymus.api_transporte.entities.Setor.Dto;

import jakarta.validation.constraints.NotBlank;

public record SetorCadastroDto(
        Long id,
        @NotBlank(message = "O nome do setor é obrigatório.")
        String nome) {
}
