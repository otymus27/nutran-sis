package com.otymus.api_transporte.repositories;

import com.otymus.api_transporte.entities.Motorista.Motorista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MotoristaRepository extends JpaRepository<Motorista, Long> {
    List<Motorista> findByNome(String nome);

    List<Motorista> findByNomeContaining(String nome);

    @Override
    Page<Motorista> findAll(Pageable pageable);
}
