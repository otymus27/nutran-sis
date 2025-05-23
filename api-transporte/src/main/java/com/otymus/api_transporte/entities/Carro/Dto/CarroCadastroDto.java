package com.otymus.api_transporte.entities.Carro.Dto;

import jakarta.validation.constraints.NotBlank;

public record CarroCadastroDto(
        Long id,

        @NotBlank(message = "A marca do carro é obrigatória.")
        String marca,

        @NotBlank(message = "O modelo do carro é obrigatório.")
        String modelo,

        @NotBlank(message = "A placa do carro é obrigatória.")
        String placa
) {
}

