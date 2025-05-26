package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.DashboardDTO;
import com.otymus.api_transporte.entities.UltimaSolicitacaoDTO;
import com.otymus.api_transporte.repositories.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final CarroRepository carroRepository;
    private final MotoristaRepository motoristaRepository;
    private final SetorRepository setorRepository;
    private final SolicitacaoRepository solicitacaoRepository;
    private final DestinoRepository destinoRepository;

    public DashboardService(CarroRepository carroRepository,
                            MotoristaRepository motoristaRepository,
                            SetorRepository setorRepository,
                            SolicitacaoRepository solicitacaoRepository, DestinoRepository destinoRepository) {
        this.carroRepository = carroRepository;
        this.motoristaRepository = motoristaRepository;
        this.setorRepository = setorRepository;
        this.solicitacaoRepository = solicitacaoRepository;
        this.destinoRepository = destinoRepository;
    }

    public DashboardDTO getDashboardData() {
        long totalCarros = carroRepository.count();
        long totalMotoristas = motoristaRepository.count();
        long totalSetores = setorRepository.count();
        long totalSolicitacoes = solicitacaoRepository.count();

        List<UltimaSolicitacaoDTO> ultimas = solicitacaoRepository
                .findTop5ByOrderByDataSolicitacaoDesc()
                .stream()
                .map(s -> new UltimaSolicitacaoDTO(
                        s.getId(),
                        s.getDestino().getNome(),
                        s.getDataSolicitacao(),
                        s.getStatus(),
                        s.getMotorista().getNome(),
                        s.getCarro().getPlaca()
                ))
                .collect(Collectors.toList());

        return new DashboardDTO(totalCarros, totalMotoristas, totalSetores, totalSolicitacoes, ultimas);
    }
}
