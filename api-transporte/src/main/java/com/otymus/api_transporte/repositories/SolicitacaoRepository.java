package com.otymus.api_transporte.repositories;

import com.otymus.api_transporte.entities.Motorista.Motorista;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    List<Solicitacao> findByStatus(String status);

    List<Solicitacao> findByDestinoContaining(String destino);

    @Override
    Page<Solicitacao> findAll(Pageable pageable);

    // Faz busca das 5 ultimas solicitacoes
    List<Solicitacao> findTop5ByOrderByDataSolicitacaoDesc();
}
