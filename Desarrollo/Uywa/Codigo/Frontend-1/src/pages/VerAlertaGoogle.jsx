import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Mapa from "../components/Mapa/MapaMarks";
import { 
  Box, 
  Container, 
  Button, 
  MenuItem, 
  InputLabel, 
  FormControl, 
  Select,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertaContainer, mapBotonBuscar, mapSearchAlert, mapMark } from "../components/Mapa/MapConstStyle";
import { departamentos } from "../utils/Departamentos";

const API_BASE_URL = 'http://localhost:3000';

function VerAlertaGoogle() {
  // State management
  const [markerData, setMarkerData] = useState([]);
  const [animalOptions, setAnimalOptions] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [animal, setAnimal] = useState("");
  const [region, setRegion] = useState("");
  const [fechaIni, setFechaIni] = useState(dayjs().subtract(1, 'month'));
  const [fechaFin, setFechaFin] = useState(dayjs());
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('guest');
  const [progressStatus, setProgressStatus] = useState("Cargando datos del mapa...");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handler for animal selection
  const handleAnimal = (event) => {
    setAnimal(event.target.value);
  };

  // Handler for region selection
  const handleRegion = (event) => {
    setRegion(event.target.value);
  };

  // Load animals from API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/animal/list`);
        if (!response.ok) throw new Error('Error al cargar animales');
        
        const data = await response.json();
        setAnimalOptions(data.data || []);
      } catch (error) {
        console.error('Error cargando animales:', error);
        setError('Error al cargar la lista de animales');
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimals();
  }, []);

  // Load all markers on component mount
  useEffect(() => {
    cargarMarcadores();
  }, []);

  // Transform API data to marker format
  const transformReportToMarker = (report) => {
    return {
      id: report.id,
      latitud: report.evidencia?.latitud,
      longitud: report.evidencia?.longitud,
      animal_nombre: report.animal?.nombre,
      descripcion: report.evidencia?.descipcion, // Note: API uses "descipcion"
      fecha_creacion: report.fecha_creacion,
      estado: report.estado,
      nombre_reportante: `${report.usuario?.nombres} ${report.usuario?.apellidos}`,
      evidencia_imagen: report.evidencia?.imagen_url,
      departamento: report.evidencia?.departamento?.nombre,
      departamento_id: report.evidencia?.departamento_id,
      animal_id: report.animal?.id,
      // Additional data
      animal_descripcion: report.animal?.descripcion,
      animal_habitad: report.animal?.habitad,
      animal_estado: report.animal?.estado,
    };
  };

  // Load all markers
  const cargarMarcadores = async () => {
    setLoading(true);
    setProgressStatus("Obteniendo ubicaciones de reportes...");
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/`);
      if (response.ok) {
        setProgressStatus("Procesando datos...");
        const data = await response.json();
        const transformedData = (data.data || []).map(transformReportToMarker);
        setMarkerData(transformedData);
      } else {
        setError('Error al cargar los reportes');
      }
    } catch (error) {
      console.error('Error en la operación:', error);
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  // Extracted validation function
  const validateSearchParams = () => {
    if (fechaIni > fechaFin) {
      setError('La fecha inicial no puede ser mayor a la fecha final');
      return false;
    }
    return true;
  };

  // Extracted parameter builder function
  const buildSearchParams = () => {
    const params = new URLSearchParams();
    if (fechaIni) params.append('fecha_ini', fechaIni.format('YYYY-MM-DD'));
    if (fechaFin) params.append('fecha_fin', fechaFin.format('YYYY-MM-DD'));
    if (animal) params.append('animal_id', animal);
    if (region) params.append('departamento_id', region);
    return params;
  };

  // Extracted response handler function
  const handleSearchResponse = async (response) => {
    if (!response.ok) {
      throw new Error('Error al buscar reportes');
    }

    const data = await response.json();
    const transformedData = (data.data || []).map(transformReportToMarker);
    setMarkerData(transformedData);
    
    if (transformedData.length === 0) {
      setError('No se encontraron reportes con los filtros seleccionados');
    }
  };

  // Refactored main function
  const handleSearch = async () => {
    if (!validateSearchParams()) return;

    setLoading(true);
    setProgressStatus("Buscando reportes...");

    try {
      const params = buildSearchParams();
      const response = await fetch(`${API_BASE_URL}/reportes/search?${params.toString()}`);
      await handleSearchResponse(response);
    } catch (error) {
      handleSearchError(error);
    } finally {
      setLoading(false);
    }
  };

  // Extracted error handler
  const handleSearchError = (error) => {
    console.error('Error en la operación:', error);
    
    let errorMessage = 'Error de conexión al servidor';
    
    if (error.name === 'AbortError') {
      errorMessage = 'La solicitud fue cancelada';
    } else if (error.message) {
      errorMessage = error.message;
    }

    setError(errorMessage);
  };

  // Reset all filters
  const handleReset = async () => {
    setAnimal("");
    setRegion("");
    setFechaIni(dayjs().subtract(1, 'month'));
    setFechaFin(dayjs());
    setError(null);
    await cargarMarcadores();
  };

  // Handle marker click
  const handleMarkerClick = (alert) => {
    setSelectedAlert(alert);
  };

  // Close alert dialog
  const handleCloseDialog = () => {
    setSelectedAlert(null);
  };

  // Close error snackbar
  const handleCloseError = () => {
    setError(null);
  };

  // Render alert details dialog
  const renderAlertDialog = () => {
    if (!selectedAlert) return null;

    return (
      <Dialog open={!!selectedAlert} onClose={handleCloseDialog} fullScreen={isMobile}>
        <DialogTitle>Detalles del Reporte</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedAlert.animal_nombre || 'Animal no especificado'}
          </Typography>
          
          <Box mb={2}>
            <Typography variant="subtitle2">Información básica:</Typography>
            <Typography>Fecha: {dayjs(selectedAlert.fecha_creacion).format('DD/MM/YYYY HH:mm')}</Typography>
            <Typography>Reportado por: {selectedAlert.nombre_reportante || 'Anónimo'}</Typography>
            <Typography>Estado: {selectedAlert.estado || 'No especificado'}</Typography>
            {selectedAlert.departamento && (
              <Typography>Departamento: {selectedAlert.departamento}</Typography>
            )}
          </Box>

          {selectedAlert.animal_descripcion && (
            <Box mb={2}>
              <Typography variant="subtitle2">Sobre el animal:</Typography>
              <Typography>{selectedAlert.animal_descripcion}</Typography>
              {selectedAlert.animal_habitad && (
                <Typography variant="body2">Hábitat: {selectedAlert.animal_habitad}</Typography>
              )}
              {selectedAlert.animal_estado && (
                <Typography variant="body2">Estado de conservación: {selectedAlert.animal_estado}</Typography>
              )}
            </Box>
          )}

          {selectedAlert.descripcion && (
            <Box mb={2}>
              <Typography variant="subtitle2">Descripción del reporte:</Typography>
              <Typography>{selectedAlert.descripcion}</Typography>
            </Box>
          )}

          <Box mb={2}>
            <Typography variant="subtitle2">Evidencia:</Typography>
            {selectedAlert.evidencia_imagen ? (
              <img 
                src={selectedAlert.evidencia_imagen} 
                alt="Evidencia" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/img-not-available.png';
                }}
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No hay imagen disponible
              </Typography>
            )}
          </Box>

          {userRole === 'guest' && (
            <Alert severity="info">
              Inicia sesión para ver más detalles y reportar alertas
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  // Render loading indicator
  const renderLoadingIndicator = () => (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: theme.zIndex.modal + 1
    }}>
      <CircularProgress 
        size={80} 
        thickness={4}
        sx={{ color: theme.palette.primary.main }}
      />
      <Typography variant="h6" sx={{ mt: 3, color: theme.palette.text.primary }}>
        {progressStatus}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2, color: theme.palette.text.secondary }}>
        Por favor espere mientras se cargan los datos...
      </Typography>
      <Box sx={{ 
        width: '300px',
        height: '4px',
        backgroundColor: theme.palette.grey[300],
        borderRadius: '2px',
        mt: 3,
        overflow: 'hidden'
      }}>
        <Box sx={{
          height: '100%',
          width: '60%',
          backgroundColor: theme.palette.primary.main,
          animation: 'progressAnimation 2s ease-in-out infinite',
          '@keyframes progressAnimation': {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(300px)' }
          }
        }} />
      </Box>
    </Box>
  );

  return (
    <Container maxWidth={false} sx={alertaContainer}>
      {/* Loading Indicator */}
      {loading && renderLoadingIndicator()}

      {/* Error Notification */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Map Section */}
      <Box sx={mapMark}>
        <Mapa 
          markerData={markerData}
          onMarkerClick={handleMarkerClick}
          userRole={userRole}
        />
      </Box>

      {/* Search Panel - Hidden on mobile when alert is selected */}
      {(!isMobile || !selectedAlert) && (
        <Container maxWidth={false} sx={{ 
          width: { xs: "100%", md: "30%" },
          padding: { xs: 1, md: 2 }
        }}>
          <Box sx={mapSearchAlert}>
            <Typography variant="h6" sx={{ textAlign: "left", mb: 2 }}>
              Buscar reportes
              {userRole === 'guest' && (
                <Typography variant="caption" display="block" color="textSecondary">
                  (Algunas funciones limitadas para invitados)
                </Typography>
              )}
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoItem sx={{ marginBottom: 2 }}>
                <DatePicker
                  label="Fecha inicial"
                  value={fechaIni}
                  onChange={(newValue) => setFechaIni(newValue)}
                  format="DD/MM/YYYY"
                  maxDate={fechaFin}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={loading}
                />
              </DemoItem>
              <DemoItem sx={{ marginBottom: 2 }}>
                <DatePicker
                  label="Fecha final"
                  value={fechaFin}
                  onChange={(newValue) => setFechaFin(newValue)}
                  format="DD/MM/YYYY"
                  minDate={fechaIni}
                  slotProps={{ textField: { fullWidth: true } }}
                  disabled={loading}
                />
              </DemoItem>
            </LocalizationProvider>

            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel id="animal-select-label">Animal</InputLabel>
              {loadingAnimals ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Select
                  labelId="animal-select-label"
                  id="animal-select"
                  value={animal}
                  label="Animal"
                  onChange={handleAnimal}
                  disabled={loading}
                >
                  <MenuItem value="">
                    <em>Todos los animales</em>
                  </MenuItem>
                  {animalOptions.map((animal) => (
                    <MenuItem key={animal.id} value={animal.id}>
                      {animal.nombre}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>

            <FormControl fullWidth sx={{ marginBottom: 3 }}>
              <InputLabel id="region-select-label">Región</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={region}
                label="Región"
                onChange={handleRegion}
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Todas las regiones</em>
                </MenuItem>
                {departamentos.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.nombre}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleSearch}
                sx={mapBotonBuscar}
                disabled={loading}
              >
                Buscar
              </Button>
              <Button 
                variant="outlined" 
                onClick={handleReset}
                sx={mapBotonBuscar}
                disabled={loading}
              >
                Reiniciar
              </Button>
            </Box>
          </Box>
        </Container>
      )}

      {/* Alert Details Dialog */}
      {renderAlertDialog()}
    </Container>
  );
}

export default VerAlertaGoogle;