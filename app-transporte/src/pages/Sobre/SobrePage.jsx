import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Button, Link, Chip } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import GitHubIcon from '@mui/icons-material/GitHub';

const Sobre = () => {
  const sistemaVersao = '1.0.0'; // Pode centralizar isso em uma constante global se preferir.

  return (
    <Box sx={{ p: { xs: 3, md: 6 }, backgroundColor: 'background.default' }}>
      <Box textAlign="center" mb={5}>
        <CodeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
        <Typography variant="h3" gutterBottom>
          Sobre o Sistema
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Sistema desenvolvido para otimizar a gestão de recursos, usuários e processos.
        </Typography>
        <Chip label={`Versão: ${sistemaVersao}`} color="primary" variant="outlined" sx={{ mt: 1 }} />
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <BuildIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" gutterBottom>
                Funcionalidades
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Gestão de usuários e permissões.
                <br />
                • Controle de processos e recursos.
                <br />
                • Relatórios personalizados.
                <br />• Interface responsiva e intuitiva.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <CodeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" gutterBottom>
                Tecnologias
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                • Frontend: React, Material UI
                <br />
                • Backend: Spring Boot, JWT
                <br />
                • Banco de Dados: MySQL
                <br />• Validações com Zod e React Hook Form
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <PersonIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" gutterBottom>
                Sobre o Desenvolvedor
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Desenvolvido por FÁBIO DE ALENCAR ROCHA - NTINF HRG, entusiasta de desenvolvimento web fullstack.
                Projeto realizado com foco em aprendizado, produtividade e boas práticas. Projeto desenvolvido em
                complementação de PROJETO DE EXTENSÃO da faculdade.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box textAlign="center" mt={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<GitHubIcon />}
          component={Link}
          href="https://github.com/seuusuario"
          target="_blank"
          rel="noopener"
        >
          Ver no GitHub
        </Button>
      </Box>
    </Box>
  );
};

export default Sobre;
