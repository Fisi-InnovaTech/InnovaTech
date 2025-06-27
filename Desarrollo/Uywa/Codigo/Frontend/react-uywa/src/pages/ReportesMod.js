import React, { useState, useEffect } from "react";
import { 
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  TextField,
  Pagination,
  Collapse,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import { styles } from '../components/Reportes/ReportesStyle';

const rejectionReasons = [
  "Información insuficiente",
  "Imagen no válida",
  "Datos incorrectos",
  "Animal no encontrado",
  "Otro"
];

const Reportes = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReport, setExpandedReport] = useState(null);
  const [goToPage, setGoToPage] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [rejectDialog, setRejectDialog] = useState({ open: false, reportId: null, reason: "", customReason: "" });
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const reportsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch('https://innovatech-ztzv.onrender.com/alertas/allalerts');
        
        if (!response.ok) {
          throw new Error('Error al obtener los reportes');
        }

        const data = await response.json();
        setReports(data);
        setFilteredReports(data);
      } catch (error) {
        showSnackbar(error.message, "error");
      }
    };

    fetchReports();
  }, []);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const changeState = async (report) => {
    try {
      const response = await fetch('https://innovatech-ztzv.onrender.com/alertas/changingState', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          id: report.id, 
          estado: report.estado,
          reporte_detallado: report.reporte_detallado
        })
      });

      if (!response.ok) {
        throw new Error('Error al cambiar el estado');
      }

      return true;
    } catch (error) {
      showSnackbar(error.message, "error");
      return false;
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
  };

  const handleGoToPageChange = (event) => {
    setGoToPage(event.target.value);
  };

  const handleGoToPageClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredReports.length / reportsPerPage)) {
      setCurrentPage(pageNumber);
    } else {
      showSnackbar("Número de página inválido", "error");
    }
  };

  const handleClick = () => {
    let filtered = reports;
    
    if (searchTerm) {
      filtered = filtered.filter(report =>
        (report.usuario?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.animal_nombre?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (report.estado?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedFilter !== "todos") {
      filtered = filtered.filter(report => report.estado === selectedFilter);
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
    
    if (filtered.length === 0) {
      showSnackbar("No se encontraron reportes con los criterios seleccionados", "info");
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const paginatedReports = filteredReports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage);

  const toggleReport = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const openRejectDialog = (reportId) => {
    setRejectDialog({ open: true, reportId, reason: "", customReason: "" });
  };

  const closeRejectDialog = () => {
    setRejectDialog({ open: false, reportId: null, reason: "", customReason: "" });
  };

  const handleRejectReasonChange = (event) => {
    setRejectDialog({ ...rejectDialog, reason: event.target.value });
  };

  const handleCustomReasonChange = (event) => {
    setRejectDialog({ ...rejectDialog, customReason: event.target.value });
  };

  const handleState = async (reportId, newEstado) => {
    try {
      let reporte_detallado = null;
      
      if (newEstado === "rechazado") {
        reporte_detallado = rejectDialog.reason === "Otro" 
          ? rejectDialog.customReason 
          : rejectDialog.reason;
        
        if (!reporte_detallado) {
          showSnackbar("Debe proporcionar un motivo de rechazo", "error");
          return;
        }
      }

      const updatedReports = reports.map((report) => {
        if (report.id === reportId) {
          return { 
            ...report, 
            estado: newEstado,
            reporte_detallado: newEstado === "rechazado" ? reporte_detallado : null
          };
        }
        return report;
      });

      const reportToUpdate = updatedReports.find(report => report.id === reportId);

      if (!reportToUpdate) {
        showSnackbar("No se encontró el reporte a actualizar", "error");
        return;
      }

      const success = await changeState(reportToUpdate);
      if (success) {
        setReports(updatedReports);
        setFilteredReports(updatedReports);
        showSnackbar(`Estado cambiado a ${newEstado}`, "success");
        closeRejectDialog();
      } else {
        showSnackbar("Error al cambiar el estado", "error");
      }
    } catch (error) {
      showSnackbar(`Error al actualizar estado: ${error.message}`, "error");
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
        return '#3AB795';
      case 'rechazado':
        return '#E52F60';
      case 'pendiente':
        return '#F9C22E';
      default:
        return '#DDE2E5';
    }
  };

  const pageCount = Math.ceil(filteredReports.length / reportsPerPage);

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.searchBox}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={styles.searchField}
          placeholder="Buscar por usuario, animal o descripción"
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={selectedFilter}
            label="Estado"
            onChange={handleFilterChange}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="aprobado">Aprobado</MenuItem>
            <MenuItem value="rechazado">Rechazado</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          sx={styles.searchIcon}
          onClick={handleClick}
          startIcon={<SearchIcon/>}
        >
          Buscar
        </Button>
      </Box>

      {filteredReports.length === 0 ? (
        <Box sx={styles.noResults}>
          <Typography variant="h6">No se encontraron reportes</Typography>
          <Button variant="outlined" onClick={() => {
            setSearchTerm("");
            setSelectedFilter("todos");
            setFilteredReports(reports);
          }}>
            Mostrar todos
          </Button>
        </Box>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{textAlign: "center"}}>ID</TableCell>
                  <TableCell sx={{textAlign: "center"}}>Usuario</TableCell>
                  <TableCell sx={{textAlign: "center"}}>Animal</TableCell>
                  <TableCell sx={{textAlign: "center"}}>Estado</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedReports.map((report) => (
                  <React.Fragment key={report.id}>
                    <TableRow>
                      <TableCell sx={{textAlign: "center"}}>{report.id}</TableCell>
                      <TableCell sx={{textAlign: "center"}}>{report.usuario?.nombre || "N/A"}</TableCell>
                      <TableCell sx={{textAlign: "center"}}>{report.animal_nombre || "N/A"}</TableCell>
                      <TableCell sx={{textAlign: "center"}}>
                        <Typography variant="small" sx={{
                          backgroundColor: getEstadoColor(report.estado), 
                          borderRadius:"15px", 
                          paddingY:"5px", 
                          paddingX:"15px", 
                          display: "inline-block", 
                          width:"80px", 
                          color:"white"
                        }}>
                          {report.estado}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{textAlign: "right"}}>
                        <Button sx={styles.visibilityIcon} onClick={() => toggleReport(report.id)}>
                          <VisibilitySharpIcon sx={{ color: 'white' }}/>
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedReport === report.id && (
                      <TableRow>
                        <TableCell colSpan={5}>
                          <Collapse in={expandedReport === report.id}>
                            <Container sx={styles.expandedContent}>
                              <Box sx={styles.expandedBox}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Detalles del Reporte</Typography>
                                <Typography sx={styles.description_report}>
                                  <strong>Descripción:</strong> {report.descripcion || "No disponible"}
                                </Typography>
                                {report.reporte_detallado && (
                                  <Typography sx={{ mt: 2, color: '#E52F60' }}>
                                    <strong>Motivo de rechazo:</strong> {report.reporte_detallado}
                                  </Typography>
                                )}
                                {report.evidencia_imagen && (
                                  <img 
                                    src={report.evidencia_imagen} 
                                    alt={report.animal_nombre} 
                                    style={styles.image} 
                                    onError={(e) => {
                                      e.target.onerror = null; 
                                      e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlIi8+PC9zdmc+";
                                    }}
                                  />
                                )}
                              </Box>
                              <Box sx={{display:"flex", gap:"20px", mt: 2 }}>
                                {report.estado === "pendiente" && (
                                  <>
                                    <Button 
                                      variant="contained" 
                                      sx={styles.actionButton} 
                                      onClick={() => handleState(report.id, "aprobado")}
                                    >
                                      Aceptar
                                    </Button>
                                    <Button 
                                      variant="contained" 
                                      sx={{ 
                                        ...styles.actionButton,
                                        backgroundColor: '#E52F60',
                                        '&:hover': { backgroundColor: '#C6284D' }
                                      }} 
                                      onClick={() => openRejectDialog(report.id)}
                                    >
                                      Rechazar
                                    </Button>
                                  </>
                                )}
                              </Box>
                            </Container>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={styles.paginationBox}>
            <Box sx={{display: "flex", alignItems:"center", gap:"10px"}}>
              <Typography variant="body2">
                Ir a la página:
              </Typography>
              <TextField 
                value={goToPage} 
                onChange={handleGoToPageChange} 
                sx={styles.goToPageField} 
                type="number"
                inputProps={{ min: 1, max: pageCount }}
              />
              <Button variant="contained" onClick={handleGoToPageClick}>
                Ir
              </Button>
            </Box>
            <Pagination 
              count={pageCount} 
              page={currentPage} 
              onChange={handlePageChange} 
              color="primary"
              showFirstButton 
              showLastButton
            />
          </Box>
        </>
      )}

      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }} 
        onClick={() => navigate('/moderador')}
      >
        Volver al panel
      </Button>

      <Dialog open={rejectDialog.open} onClose={closeRejectDialog}>
        <DialogTitle>Motivo de Rechazo</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Seleccione un motivo</InputLabel>
            <Select
              value={rejectDialog.reason}
              label="Seleccione un motivo"
              onChange={handleRejectReasonChange}
            >
              {rejectionReasons.map((reason) => (
                <MenuItem key={reason} value={reason}>{reason}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {rejectDialog.reason === "Otro" && (
            <TextField
              autoFocus
              margin="dense"
              label="Especifique el motivo"
              type="text"
              fullWidth
              variant="outlined"
              value={rejectDialog.customReason}
              onChange={handleCustomReasonChange}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRejectDialog}>Cancelar</Button>
          <Button 
            onClick={() => handleState(rejectDialog.reportId, "rechazado")}
            disabled={!rejectDialog.reason || (rejectDialog.reason === "Otro" && !rejectDialog.customReason)}
            color="error"
          >
            Confirmar Rechazo
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Reportes;