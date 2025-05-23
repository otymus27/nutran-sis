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

// Colunas disponíveis para setores (apenas id e nome)
const allColumns = [
  { key: 'id', label: 'ID' },
  { key: 'nome', label: 'Nome' },
];

const SetorRelatorios = ({ setores, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);

  // Inicializa todas as colunas como selecionadas
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
    let dadosFiltered = setores;

    // Ordena pelo nome
    dadosFiltered.sort((a, b) => (a.nome || '').localeCompare(b.nome || ''));

    // Mapeia só as colunas selecionadas
    return dadosFiltered.map((setor) => {
      const dados = {};
      allColumns.forEach((col) => {
        if (selectedColumns[col.key]) {
          dados[col.label] = setor[col.key] ?? 'N/A';
        }
      });
      return dados;
    });
  };

  const gerarRelatorioPDF = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há setores para gerar o relatório.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório de Setores', 14, 22);

    doc.setFontSize(10);
    doc.text(`Formato: ${reportFormat}`, 14, 30);
    doc.text(`Gerado em: ${new Date().toLocaleDateString()}`, 14, 36);

    const columns = Object.keys(dadosRelatorio[0]);
    doc.autoTable({
      startY: 44,
      columns: columns.map((col) => ({ header: col, dataKey: col })),
      body: dadosRelatorio,
      theme: 'striped',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
    });

    doc.save('relatorio_setores.pdf');
    handleCloseMenu();
  };

  const gerarRelatorioXLS = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há setores para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dadosRelatorio);
    const workbook = XLSX.utils.book_new();

    workbook.Props = {
      Title: 'Relatório de Setores',
      Subject: `Relatório gerado em ${new Date().toLocaleDateString()}`,
      Author: 'Sistema de Gestão',
      CreatedDate: new Date(),
    };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Setores');
    XLSX.writeFile(workbook, 'relatorio_setores.xlsx');
    handleCloseMenu();
  };

  const gerarRelatorioCSV = () => {
    const dadosRelatorio = prepararDadosRelatorio();
    if (dadosRelatorio.length === 0) {
      alert('Não há setores para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dadosRelatorio);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'relatorio_setores.csv');
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
        disabled={loading || !setores || setores.length === 0}
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
                <MenuItem value="completo">Todos os Setores</MenuItem>
                {/* Pode adicionar filtros extras aqui, se quiser */}
              </Select>
            </FormControl>

            <FormControl component="fieldset" variant="standard">
              <FormLabel component="legend">Selecione as Colunas</FormLabel>
              <FormGroup>
                {allColumns.map((column) => (
                  <FormControlLabel
                    key={column.key}
                    control={
                      <Checkbox
                        checked={selectedColumns[column.key]}
                        onChange={() => handleColumnToggle(column.key)}
                      />
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

export default SetorRelatorios;
