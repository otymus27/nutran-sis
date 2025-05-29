package com.otymus.api_transporte.controllers;

import com.otymus.api_transporte.entities.Solicitacao.Dto.SolicitacaoCadastroDto;
import com.otymus.api_transporte.entities.Solicitacao.Dto.SolicitacaoDto;
import com.otymus.api_transporte.entities.Solicitacao.Dto.SolicitacaoResponseDto;
import com.otymus.api_transporte.entities.Solicitacao.Solicitacao;
import com.otymus.api_transporte.exceptions.ErrorMessage;
import com.otymus.api_transporte.services.ConsultaSolicitacaoService;
import com.otymus.api_transporte.services.SolicitacaoService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/solicitacao")
public class SolicitacaoController {

    private static final Logger logger = LoggerFactory.getLogger(SolicitacaoController.class);
    public record Mensagem(String mensagem) {}

    @Autowired
    private final SolicitacaoService solicitacaoService;
    private final ConsultaSolicitacaoService consultaSolicitacaoService;

    public SolicitacaoController(SolicitacaoService solicitacaoService, ConsultaSolicitacaoService consultaSolicitacaoService) {
        this.solicitacaoService = solicitacaoService;
        this.consultaSolicitacaoService = consultaSolicitacaoService;
    }

    @PostMapping
    @Transactional
    // Todos pode CADASTRAR
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> cadastrar(@RequestBody SolicitacaoCadastroDto dto) {
        logger.info("Recebendo dados para cadastro de solicitação: {}", dto);
        SolicitacaoDto resposta = solicitacaoService.cadastrar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(resposta);
    }

    @GetMapping
    // Todos pode listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<List<SolicitacaoResponseDto>> listar() {
        return ResponseEntity.ok(solicitacaoService.listarTodos());
    }

    @GetMapping("/{id}")
    // Todos pode listar por id
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<Object> buscarPorId(@PathVariable Long id) {
        SolicitacaoDto dto = solicitacaoService.buscarPorId(id);
        if (dto != null) {
            return ResponseEntity.ok(dto);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Solicitação com ID " + id + " não encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    @Transactional
    // Apenas ADMIN e GERENTE pode EXCLUIR
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE')")
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        logger.info("Tentando excluir solicitação com ID: {}", id);
        boolean excluido = solicitacaoService.excluir(id);
        if (excluido) {
            return ResponseEntity.ok(new Mensagem("Solicitação excluída com sucesso."));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new Mensagem("Solicitação com ID " + id + " não encontrado."));
        }
    }

    @PutMapping("/{id}")
    @Transactional
    // Todos pode atualizar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public ResponseEntity<?> atualizar(@PathVariable Long id, @RequestBody SolicitacaoCadastroDto dto) {
        logger.info("Atualizando solicitação com ID: {} e dados: {}", id, dto);
        SolicitacaoDto resposta = solicitacaoService.atualizar(id, dto);
        if (resposta != null) {
            return ResponseEntity.ok(resposta);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage("Solicitação com ID " + id + " não encontrado"));
        }
    }

    @GetMapping("/paginado/")
    // Todos podem listar
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE','SCOPE_BASIC')")
    public List<SolicitacaoDto> listarPaginado(@RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "5") int size) {
        return solicitacaoService.listarPaginado(page, size);
    }

    // Método para consultas personalizadas
    @GetMapping("/filtro")
    public Page<SolicitacaoResponseDto> filtrarSolicitacoes(
            @RequestParam(required = false) Long motoristaId,
            @RequestParam(required = false) Long carroId,
            @RequestParam(required = false) Long destinoId,
            @RequestParam(required = false) Long setorId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataInicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dataFim,
            Pageable pageable
    ) {
        Page<Solicitacao> solicitacoes = consultaSolicitacaoService.consultar(
                motoristaId, destinoId, setorId,carroId, dataInicio, dataFim, pageable
        );

        return solicitacoes.map(this::toResponseDto);
    }

    private SolicitacaoResponseDto toResponseDto(Solicitacao solicitacao) {
        return new SolicitacaoResponseDto(
                solicitacao.getId(),
                solicitacao.getDataSolicitacao(),
                solicitacao.getDestino() != null ? solicitacao.getDestino().getId() : null,
                solicitacao.getDestino() != null ? solicitacao.getDestino().getNome() : null,
                solicitacao.getStatus().toString(),
                solicitacao.getCarro() != null ? solicitacao.getCarro().getId() : null,
                solicitacao.getCarro() != null ? solicitacao.getCarro().getPlaca() : null,
                solicitacao.getMotorista() != null ? solicitacao.getMotorista().getId() : null,
                solicitacao.getMotorista() != null ? solicitacao.getMotorista().getNome() : null,
                solicitacao.getSetor() != null ? solicitacao.getSetor().getId() : null,
                solicitacao.getSetor() != null ? solicitacao.getSetor().getNome() : null,
                solicitacao.getUsuario() != null ? solicitacao.getUsuario().getId() : null,
                solicitacao.getUsuario() != null ? solicitacao.getUsuario().getLogin() : null,
                solicitacao.getKmInicial(),
                solicitacao.getKmFinal(),
                solicitacao.getHoraSaida(),
                solicitacao.getHoraChegada()
        );
    }


}
