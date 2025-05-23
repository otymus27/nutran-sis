package com.otymus.api_transporte.entities.Usuario.Dto;

import com.otymus.api_transporte.entities.Role.Dto.RoleDto;

import java.util.Set;

public record UsuarioDto(Long id, String login, Set<RoleDto> roles) {}