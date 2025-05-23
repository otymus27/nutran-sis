import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  InputLabel,
  Box,
} from '@mui/material';
import {
  Description as PdfIcon,
  TableChart as XlsIcon,
  GridOn as CsvIcon,
  Settings as ConfigIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const allColumns = [
  { key: 'destino', label: 'Destino' },
  { key: 'status', label: 'Status' },
  { key: 'dataSolicitacao', label: 'Data da Solicitação' },
  { key: 'carro', label: 'Carro' },
  { key: 'motorista', label: 'Motorista' },
  { key: 'setor', label: 'Setor' },
  { key: 'usuario', label: 'Usuario' },
  { key: 'horaSaida', label: 'Hora Saída' },
  { key: 'kmInicial', label: 'kmInicial' },
  { key: 'horaChegada', label: 'Hora Chegada' },
  { key: 'kmFinal', label: 'kmFinal' },
  { key: 'kmTotal', label: 'kmTotal' },
];

const SolicitacaoRelatorios = ({ solicitacoes, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.reduce((acc, column) => ({ ...acc, [column.key]: true }), {}),
  );

  const [reportFormat, setReportFormat] = useState('completo');

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleOpenConfig = () => {
    setOpenConfigDialog(true);
    handleCloseMenu();
  };

  const handleCloseConfig = () => {
    setOpenConfigDialog(false);
  };

  const handleColumnToggle = (column) => {
    setSelectedColumns((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const prepararDadosRelatorio = () => {
    let dadosFiltrados = solicitacoes ? [...solicitacoes] : [];

    dadosFiltrados.sort((a, b) => (a.destino || '').localeCompare(b.destino || ''));

    return dadosFiltrados.map((solicitacao) => {
      const dados = {};
      allColumns.forEach((col) => {
        if (selectedColumns[col.key]) {
          let valor;
          switch (col.key) {
            case 'dataSolicitacao':
              valor = solicitacao.dataSolicitacao ? new Date(solicitacao.dataSolicitacao).toLocaleDateString() : 'N/A';
              break;
            case 'usuario':
              valor = solicitacao.nomeUsuario ?? 'N/A';
              break;
            case 'carro':
              valor = solicitacao.placaCarro ?? 'N/A';
              break;
            case 'motorista':
              valor = solicitacao.nomeMotorista ?? 'N/A';
              break;
            case 'setor':
              valor = solicitacao.nomeSetor ?? 'N/A';
              break;
            case 'horaSaida':
              valor = solicitacao.horaSaida ?? 'N/A';
              break;
            case 'kmTotal':
              valor =
                solicitacao.kmInicial !== null && solicitacao.kmFinal !== null
                  ? solicitacao.kmFinal - solicitacao.kmInicial
                  : 'N/A';
              break;
            default:
              valor = solicitacao[col.key] ?? 'N/A';
          }
          dados[col.label] = valor;
        }
      });
      return dados;
    });
  };

  const gerarRelatorioPDF = () => {
    const dados = prepararDadosRelatorio();
    if (dados.length === 0) {
      alert('Não há solicitações para gerar o relatório.');
      return;
    }

    // Adicione a opção 'orientation: "l"' ao instanciar o jsPDF
    const doc = new jsPDF({
      orientation: 'l', // 'l' para paisagem (landscape), 'p' para retrato (portrait)
      unit: 'mm', // Unidade de medida (opcional, padrão é 'mm')
      format: 'a4', // Formato da página (opcional, padrão é 'a4')
    });
    doc.setFontSize(18);
    doc.text('Relatório de Solicitações', 14, 22);

    doc.setFontSize(10);
    doc.text(`Formato: ${reportFormat}`, 14, 30);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 36);

    const columns = Object.keys(dados[0]);
    doc.autoTable({
      startY: 44,
      columns: columns.map((col) => ({ header: col, dataKey: col })),
      body: dados,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    doc.save('relatorio_solicitacoes.pdf');
    handleCloseMenu();
  };

  const gerarRelatorioXLS = () => {
    const dados = prepararDadosRelatorio();
    if (dados.length === 0) {
      alert('Não há solicitações para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    workbook.Props = {
      Title: 'Relatório de Solicitações',
      Subject: `Relatório gerado em ${new Date().toLocaleDateString()}`,
      Author: 'Sistema de Gestão',
      CreatedDate: new Date(),
    };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitações');
    XLSX.writeFile(workbook, 'relatorio_solicitacoes.xlsx');
    handleCloseMenu();
  };

  const gerarRelatorioCSV = () => {
    const dados = prepararDadosRelatorio();
    if (dados.length === 0) {
      alert('Não há solicitações para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'relatorio_solicitacoes.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    handleCloseMenu();
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpenMenu}
        disabled={loading || !solicitacoes || solicitacoes.length === 0}
        endIcon={<ConfigIcon />}
      >
        Gerar Relatório
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenConfig}>
          <ListItemIcon>
            <ConfigIcon color="secondary" />
          </ListItemIcon>
          <ListItemText primary="Configurar Relatório" />
        </MenuItem>
        <MenuItem onClick={gerarRelatorioPDF}>
          <ListItemIcon>
            <PdfIcon color="error" />
          </ListItemIcon>
          <ListItemText primary="Gerar PDF" />
        </MenuItem>
        <MenuItem onClick={gerarRelatorioXLS}>
          <ListItemIcon>
            <XlsIcon color="success" />
          </ListItemIcon>
          <ListItemText primary="Gerar Excel" />
        </MenuItem>
        <MenuItem onClick={gerarRelatorioCSV}>
          <ListItemIcon>
            <CsvIcon color="primary" />
          </ListItemIcon>
          <ListItemText primary="Gerar CSV" />
        </MenuItem>
      </Menu>

      <Dialog open={openConfigDialog} onClose={handleCloseConfig} maxWidth="sm" fullWidth>
        <DialogTitle>Configurações do Relatório</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Formato do Relatório</InputLabel>
              <Select
                value={reportFormat}
                label="Formato do Relatório"
                onChange={(e) => setReportFormat(e.target.value)}
              >
                <MenuItem value="completo">Todas as Solicitações</MenuItem>
              </Select>
            </FormControl>

            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Selecione as Colunas</FormLabel>
              <FormGroup>
                {allColumns.map((column) => (
                  <FormControlLabel
                    key={column.key}
                    control={
                      <Checkbox checked={selectedColumns[column.key]} onChange={() => handleColumnToggle(column.key)} />
                    }
                    label={column.label}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfig} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleCloseConfig} color="primary" variant="contained">
            Aplicar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SolicitacaoRelatorios;
