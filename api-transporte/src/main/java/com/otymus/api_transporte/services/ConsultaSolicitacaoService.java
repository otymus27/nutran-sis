package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import com.otymus.api_transporte.repositories.SolicitacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ConsultaSolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;

    public ConsultaSolicitacaoService(SolicitacaoRepository solicitacaoRepository) {
        this.solicitacaoRepository = solicitacaoRepository;
    }

    public Page<Solicitacao> consultar(
            Long motoristaId,
            Long carroId,
            Long destinoId,
            Long setorId,
            LocalDate dataInicio,
            LocalDate dataFim,
            Pageable pageable
    ) {
        Specification<Solicitacao> spec = Specification.where(null);

        if (motoristaId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("motorista").get("id"), motoristaId));
        }

        if (carroId != null ) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("carro").get("id"), carroId));
        }

        if (destinoId != null ) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("destino").get("id"), destinoId));
        }

        if (setorId != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("setor").get("id"), setorId));
        }

        if (dataInicio != null) {
            spec = spec.and((root, query, cb) ->
                    cb.greaterThanOrEqualTo(root.get("dataSolicitacao"), dataInicio));
        }

        if (dataFim != null) {
            spec = spec.and((root, query, cb) ->
                    cb.lessThanOrEqualTo(root.get("dataSolicitacao"), dataFim));
        }

        return solicitacaoRepository.findAll(spec, pageable);
    }


}

