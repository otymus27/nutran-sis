package com.otymus.api_transporte.repositories;

import com.otymus.api_transporte.entities.Motorista.Motorista;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import com.otymus.api_transporte.entities.Usuario.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLogin(String login);

    List<Usuario> findByLoginContaining(String nome);

    @Override
    Page<Usuario> findAll(Pageable pageable);
}
