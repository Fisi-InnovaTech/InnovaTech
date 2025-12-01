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
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PetsIcon from '@mui/icons-material/Pets';
import PersonIcon from '@mui/icons-material/Person';

// URL base de la API
const API_BASE_URL = "https://backend-uywa.onrender.com";
const REPORTS_URL = `${API_BASE_URL}/reportes`;
const USER_REPORTS_URL = `${API_BASE_URL}/reportes/usuario`;

// Estados posibles de un reporte (basado en tu API)
const reportStatuses = [
  { id: "pendiente", label: "Pendiente", color: "warning" },
  { id: "en_revision", label: "En Revisión", color: "info" },
  { id: "resuelto", label: "Resuelto", color: "success" },
  { id: "rechazado", label: "Rechazado", color: "error" }
];

// Función para obtener el ID del usuario autenticado
const getAuthenticatedUserId = async () => {
  try {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) throw new Error('No hay sesión activa');
    
    const parsed = JSON.parse(authStorage);
    const token = parsed?.state?.token;
    
    if (!token) throw new Error('Token no disponible');
    
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token inválido');
    }
    
    const data = await response.json();
    if (data.valid && data.user?.id) {
      return data.user.id;
    } else {
      throw new Error('Usuario no válido');
    }
  } catch (error) {
    console.error('Error obteniendo ID de usuario:', error);
    throw error;
  }
};

