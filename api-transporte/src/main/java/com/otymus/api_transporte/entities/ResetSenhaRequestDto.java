package com.otymus.api_transporte.entities;

public record ResetSenhaRequestDto(
        Long id,
        String senhaProvisoria,
        String novaSenha
) {
}
