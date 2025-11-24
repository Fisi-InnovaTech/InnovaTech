import { useState, useEffect } from "react";
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

const backendURL = "http://127.0.0.1:3000/reportes";

const Reportes = () => {

  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");

  const [expandedReport, setExpandedReport] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [rejectDialog, setRejectDialog] = useState({
    open: false,
    reportId: null,
    reason: "",
    customReason: ""
  });

  const navigate = useNavigate();
  const reportsPerPage = 10;

  // ================================
  // FETCH PRINCIPAL
  // ================================
  const fetchReports = async () => {
    try {
      const response = await fetch(backendURL);

      if (!response.ok) {
        throw new Error("Error al obtener los reportes");
      }

      const json = await response.json();
      const data = json.data;

      setReports(data);
      setFilteredReports(data);

    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // ================================
  // SNACKBAR
  // ================================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ================================
  // PATCH → RECHAZAR REPORTE
  // ================================
  const rejectReport = async (id, motivo) => {
    try {
      const res = await fetch(
        `${backendURL}/estado/${id}?estado=rechazado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ motivo })
        }
      );

      if (!res.ok) throw new Error("No se pudo rechazar el reporte");

      showSnackbar("Reporte rechazado correctamente", "success");
      await fetchReports(); // refrescar tabla

    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  // ================================
  // PATCH → APROBAR REPORTE
  // ================================
  const approveReport = async (id) => {
    try {
      const res = await fetch(
        `${backendURL}/estado/${id}?estado=aprobado`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!res.ok) throw new Error("No se pudo aprobar el reporte");

      showSnackbar("Reporte aprobado correctamente", "success");
      await fetchReports(); // refrescar tabla

    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  // ================================
  // FILTRO Y BUSQUEDA EN TIEMPO REAL
  // ================================
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.usuario?.nombres?.toLowerCase().includes(term) ||
        report.usuario?.apellidos?.toLowerCase().includes(term) ||
        report.animal_nombre?.toLowerCase().includes(term) ||
        report.descripcion?.toLowerCase().includes(term)
      );
    }

    if (selectedFilter !== "todos") {
      filtered = filtered.filter(r => r.estado === selectedFilter);
    }

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedFilter, reports]);

  // ================================
  // PAGINACIÓN
  // ================================
  const pageCount = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage);

  const handleGoToPageClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
    } else {
      showSnackbar("Número de página inválido", "error");
    }
  };

  // ================================
  // EXPANDIR
  // ================================
  const toggleReport = (id) => {
    setExpandedReport(expandedReport === id ? null : id);
  };

  // ================================
  // DIALOGO RECHAZO
  // ================================
  const openRejectDialog = (id) => {
    setRejectDialog({ open: true, reportId: id, reason: "", customReason: "" });
  };

  const closeRejectDialog = () => {
    setRejectDialog({ open: false, reportId: null, reason: "", customReason: "" });
  };

  const confirmReject = async () => {
    const motivo =
      rejectDialog.reason === "Otro"
        ? rejectDialog.customReason
        : rejectDialog.reason;

    await rejectReport(rejectDialog.reportId, motivo);
    closeRejectDialog();
  };

  // ================================
  // COLOR ETIQUETA
  // ================================
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "aprobado": return "#3AB795";
      case "rechazado": return "#E52F60";
      case "pendiente": return "#F9C22E";
      default: return "#DDE2E5";
    }
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.searchBox}>
        
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.searchField}
          placeholder="Buscar por nombre, animal o descripción"
        />

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={selectedFilter}
            label="Estado"
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="aprobado">Aprobado</MenuItem>
            <MenuItem value="rechazado">Rechazado</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" sx={styles.searchIcon} startIcon={<SearchIcon />}>
          Buscar
        </Button>

      </Box>

      {/* ===================================== */}
      {/* TABLA */}
      {/* ===================================== */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">Animal</TableCell>
              <TableCell align="center">Estado</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedReports.map(report => (
              <>

                <TableRow key={report.id}>
                  <TableCell align="center">{report.id}</TableCell>
                  <TableCell align="center">
                    {report.usuario?.nombres} {report.usuario?.apellidos}
                  </TableCell>
                  <TableCell align="center">{report.animal_nombre}</TableCell>

                  <TableCell align="center">
                    <Typography sx={{
                      backgroundColor: getEstadoColor(report.estado),
                      borderRadius: "15px",
                      padding: "5px 15px",
                      color: "white",
                      display: "inline-block",
                      width: "100px",
                      textTransform: "capitalize",
                      textAlign: "center"
                    }}>
                      {report.estado}
                    </Typography>
                  </TableCell>

                  <TableCell align="right">
                    <Button sx={styles.visibilityIcon} onClick={() => toggleReport(report.id)}>
                      <VisibilitySharpIcon sx={{ color: "white" }} />
                    </Button>
                  </TableCell>
                </TableRow>

                {/* EXPANDIDO */}
                {expandedReport === report.id && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Collapse in={true}>

                        <Box sx={styles.expandedContent}>

                          <Typography variant="h6" sx={{ mb: 2 }}>
                            Detalles del Reporte
                          </Typography>

                          <Typography><b>Descripción:</b> {report.descripcion}</Typography>

                          {report.reporte_detallado && (
                            <Typography sx={{ mt: 2, color: "#E52F60" }}>
                              <b>Motivo de rechazo:</b> {report.reporte_detallado}
                            </Typography>
                          )}

                          {report.evidencia_imagen && (
                            <img
                              src={report.evidencia_imagen}
                              alt={report.animal_nombre}
                              style={styles.image}
                            />
                          )}

                          {report.estado === "pendiente" && (
                            <Box sx={{ display: "flex", gap: "20px", mt: 2 }}>

                              <Button 
                                variant="contained"
                                sx={styles.actionButton}
                                onClick={() => approveReport(report.id)}
                              >
                                Aprobar
                              </Button>

                              <Button 
                                variant="contained" 
                                sx={{ ...styles.actionButton, backgroundColor: "#E52F60" }}
                                onClick={() => openRejectDialog(report.id)}
                              >
                                Rechazar
                              </Button>

                            </Box>
                          )}

                        </Box>

                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}

              </>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* PAGINATION */}
      <Box sx={styles.paginationBox}>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography variant="body2">Ir a la página:</Typography>

          <TextField
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            type="number"
            sx={styles.goToPageField}
          />

          <Button variant="contained" onClick={handleGoToPageClick}>
            Ir
          </Button>
        </Box>

        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }} 
        onClick={() => navigate('/moderador')}
      >
        Volver al panel
      </Button>

      {/* DIALOGO RECHAZO */}
      <Dialog open={rejectDialog.open} onClose={closeRejectDialog}>
        <DialogTitle>Motivo de Rechazo</DialogTitle>

        <DialogContent>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Seleccione un motivo</InputLabel>
            <Select
              value={rejectDialog.reason}
              label="Seleccione un motivo"
              onChange={(e) =>
                setRejectDialog({ ...rejectDialog, reason: e.target.value })
              }
            >
              {rejectionReasons.map(reason => (
                <MenuItem key={reason} value={reason}>{reason}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {rejectDialog.reason === "Otro" && (
            <TextField
              autoFocus
              margin="dense"
              label="Especifique el motivo"
              fullWidth
              variant="outlined"
              value={rejectDialog.customReason}
              onChange={(e) =>
                setRejectDialog({ ...rejectDialog, customReason: e.target.value })
              }
              sx={{ mt: 2 }}
            />
          )}

        </DialogContent>

        <DialogActions>
          <Button onClick={closeRejectDialog}>Cancelar</Button>

          <Button
            color="error"
            disabled={
              !rejectDialog.reason ||
              (rejectDialog.reason === "Otro" && !rejectDialog.customReason)
            }
            onClick={confirmReject}
          >
            Confirmar rechazo
          </Button>
        </DialogActions>

      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default Reportes;
