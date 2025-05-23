package com.otymus.api_transporte.repositories;

import com.otymus.api_transporte.entities.Carro.Carro;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarroRepository extends JpaRepository<Carro, Long> {
    Optional<Carro> findByPlaca(String placa);
    List<Carro> findByPlacaContaining(String placa);

    @Override
    Page<Carro> findAll(Pageable pageable);
}