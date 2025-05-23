package com.otymus.api_transporte.entities.Motorista.Dto;

import jakarta.validation.constraints.NotBlank;

public record MotoristaCadastroDto(
        Long id,

        @NotBlank(message = "A matrícula é obrigatória.")
        String matricula,

        @NotBlank(message = "O nome do motorista é obrigatório.")
        String nome,

        @NotBlank(message = "O telefone do motorista é obrigatório.")
        String telefone
) {
}
