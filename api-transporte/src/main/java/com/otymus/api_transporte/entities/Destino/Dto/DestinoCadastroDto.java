package com.otymus.api_transporte.entities.Destino.Dto;

import jakarta.validation.constraints.NotBlank;

public record DestinoCadastroDto(
        Long id,
        @NotBlank(message = "O nome é obrigatório.")
        String nome
) {
}
