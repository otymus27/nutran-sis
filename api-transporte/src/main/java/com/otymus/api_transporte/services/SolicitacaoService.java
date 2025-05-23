package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.Carro.Carro;
import com.otymus.api_transporte.entities.Motorista.Motorista;
import com.otymus.api_transporte.entities.Setor.Setor;
import com.otymus.api_transporte.entities.Solicitacao.Dto.SolicitacaoCadastroDto;
import com.otymus.api_transporte.entities.Solicitacao.Dto.SolicitacaoDto;
import com.otymus.api_transporte.entities.Solicitacao.Dto.SolicitacaoResponseDto;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import com.otymus.api_transporte.entities.Usuario.Usuario;
import com.otymus.api_transporte.repositories.*;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SolicitacaoService {

    @Autowired
    private final SolicitacaoRepository solicitacaoRepository;
    private final CarroRepository carroRepository;
    private final MotoristaRepository motoristaRepository;
    private final UsuarioRepository usuarioRepository;
    private final SetorRepository setorRepository;

    @Autowired
    public SolicitacaoService(
            SolicitacaoRepository solicitacaoRepository,
            CarroRepository carroRepository,
            MotoristaRepository motoristaRepository,
            UsuarioRepository usuarioRepository,
            SetorRepository setorRepository
    ) {
        this.solicitacaoRepository = solicitacaoRepository;
        this.carroRepository = carroRepository;
        this.motoristaRepository = motoristaRepository;
        this.usuarioRepository = usuarioRepository;
        this.setorRepository = setorRepository;
    }


    @Transactional
    public SolicitacaoDto cadastrar(SolicitacaoCadastroDto dto) {
        Solicitacao solicitacao = new Solicitacao();
        solicitacao.setDataSolicitacao(dto.dataSolicitacao());
        solicitacao.setDestino(dto.destino());
        solicitacao.setStatus(dto.status());

        // Buscar entidades relacionadas
        Carro carro = carroRepository.findById(dto.idCarro())
                .orElseThrow(() -> new EntityNotFoundException("Carro não encontrado com ID: " + dto.idCarro()));
        Motorista motorista = motoristaRepository.findById(dto.idMotorista())
                .orElseThrow(() -> new EntityNotFoundException("Motorista não encontrado com ID: " + dto.idMotorista()));
        Setor setor = setorRepository.findById(dto.idSetor())
                .orElseThrow(() -> new EntityNotFoundException("Setor não encontrado com ID: " + dto.idSetor()));

        // Buscar o usuário logado
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário logado não encontrado: " + username));

        // Setar relacionamentos
        solicitacao.setCarro(carro);
        solicitacao.setMotorista(motorista);
        solicitacao.setSetor(setor);
        solicitacao.setUsuario(usuario);

        // Setar demais campos que não tem relacionamentos
        solicitacao.setHoraSaida(dto.horaSaida());
        solicitacao.setKmInicial(dto.kmInicial());
        solicitacao.setHoraChegada(dto.horaChegada());
        solicitacao.setKmFinal(dto.kmFinal());

        solicitacaoRepository.save(solicitacao);

        return new SolicitacaoDto(
                solicitacao.getId(),
                solicitacao.getDataSolicitacao(),
                solicitacao.getDestino(),
                solicitacao.getStatus(),
                solicitacao.getCarro(),
                solicitacao.getMotorista(),
                solicitacao.getUsuario(),
                solicitacao.getSetor(),
                solicitacao.getKmInicial(),
                solicitacao.getKmFinal(),
                solicitacao.getHoraSaida(),
                solicitacao.getHoraChegada()
        );
    }


    public List<SolicitacaoDto> listar() {
        return solicitacaoRepository.findAll().stream()
                .map(this::convertToSolicitacaoDto) // Using a method reference for cleaner code
                .collect(Collectors.toList());
    }

    public SolicitacaoDto buscarPorId(Long id) {
        Optional<Solicitacao> optionalSolicitacao = solicitacaoRepository.findById(id);
        if (optionalSolicitacao.isPresent()) {
            Solicitacao solicitacao = optionalSolicitacao.get();
            return new SolicitacaoDto(
                    solicitacao.getId(),
                    solicitacao.getDataSolicitacao(),
                    solicitacao.getDestino(),
                    solicitacao.getStatus(),
                    solicitacao.getCarro(),
                    solicitacao.getMotorista(),
                    solicitacao.getUsuario(),
                    solicitacao.getSetor(),
                    solicitacao.getKmInicial(),
                    solicitacao.getKmFinal(),
                    solicitacao.getHoraSaida(),
                    solicitacao.getHoraChegada()
            );
        }
        return null;
    }

    @Transactional
    public SolicitacaoDto atualizar(Long id, SolicitacaoCadastroDto dto) {
        Solicitacao solicitacao = solicitacaoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Solicitação não encontrada com ID: " + id));

        // Atualiza os dados da solicitação
        solicitacao.setDataSolicitacao(dto.dataSolicitacao());
        solicitacao.setDestino(dto.destino());
        solicitacao.setStatus(dto.status());

        // Carrega entidades associadas
        Carro carro = carroRepository.findById(dto.idCarro())
                .orElseThrow(() -> new EntityNotFoundException("Carro não encontrado com ID: " + dto.idCarro()));
        Motorista motorista = motoristaRepository.findById(dto.idMotorista())
                .orElseThrow(() -> new EntityNotFoundException("Motorista não encontrado com ID: " + dto.idMotorista()));
        Setor setor = setorRepository.findById(dto.idSetor())
                .orElseThrow(() -> new EntityNotFoundException("Setor não encontrado com ID: " + dto.idSetor()));

        // Captura o usuário logado
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Usuario usuario = usuarioRepository.findByLogin(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário logado não encontrado: " + username));

        // Define os relacionamentos
        solicitacao.setCarro(carro);
        solicitacao.setMotorista(motorista);
        solicitacao.setSetor(setor);
        solicitacao.setUsuario(usuario); // Atualiza o usuário responsável pela alteração

        // Setar demais campos que não tem relacionamentos
        solicitacao.setHoraSaida(dto.horaSaida());
        solicitacao.setKmInicial(dto.kmInicial());
        solicitacao.setHoraChegada(dto.horaChegada());
        solicitacao.setKmFinal(dto.kmFinal());

        solicitacaoRepository.save(solicitacao);

        return new SolicitacaoDto(
                solicitacao.getId(),
                solicitacao.getDataSolicitacao(),
                solicitacao.getDestino(),
                solicitacao.getStatus(),
                solicitacao.getCarro(),
                solicitacao.getMotorista(),
                solicitacao.getUsuario(),
                solicitacao.getSetor(),
                solicitacao.getKmInicial(),
                solicitacao.getKmFinal(),
                solicitacao.getHoraSaida(),
                solicitacao.getHoraChegada()
        );
    }


    public boolean excluir(Long id) {
        if (solicitacaoRepository.existsById(id)) {
            solicitacaoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<SolicitacaoDto> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return solicitacaoRepository.findAll(pageable)
                .stream()
                .map(s -> new SolicitacaoDto(
                        s.getId(),
                        s.getDataSolicitacao(),
                        s.getDestino(),
                        s.getStatus(),
                        s.getCarro(),
                        s.getMotorista(),
                        s.getUsuario(),
                        s.getSetor(),
                        s.getKmInicial(),
                        s.getKmFinal(),
                        s.getHoraSaida(),
                        s.getHoraChegada()
                ))
                .collect(Collectors.toList());
    }

    private SolicitacaoDto convertToSolicitacaoDto(Solicitacao solicitacao) {
        return new SolicitacaoDto(
                solicitacao.getId(),
                solicitacao.getDataSolicitacao(),
                solicitacao.getDestino(),
                solicitacao.getStatus(),
                solicitacao.getCarro(),
                solicitacao.getMotorista(),
                solicitacao.getUsuario(),
                solicitacao.getSetor(),
                solicitacao.getKmInicial(),
                solicitacao.getKmFinal(),
                solicitacao.getHoraSaida(),
                solicitacao.getHoraChegada()
        );
    }




    //----------------------
    public List<SolicitacaoResponseDto> listarTodos() {
        return solicitacaoRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    private SolicitacaoResponseDto toResponseDto(Solicitacao s) {
        return new SolicitacaoResponseDto(
                s.getId(),
                s.getDataSolicitacao(),
                s.getDestino(),
                s.getStatus(),
                s.getCarro().getId(),
                s.getCarro().getPlaca(),
                s.getMotorista().getId(),
                s.getMotorista().getNome(),
                s.getSetor().getId(),
                s.getSetor().getNome(),
                s.getUsuario().getId(),
                s.getUsuario().getLogin(),
                s.getKmInicial(),
                s.getKmFinal(),
                s.getHoraSaida(),
                s.getHoraChegada()
        );
    }



}
