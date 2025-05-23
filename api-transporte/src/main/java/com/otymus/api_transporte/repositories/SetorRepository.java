package com.otymus.api_transporte.repositories;

import com.otymus.api_transporte.entities.Setor.Setor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetorRepository extends JpaRepository<Setor, Long> {
    List<Setor> findByNome(String nome);

    List<Setor> findByNomeContaining(String nome);

    @Override
    Page<Setor> findAll(Pageable pageable);
}