package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.Destino.Destino;
import com.otymus.api_transporte.entities.Destino.Dto.DestinoCadastroDto;
import com.otymus.api_transporte.entities.Destino.Dto.DestinoDto;
import com.otymus.api_transporte.repositories.DestinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DestinoService {

    @Autowired
    private final DestinoRepository destinoRepository;

    public DestinoService(DestinoRepository destinoRepository) {
        this.destinoRepository = destinoRepository;
    }

    // Cadastrar um novo destino
    public DestinoDto cadastrar(DestinoCadastroDto dto) {
        Destino destino = new Destino();
        destino.setNome(dto.nome());

        destinoRepository.save(destino);

        return new DestinoDto(destino.getId(), destino.getNome());
    }

    // Listar todos os destinos
    public List<DestinoDto> listar() {
        List<Destino> destinos = destinoRepository.findAll();
        return destinos.stream()
                .map(item -> new DestinoDto(
                        item.getId(),
                        item.getNome()
                ))
                .collect(Collectors.toList());
    }

    // Buscar destino por ID
    public DestinoDto buscarPorId(Long id) {
        Optional<Destino> optionalDestino = destinoRepository.findById(id);
        if (optionalDestino.isPresent()) {
            Destino destino = optionalDestino.get();
            return new DestinoDto(
                    destino.getId(),
                    destino.getNome()
            );
        }
        return null;
    }

    // Atualizar destino existente
    public DestinoDto atualizar(Long id, DestinoCadastroDto dto) {
        Optional<Destino> optionalDestino = destinoRepository.findById(id);
        if (optionalDestino.isPresent()) {
            Destino destino = optionalDestino.get();
            destino.setNome(dto.nome());

            destinoRepository.save(destino);
            return new DestinoDto(destino.getId(), destino.getNome());
        }
        return null;
    }

    // Excluir destino
    public boolean excluir(Long id) {
        Optional<Destino> optionalDestino = destinoRepository.findById(id);
        if (optionalDestino.isPresent()) {
            destinoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<DestinoDto> buscarPorNome(String nome) {
        List<Destino> destinos = destinoRepository.findByNomeContaining(nome);
        if (!destinos.isEmpty()) {
            return destinos.stream()
                    .map(item -> new DestinoDto(
                            item.getId(),
                            item.getNome()
                    ))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public List<DestinoDto> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return destinoRepository.findAll(pageable)
                .stream()
                .map(d -> new DestinoDto(
                        d.getId(),
                        d.getNome()
                ))
                .collect(Collectors.toList());
    }
}