const ReportesUsuario = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);
  
  // Estados para modales
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [processing, setProcessing] = useState(false);
  
  // Estado para formulario de edición (solo descripción)
  const [editForm, setEditForm] = useState({
    descripcion: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();
  const reportsPerPage = 5;

  // ========================= FETCH REPORTS =========================
  const fetchUserReports = async () => {
    try {
      setLoading(true);
      const userId = await getAuthenticatedUserId();
      
      const res = await fetch(`${USER_REPORTS_URL}/${userId}`);
      if (!res.ok) throw new Error("Error al obtener los reportes");

      const json = await res.json();
      const data = json.data || [];

      setReports(data);
      setFilteredReports(data);

    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserReports();
  }, []);

  // ========================= SNACKBAR =========================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ========================= ELIMINAR REPORTE =========================
  const handleOpenDeleteDialog = (report) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedReport(null);
  };

  const deleteReport = async () => {
    if (!selectedReport) return;
    
    try {
      setProcessing(true);
      const res = await fetch(`${REPORTS_URL}/${selectedReport.id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al eliminar el reporte: ${res.status} ${response.statusText}`);
      }

      showSnackbar("Reporte eliminado correctamente", "success");
      
      // Actualizar la lista
      await fetchUserReports();
      
      // Cerrar el diálogo
      handleCloseDeleteDialog();

    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  // ========================= EDITAR REPORTE =========================
  const handleOpenEditDialog = (report) => {
    setSelectedReport(report);
    setEditForm({
      descripcion: report.evidencia?.descripcion || ""
    });
    
    if (report.evidencia?.imagen_url) {
      setImagePreview(report.evidencia.imagen_url);
    }
    
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedReport(null);
    setEditForm({
      descripcion: ""
    });
    setImageFile(null);
    setImagePreview(null);
  };

  // Manejo de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateReport = async () => {
    if (!selectedReport) return;
    
    try {
      setProcessing(true);
      
      // Validaciones básicas
      if (!editForm.descripcion.trim()) {
        showSnackbar("La descripción es requerida", "warning");
        return;
      }

      // Crear FormData para enviar datos
      const formData = new FormData();
      formData.append("descripcion", editForm.descripcion);
      
      // Solo agregar imagen si se seleccionó una nueva
      if (imageFile) {
        formData.append("imagen_url", imageFile);
      }

      const res = await fetch(`${REPORTS_URL}/${selectedReport.id}`, {
        method: "PATCH",
        body: formData
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al actualizar el reporte: ${res.status} ${res.statusText}`);
      }

      showSnackbar("Reporte actualizado correctamente", "success");
      
      // Actualizar la lista
      await fetchUserReports();
      
      // Cerrar el diálogo
      handleCloseEditDialog();

    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setProcessing(false);
    }
  };

  // ========================= VER DETALLES =========================
  const handleOpenViewDialog = (report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedReport(null);
  };

  // ========================= BUSQUEDA =========================
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = reports.filter(report =>
      report.animal?.nombre?.toLowerCase().includes(term) ||
      report.evidencia?.descripcion?.toLowerCase().includes(term) ||
      (report.evidencia?.departamento?.nombre?.toLowerCase().includes(term))
    );

    setFilteredReports(filtered);
    setCurrentPage(1);
  }, [searchTerm, reports]);

  // ========================= PAGINACIÓN =========================
  const pageCount = Math.ceil(filteredReports.length / reportsPerPage);
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * reportsPerPage, 
    currentPage * reportsPerPage
  );

  const handleGoToPageClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
    } else {
      showSnackbar("Número de página inválido", "error");
    }
  };

  // ========================= FUNCIONES AUXILIARES =========================
  const getStatusInfo = (status) => {
    const statusObj = reportStatuses.find(s => s.id === status);
    return statusObj || { label: status || "Desconocido", color: "default" };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ========================= ESTILOS =========================
  const styles = {
    container: { 
      py: 4, 
      mt: 8,
      minHeight: '100vh' 
    },
    searchBox: { 
      display: 'flex', 
      gap: 2, 
      mb: 3 
    },
    searchField: { 
      flex: 1 
    },
    paginationBox: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      mt: 3, 
      p: 2 
    },
    goToPageField: { 
      width: '80px' 
    },
    dialogContent: {
      minWidth: '400px',
      maxWidth: '800px'
    },
    textArea: {
      width: '100%',
      minHeight: '150px',
      padding: '12px',
      fontSize: '14px',
      fontFamily: 'inherit',
      border: '1px solid #ccc',
      borderRadius: '8px',
      resize: 'vertical',
      '&:focus': {
        outline: 'none',
        borderColor: '#3AB795',
        boxShadow: '0 0 0 2px rgba(58, 183, 149, 0.2)'
      }
    },
    reportCard: {
      mb: 2,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)'
      }
    },
    statusBadge: {
      position: 'absolute',
      top: 10,
      right: 10,
      zIndex: 1
    },
    actionButtons: {
      display: 'flex',
      gap: 1
    }
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>

      {/* ========================= TÍTULO ========================= */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Reportes de Avistamiento
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Aquí puedes ver, editar y eliminar tus reportes de avistamiento de animales
        </Typography>
      </Box>

      {/* ========================= BUSCADOR ========================= */}
      <Box sx={styles.searchBox}>
        <TextField
          label="Buscar reportes"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.searchField}
          placeholder="Buscar por animal, descripción o ubicación"
          fullWidth
        />
        <Button 
          variant="contained"
          startIcon={<SearchIcon />}
        >
          Buscar
        </Button>
      </Box>

      {/* ========================= LISTA DE REPORTES ========================= */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : paginatedReports.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchTerm ? "No se encontraron reportes que coincidan con la búsqueda" : "No tienes reportes registrados"}
          </Typography>
        </Paper>
      ) : (
        <>
          {paginatedReports.map(report => (
            <Card key={report.id} sx={styles.reportCard}>
              <Box sx={{ position: 'relative' }}>
                {report.evidencia?.imagen_url && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={report.evidencia.imagen_url}
                    alt={report.animal?.nombre}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                <Box sx={styles.statusBadge}>
                  <Chip 
                    label={getStatusInfo(report.estado).label}
                    color={getStatusInfo(report.estado).color}
                    size="small"
                  />
                </Box>
              </Box>
              
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={7}>
                    <Typography variant="h6" gutterBottom>
                      <PetsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      {report.animal?.nombre || "Animal no especificado"}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {report.evidencia?.descripcion || "Sin descripción"}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                      {report.evidencia?.departamento?.nombre && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <LocationOnIcon fontSize="small" sx={{ mr: 0.5, color: '#666' }} />
                          <Typography variant="body2">
                            {report.evidencia.departamento.nombre}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5, color: '#666' }} />
                        <Typography variant="body2">
                          {formatDate(report.fecha_creacion)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon fontSize="small" sx={{ mr: 0.5, color: '#666' }} />
                        <Typography variant="body2">
                          {report.usuario?.nombres} {report.usuario?.apellidos}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={5} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Box sx={styles.actionButtons}>
                      <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleOpenViewDialog(report)}
                        size="small"
                      >
                        Ver
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<EditIcon />}
                        onClick={() => handleOpenEditDialog(report)}
                        size="small"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleOpenDeleteDialog(report)}
                        size="small"
                      >
                        Eliminar
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      {/* ========================= PAGINACIÓN ========================= */}
      {filteredReports.length > 0 && (
        <Box sx={styles.paginationBox}>
          
          <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Typography variant="body2">Ir a la página:</Typography>

            <TextField
              value={goToPage}
              onChange={(e) => setGoToPage(e.target.value)}
              type="number"
              sx={styles.goToPageField}
              size="small"
            />

            <Button variant="contained" onClick={handleGoToPageClick} size="small">
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
      )}

      {/* ========================= BOTÓN VOLVER ========================= */}
      <Button 
        variant="outlined" 
        sx={{ mt: 3 }} 
        onClick={() => navigate(-1)}
      >
        Volver
      </Button>

      {/* ========================= MODAL VER DETALLES ========================= */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Detalles del Reporte #{selectedReport?.id}
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          {selectedReport && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                {selectedReport.evidencia?.imagen_url ? (
                  <CardMedia
                    component="img"
                    image={selectedReport.evidencia.imagen_url}
                    alt={selectedReport.animal?.nombre}
                    sx={{ borderRadius: 2, width: '100%', height: 'auto' }}
                  />
                ) : (
                  <Paper sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Sin imagen</Typography>
                  </Paper>
                )}
                
                <Box sx={{ mt: 2 }}>
                  <Chip 
                    label={getStatusInfo(selectedReport.estado).label}
                    color={getStatusInfo(selectedReport.estado).color}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    ID: {selectedReport.id}
                  </Typography>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Información del Animal
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Animal:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedReport.animal?.nombre || "No especificado"}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Descripción del animal:</Typography>
                  <Typography variant="body1">
                    {selectedReport.animal?.descripcion || "Sin descripción"}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Estado de conservación:</Typography>
                  <Typography variant="body1">
                    {selectedReport.animal?.estado || "No especificado"}
                  </Typography>
                </Box>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Información del Avistamiento
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Descripción:</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {selectedReport.evidencia?.descripcion || "Sin descripción"}
                  </Typography>
                </Box>
                
                {selectedReport.evidencia?.departamento?.nombre && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Ubicación:</Typography>
                    <Typography variant="body1">
                      {selectedReport.evidencia.departamento.nombre}
                    </Typography>
                  </Box>
                )}
                
                {selectedReport.evidencia?.latitud && selectedReport.evidencia?.longitud && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Coordenadas:</Typography>
                    <Typography variant="body2">
                      Lat: {selectedReport.evidencia.latitud}, Long: {selectedReport.evidencia.longitud}
                    </Typography>
                  </Box>
                )}
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Información del Reportante
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Reportado por:</Typography>
                  <Typography variant="body1">
                    {selectedReport.usuario?.nombres} {selectedReport.usuario?.apellidos}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Correo:</Typography>
                  <Typography variant="body1">
                    {selectedReport.usuario?.email}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Fecha de reporte:</Typography>
                  <Typography variant="body1">
                    {formatDate(selectedReport.fecha_creacion)}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================= MODAL EDITAR ========================= */}
      <Dialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Editar Reporte #{selectedReport?.id}
        </DialogTitle>
        <DialogContent sx={styles.dialogContent}>
          {selectedReport && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
              <Box>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Animal: {selectedReport.animal?.nombre}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Solo puedes editar la descripción y la imagen del reporte
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Descripción del avistamiento *
                </Typography>
                <TextField
                  value={editForm.descripcion}
                  onChange={(e) => setEditForm({...editForm, descripcion: e.target.value})}
                  multiline
                  rows={6}
                  fullWidth
                  placeholder="Describe el avistamiento..."
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                      '&:hover fieldset': {
                        borderColor: '#3AB795',
                      },
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Cambiar imagen de evidencia (opcional)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Subir Nueva Foto
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Button>
                
                {imagePreview ? (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <img
                      src={imagePreview}
                      alt="Nueva imagen"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '200px', 
                        borderRadius: '8px',
                        border: '2px solid #3AB795'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                      Nueva imagen (reemplazará la actual)
                    </Typography>
                  </Box>
                ) : selectedReport.evidencia?.imagen_url && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                      Imagen actual:
                    </Typography>
                    <img
                      src={selectedReport.evidencia.imagen_url}
                      alt="Imagen actual"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '150px', 
                        borderRadius: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseEditDialog} 
            disabled={processing}
            color="inherit"
            sx={{ fontWeight: 'normal' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={updateReport} 
            disabled={processing || !editForm.descripcion.trim()}
            variant="contained"
            color="primary"
            sx={{ 
              backgroundColor: '#3AB795',
              '&:hover': {
                backgroundColor: '#2E9C7D'
              }
            }}
          >
            {processing ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================= MODAL ELIMINAR ========================= */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el reporte del animal <strong>"{selectedReport?.animal?.nombre}"</strong>?
            <br />
            <br />
            Esta acción eliminará toda la información del avistamiento incluyendo la evidencia fotográfica.
            <br />
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={processing}
            color="primary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={deleteReport} 
            disabled={processing}
            color="error"
            variant="contained"
            autoFocus
          >
            {processing ? "Eliminando..." : "Eliminar Reporte"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================= SNACKBAR ========================= */}
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

export default ReportesUsuario;