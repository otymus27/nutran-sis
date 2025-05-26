package com.otymus.api_transporte.controllers;

import com.otymus.api_transporte.entities.Destino.Dto.DestinoCadastroDto;
import com.otymus.api_transporte.entities.Destino.Dto.DestinoDto;
import com.otymus.api_transporte.exceptions.ErrorMessage;
import com.otymus.api_transporte.services.DestinoService;
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
@RequestMapping("/destino") // Define o caminho base da API para Destino
public class DestinoController {

    private static final Logger logger = LoggerFactory.getLogger(DestinoController.class);
    public record Mensagem(String mensagem) {}

    @Autowired
    private final DestinoService destinoService;

    public DestinoController(DestinoService destinoService) {
        this.destinoService = destinoService;
    }

    @PostMapping
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Object> cadastrar(@RequestBody DestinoCadastroDto dto) {
        logger.info("Recebendo dados para cadastro de destino: {}", dto);
        DestinoDto resposta = destinoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE', 'SCOPE_BASIC')")
    public ResponseEntity<List<DestinoDto>> listar() {
        List<DestinoDto> lista = destinoService.listar();
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE', 'SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        DestinoDto dto = destinoService.buscarPorId(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Destino com ID " + id + " não encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        logger.info("Tentando excluir destino com ID: {}", id);
        boolean excluido = destinoService.excluir(id);
        if (excluido) {
            return ResponseEntity.ok(new Mensagem("Destino excluído com sucesso."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Mensagem("Destino com ID " + id + " não encontrado."));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody DestinoCadastroDto dto) {
        logger.info("Atualizando destino com ID: {} e dados: {}", id, dto);
        DestinoDto resposta = destinoService.atualizar(id, dto);
        if (resposta != null) {
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Destino com ID " + id + " não encontrado"));
        }
    }

    @GetMapping("/buscarPorNome")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE', 'SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorNome(@RequestParam String nome) {
        List<DestinoDto> lista = destinoService.buscarPorNome(nome);
        if (lista != null && !lista.isEmpty()) {
            return ResponseEntity.ok(lista);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ErrorMessage("Nenhum destino encontrado com nome contendo: " + nome));
        }
    }

    @GetMapping("/paginado")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE', 'SCOPE_BASIC')")
    public List<DestinoDto> listarPaginado(@RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "5") int size) {
        return destinoService.listarPaginado(page, size);
    }
}
