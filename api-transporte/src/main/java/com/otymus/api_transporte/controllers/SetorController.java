package com.otymus.api_transporte.controllers;

import com.otymus.api_transporte.entities.Setor.Dto.SetorCadastroDto;
import com.otymus.api_transporte.entities.Setor.Dto.SetorDto;
import com.otymus.api_transporte.exceptions.ErrorMessage;
import com.otymus.api_transporte.services.SetorService;
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
@RequestMapping("/setor") // Define o caminho base da API para Setor
public class SetorController {
    private static final Logger logger = LoggerFactory.getLogger(SetorController.class);
    public record Mensagem(String mensagem) {}

    @Autowired
    private final SetorService setorService;

    public SetorController(SetorService setorService) {
        this.setorService = setorService;
    }

    @PostMapping
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Object> cadastrar(@RequestBody SetorCadastroDto dto) {
        logger.info("Recebendo dados para cadastro de setor: {}", dto);
        SetorDto resposta = setorService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    // Todos pode listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<List<SetorDto>> listar() {
        List<SetorDto> lista = setorService.listar();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    // Todos podem buscar por id
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        SetorDto dto = setorService.buscarPorId(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Setor com ID " + id + " não encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        logger.info("Tentando excluir setor com ID: {}", id);
        boolean excluido = setorService.excluir(id);
        if (excluido) {
            return ResponseEntity.ok(new Mensagem("Setor excluído com sucesso."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Mensagem("Setor com ID " + id + " não encontrado."));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    // Somente ADMIN e GERENTE pode atualizar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody SetorCadastroDto dto) {
        logger.info("Atualizando setor com ID: {} e dados: {}", id, dto);
        SetorDto resposta = setorService.atualizar(id, dto);
        if (resposta != null) {
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Setor com ID " + id + " não encontrado"));
        }
    }

    @GetMapping("/buscarPorNome")
    // Todos podem buscar por nome
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorNome(@RequestParam String nome) {
        List<SetorDto> lista = setorService.buscarPorNome(nome);
        if (lista != null && !lista.isEmpty()) {
            return ResponseEntity.ok(lista);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage("Nenhum setor encontrado com nome contendo: " + nome));
        }
    }

    @GetMapping("/paginado/")
    // Todos podem listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public List<SetorDto> listarPaginado(@RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "5") int size) {
        return setorService.listarPaginado(page, size);
    }


}
