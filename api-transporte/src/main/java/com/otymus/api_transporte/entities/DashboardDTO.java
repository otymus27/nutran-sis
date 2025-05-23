package com.otymus.api_transporte.entities;

import java.util.List;

public record DashboardDTO(
        long totalCarros,
        long totalMotoristas,
        long totalSetores,
        long totalSolicitacoes,
        List<UltimaSolicitacaoDTO> ultimasSolicitacoes
) {}