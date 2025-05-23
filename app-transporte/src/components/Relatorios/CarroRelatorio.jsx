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

// Colunas disponíveis para carros
const allColumns = [
  { key: 'placa', label: 'Placa' },
  { key: 'modelo', label: 'Modelo' },
  { key: 'marca', label: 'Marca' },
];

const CarroRelatorios = ({ carros, loading }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openConfigDialog, setOpenConfigDialog] = useState(false);

  const [selectedColumns, setSelectedColumns] = useState(
    allColumns.reduce((acc, column) => ({ ...acc, [column.key]: true }), {})
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
    let dadosFiltrados = carros;

    dadosFiltrados.sort((a, b) => (a.modelo || '').localeCompare(b.modelo || ''));

    return dadosFiltrados.map((carro) => {
      const dados = {};
      allColumns.forEach((col) => {
        if (selectedColumns[col.key]) {
          dados[col.label] = carro[col.key] || 'N/A';
        }
      });
      return dados;
    });
  };

  const gerarRelatorioPDF = () => {
    const dados = prepararDadosRelatorio();
    if (dados.length === 0) {
      alert('Não há carros para gerar o relatório.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Relatório de Carros', 14, 22);

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

    doc.save('relatorio_carros.pdf');
    handleCloseMenu();
  };

  const gerarRelatorioXLS = () => {
    const dados = prepararDadosRelatorio();
    if (dados.length === 0) {
      alert('Não há carros para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    workbook.Props = {
      Title: 'Relatório de Carros',
      Subject: `Relatório gerado em ${new Date().toLocaleDateString()}`,
      Author: 'Sistema de Gestão',
      CreatedDate: new Date(),
    };

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Carros');
    XLSX.writeFile(workbook, 'relatorio_carros.xlsx');
    handleCloseMenu();
  };

  const gerarRelatorioCSV = () => {
    const dados = prepararDadosRelatorio();
    if (dados.length === 0) {
      alert('Não há carros para gerar o relatório.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dados);
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.setAttribute('href', URL.createObjectURL(blob));
    link.setAttribute('download', 'relatorio_carros.csv');
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
        disabled={loading || !carros || carros.length === 0}
        endIcon={<ConfigIcon />}
      >
        Gerar Relatório
      </Button>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={handleOpenConfig}>
          <ListItemIcon><ConfigIcon color="secondary" /></ListItemIcon>
          <ListItemText primary="Configurar Relatório" />
        </MenuItem>
        <MenuItem onClick={gerarRelatorioPDF}>
          <ListItemIcon><PdfIcon color="error" /></ListItemIcon>
          <ListItemText primary="Gerar PDF" />
        </MenuItem>
        <MenuItem onClick={gerarRelatorioXLS}>
          <ListItemIcon><XlsIcon color="success" /></ListItemIcon>
          <ListItemText primary="Gerar Excel" />
        </MenuItem>
        <MenuItem onClick={gerarRelatorioCSV}>
          <ListItemIcon><CsvIcon color="primary" /></ListItemIcon>
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
                <MenuItem value="completo">Todos os Carros</MenuItem>
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
          <Button onClick={handleCloseConfig} color="primary">Cancelar</Button>
          <Button onClick={handleCloseConfig} color="primary" variant="contained">Aplicar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CarroRelatorios;
