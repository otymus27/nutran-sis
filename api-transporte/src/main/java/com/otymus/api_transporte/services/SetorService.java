package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.Setor.Dto.SetorCadastroDto;
import com.otymus.api_transporte.entities.Setor.Dto.SetorDto;
import com.otymus.api_transporte.entities.Setor.Setor;
import com.otymus.api_transporte.repositories.SetorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SetorService {

    @Autowired
    private final SetorRepository setorRepository;

    public SetorService(SetorRepository setorRepository) {
        this.setorRepository = setorRepository;
    }

    // Cadastrar um novo setor
    public SetorDto cadastrar(SetorCadastroDto dto) {
        Setor setor = new Setor();
        setor.setNome(dto.nome());

        setorRepository.save(setor);

        return new SetorDto(setor.getId(), setor.getNome());
    }

    // Listar todos os setores
    public List<SetorDto> listar() {
        List<Setor> setores = setorRepository.findAll();
        return setores.stream()
                .map(item -> {

                    return new SetorDto(
                            item.getId(),
                            item.getNome()
                    );
                })
                .collect(Collectors.toList());
    }

    // Buscar setor por ID
    public SetorDto buscarPorId(Long id) {
        Optional<Setor> optionalSetor = setorRepository.findById(id);
        if (optionalSetor.isPresent()) {
            Setor setor = optionalSetor.get();
            return new SetorDto(
                    setor.getId(),
                    setor.getNome()
            );
        }
        return null;
    }

    // Atualizar setor existente
    public SetorDto atualizar(Long id, SetorCadastroDto dto) {
        Optional<Setor> optionalSetor = setorRepository.findById(id);
        if (optionalSetor.isPresent()) {
            Setor setor = optionalSetor.get();
            setor.setNome(dto.nome());

            setorRepository.save(setor);
            return new SetorDto(setor.getId(), setor.getNome());
        }
        return null;
    }

    // Excluir setor
    public boolean excluir(Long id) {
        Optional<Setor> optionalSetor = setorRepository.findById(id);
        if (optionalSetor.isPresent()) {
            setorRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<SetorDto> buscarPorNome(String nome) {
        List<Setor> setores = setorRepository.findByNomeContaining(nome);
        if (!setores.isEmpty()) {
            return setores.stream()
                    .map(item -> new SetorDto(
                            item.getId(),
                            item.getNome()
                    ))
                    .collect(Collectors.toList());
        }
        return null;
    }

    public List<SetorDto> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return setorRepository.findAll(pageable)
                .stream()
                .map(s -> new SetorDto(s.getId(), s.getNome()))
                .collect(Collectors.toList());
    }


}