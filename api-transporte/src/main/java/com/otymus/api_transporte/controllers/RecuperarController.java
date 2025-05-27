package com.otymus.api_transporte.controllers;

import com.otymus.api_transporte.entities.ResetSenhaRequestDto;
import com.otymus.api_transporte.entities.RecuperaSenhaRequestDto;
import com.otymus.api_transporte.exceptions.ErrorMessage;
import com.otymus.api_transporte.services.RecuperarService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/recuperar-senha")
public class RecuperarController {

    private static final Logger logger = LoggerFactory.getLogger(RecuperarController.class);

    public record Mensagem(String mensagem) {}

    private final RecuperarService recuperarService;

    public RecuperarController(RecuperarService recuperarService) {
        this.recuperarService = recuperarService;
    }

    /**
     * Endpoint para o ADMIN gerar a senha provisória para o usuário.
     * @param dto com o id do usuário para quem será gerada a senha provisória
     * @return mensagem de sucesso ou erro caso usuário não exista
     */
    @PostMapping("/gerar-provisoria")
    @Transactional
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Object> gerarSenhaProvisoria(@RequestBody RecuperaSenhaRequestDto dto) {
        logger.info("Iniciando solicitação de geração de senha provisória para ID: {}", dto.id());

        try {
            String senhaProvisoria = recuperarService.gerarSenhaProvisoria(dto.id());
            return ResponseEntity.ok(new Mensagem("Senha provisória gerada com sucesso: " + senhaProvisoria));
        } catch (IllegalArgumentException e) {
            logger.error("Erro ao gerar senha provisória: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ErrorMessage(e.getMessage()));
        }
    }

    /**
     * Endpoint para o usuário redefinir a senha usando a senha provisória.
     * @param dto com id, senha provisória e nova senha definitiva
     * @return mensagem de sucesso ou erro caso dados inválidos
     */
    @PostMapping("/confirmar-redefinicao")
    @Transactional
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_GERENTE', 'SCOPE_BASIC')")
    public ResponseEntity<Object> confirmarRedefinicao(@RequestBody ResetSenhaRequestDto dto) {
        logger.info("Tentando redefinir senha para ID: {}", dto.id());

        try {
            recuperarService.atualizarSenha(dto.id(), dto.senhaProvisoria(), dto.novaSenha());
            return ResponseEntity.ok(new Mensagem("Senha redefinida com sucesso."));
        } catch (IllegalArgumentException e) {
            logger.error("Erro ao redefinir senha: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorMessage(e.getMessage()));
        }
    }
}
