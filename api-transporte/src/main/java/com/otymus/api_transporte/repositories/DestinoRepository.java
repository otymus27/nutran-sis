package com.otymus.api_transporte.repositories;

import com.otymus.api_transporte.entities.Destino.Destino;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinoRepository extends JpaRepository<Destino, Long> {

    List<Destino> findByNome(String nome);

    List<Destino> findByNomeContaining(String nome);

    @Override
    Page<Destino> findAll(Pageable pageable);
}
