package com.otymus.api_transporte.controllers;

import com.otymus.api_transporte.entities.Motorista.Dto.MotoristaCadastroDto;
import com.otymus.api_transporte.entities.Motorista.Dto.MotoristaDto;
import com.otymus.api_transporte.exceptions.ErrorMessage;
import com.otymus.api_transporte.services.MotoristaService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/motorista")
public class MotoristaController {

    private static final Logger logger = LoggerFactory.getLogger(MotoristaController.class);
    public record Mensagem(String mensagem) {}

    @Autowired
    private final MotoristaService motoristaService;

    public MotoristaController(MotoristaService motoristaService) {
        this.motoristaService = motoristaService;
    }

    @PostMapping
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Object> cadastrar(@RequestBody MotoristaCadastroDto dto) {
        logger.info("Recebendo dados para cadastro de motorista: {}", dto);
        MotoristaDto resposta = motoristaService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    // Todos pode listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<List<MotoristaDto>> listar() {
        List<MotoristaDto> lista = motoristaService.listar();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    // Todos podem buscar por id
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        MotoristaDto dto = motoristaService.buscarPorId(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Motorista com ID " + id + " não encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        logger.info("Tentando excluir motorista com ID: {}", id);
        boolean excluido = motoristaService.excluir(id);
        if (excluido) {
            return ResponseEntity.ok(new Mensagem("Motorista excluído com sucesso."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Mensagem("Motorista com ID " + id + " não encontrado."));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    // Somente ADMIN e GERENTE pode atualizar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody MotoristaCadastroDto dto) {
        logger.info("Atualizando motorista com ID: {} e dados: {}", id, dto);
        MotoristaDto resposta = motoristaService.atualizar(id, dto);
        if (resposta != null) {
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Motorista com ID " + id + " não encontrado"));
        }
    }

    @GetMapping("/buscarPorNome")
    // Todos podem buscar por nome
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorNome(@RequestParam String nome) {
        List<MotoristaDto> lista = motoristaService.buscarPorNome(nome);
        if (lista != null && !lista.isEmpty()) {
            return ResponseEntity.ok(lista);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage("Nenhum motorista encontrado com nome contendo: " + nome));
        }
    }

    @GetMapping("/paginado/")
    // Todos podem listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public List<MotoristaDto> listarPaginado(@RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "5") int size) {
        return motoristaService.listarPaginado(page, size);
    }


}
