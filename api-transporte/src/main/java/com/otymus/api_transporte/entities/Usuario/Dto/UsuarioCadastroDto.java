package com.otymus.api_transporte.entities.Usuario.Dto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.validation.annotation.Validated;

import java.util.Set;

@Validated
public record UsuarioCadastroDto(
        @NotBlank
        String login,
        @NotBlank
        String senha,
        Boolean senhaProvisoria,
        Set<Long> roleIds
) {
}
