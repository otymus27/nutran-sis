package com.otymus.api_transporte.entities;

import java.time.LocalDate;

public record UltimaSolicitacaoDTO(
        Long id,
        String destino,
        LocalDate dataSolicitacao,
        String status,
        String nomeMotorista,
        String placaCarro
) {}
