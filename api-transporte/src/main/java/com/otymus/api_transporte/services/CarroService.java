package com.otymus.api_transporte.services;

import com.otymus.api_transporte.entities.Carro.Carro;
import com.otymus.api_transporte.entities.Carro.Dto.CarroCadastroDto;
import com.otymus.api_transporte.entities.Carro.Dto.CarroDto;
import com.otymus.api_transporte.repositories.CarroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarroService {

    @Autowired
    private final CarroRepository carroRepository;

    public CarroService(CarroRepository carroRepository) {
        this.carroRepository = carroRepository;
    }

    // Cadastrar um novo carro
    public CarroDto cadastrar(CarroCadastroDto dto) {
        Carro carro = new Carro();
        carro.setMarca(dto.marca());
        carro.setModelo(dto.modelo());
        carro.setPlaca(dto.placa());

        carroRepository.save(carro);

        return new CarroDto(carro.getId(), carro.getMarca(), carro.getModelo(), carro.getPlaca());
    }

    // Listar todos os carros
    public List<CarroDto> listar() {
        List<Carro> carros = carroRepository.findAll();
        return carros.stream()
                .map(carro -> new CarroDto(
                        carro.getId(),
                        carro.getMarca(),
                        carro.getModelo(),
                        carro.getPlaca()
                ))
                .collect(Collectors.toList());
    }

    // Buscar carro por ID
    public CarroDto buscarPorId(Long id) {
        Optional<Carro> optionalCarro = carroRepository.findById(id);
        if (optionalCarro.isPresent()) {
            Carro carro = optionalCarro.get();
            return new CarroDto(
                    carro.getId(),
                    carro.getMarca(),
                    carro.getModelo(),
                    carro.getPlaca()
            );
        }
        return null;
    }

    // Atualizar carro existente
    public CarroDto atualizar(Long id, CarroCadastroDto dto) {
        Optional<Carro> optionalCarro = carroRepository.findById(id);
        if (optionalCarro.isPresent()) {
            Carro carro = optionalCarro.get();
            carro.setMarca(dto.marca());
            carro.setModelo(dto.modelo());
            carro.setPlaca(dto.placa());

            carroRepository.save(carro);

            return new CarroDto(carro.getId(), carro.getMarca(), carro.getModelo(), carro.getPlaca());
        }
        return null;
    }

    // Excluir carro
    public boolean excluir(Long id) {
        Optional<Carro> optionalCarro = carroRepository.findById(id);
        if (optionalCarro.isPresent()) {
            carroRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<CarroDto> buscarPorPlaca(String placa) {
        List<Carro> carros = carroRepository.findByPlacaContaining(placa);
        return carros.stream()
                .map(carro -> new CarroDto(
                        carro.getId(),
                        carro.getMarca(),
                        carro.getModelo(),
                        carro.getPlaca()
                ))
                .collect(Collectors.toList());
    }

    public List<CarroDto> listarPaginado(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carroRepository.findAll(pageable)
                .stream()
                .map(c -> new CarroDto(c.getId(), c.getMarca(), c.getModelo(), c.getPlaca()))
                .collect(Collectors.toList());
    }


}

