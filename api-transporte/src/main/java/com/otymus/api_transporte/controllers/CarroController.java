package com.otymus.api_transporte.controllers;

import com.otymus.api_transporte.entities.Carro.Dto.CarroCadastroDto;
import com.otymus.api_transporte.entities.Carro.Dto.CarroDto;
import com.otymus.api_transporte.exceptions.ErrorMessage;
import com.otymus.api_transporte.services.CarroService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173") // Permite requisições do front-end
@RestController
@RequestMapping("/carro")
public class CarroController {

    private static final Logger logger = LoggerFactory.getLogger(CarroController.class);
    public record Mensagem(String mensagem) {}

    @Autowired
    private final CarroService carroService;

    public CarroController(CarroService carroService) {
        this.carroService = carroService;
    }

    @PostMapping
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Object> cadastrar(@RequestBody CarroCadastroDto dto) {
        logger.info("Recebendo dados para cadastro de carro: {}", dto);
        CarroDto resposta = carroService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    // Todos pode listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<List<CarroDto>> listar() {
        List<CarroDto> lista = carroService.listar();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    // Todos podem buscar por id
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        CarroDto dto = carroService.buscarPorId(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Carro com ID " + id + " não encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        logger.info("Tentando excluir carro com ID: {}", id);
        boolean excluido = carroService.excluir(id);
        if (excluido) {
            return ResponseEntity.ok(new Mensagem("Carro excluído com sucesso."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Mensagem("Carro com ID " + id + " não encontrado."));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    // Somente ADMIN e GERENTE pode atualizar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody CarroCadastroDto dto) {
        logger.info("Atualizando carro com ID: {} e dados: {}", id, dto);
        CarroDto resposta = carroService.atualizar(id, dto);
        if (resposta != null) {
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Carro com ID " + id + " não encontrado"));
        }
    }

    @GetMapping("/buscarPorPlaca")
    // Todos podem buscar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<?> buscarPorPlaca(@RequestParam String placa) {
        logger.info("Buscando carros com placa contendo: {}", placa);
        List<CarroDto> carros = carroService.buscarPorPlaca(placa);

        if (carros == null || carros.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage("Nenhum carro encontrado com a placa contendo: " + placa));
        }

        return ResponseEntity.ok(carros);
    }

    @GetMapping("/paginado/")
    // Todos podem listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public List<CarroDto> listarPaginado(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "5") int size) {
        return carroService.listarPaginado(page, size);
    }




}
