package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.Motorista.Motorista;
import com.otymus.api_transporte.entities.Motorista.Dto.MotoristaCadastroDto;
import com.otymus.api_transporte.entities.Motorista.Dto.MotoristaDto;
import com.otymus.api_transporte.repositories.MotoristaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MotoristaService {

    @Autowired
    private final MotoristaRepository motoristaRepository;

    public MotoristaService(MotoristaRepository motoristaRepository) {
        this.motoristaRepository = motoristaRepository;
    }

    public MotoristaDto cadastrar(MotoristaCadastroDto dto) {
        Motorista motorista = new Motorista();
        motorista.setNome(dto.nome());
        motorista.setMatricula(dto.matricula());
        motorista.setTelefone(dto.telefone());

        motoristaRepository.save(motorista);

        return new MotoristaDto(motorista.getId(), motorista.getNome(), motorista.getMatricula(), motorista.getTelefone());
    }

    public List<MotoristaDto> listar() {
        return motoristaRepository.findAll().stream()
                .map(m -> new MotoristaDto(m.getId(), m.getMatricula(), m.getNome(), m.getTelefone()))
                .collect(Collectors.toList());
    }

    public MotoristaDto buscarPorId(Long id) {
        Optional<Motorista> opt = motoristaRepository.findById(id);
        return opt.map(m -> new MotoristaDto(m.getId(), m.getNome(), m.getMatricula(), m.getTelefone())).orElse(null);
    }

    public MotoristaDto atualizar(Long id, MotoristaCadastroDto dto) {
        Optional<Motorista> opt = motoristaRepository.findById(id);
        if (opt.isPresent()) {
            Motorista motorista = opt.get();
            motorista.setNome(dto.nome());
            motorista.setMatricula(dto.matricula());
            motorista.setTelefone(dto.telefone());

            motoristaRepository.save(motorista);
            return new MotoristaDto(motorista.getId(), motorista.getNome(), motorista.getMatricula(), motorista.getTelefone());
        }
        return null;
    }

    public boolean excluir(Long id) {
        if (motoristaRepository.existsById(id)) {
            motoristaRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<MotoristaDto> buscarPorNome(String nome) {
        List<Motorista> motoristas = motoristaRepository.findByNomeContaining(nome);
        if (!motoristas.isEmpty()) {
            return motoristas.stream()
                    .map(item -> new MotoristaDto(
                            item.getId(),
                            item.getNome(),
                            item.getMatricula(),
                            item.getTelefone()
                    ))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public List<MotoristaDto> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return motoristaRepository.findAll(pageable)
                .stream()
                .map(m -> new MotoristaDto(m.getId(), m.getNome(),m.getMatricula(),m.getTelefone()))
                .collect(Collectors.toList());
    }



}
