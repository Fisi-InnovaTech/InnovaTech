import { useState, useEffect } from "react";
import dayjs from "dayjs";
import Mapa from "../../components/Mapa/MapaMarks";
import { 
  Box, 
  Container, 
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  TextField,
  Autocomplete
} from '@mui/material';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertaContainer, mapBotonBuscar, mapSearchAlert, mapMark } from "../Mapa/MapConstStyle";
import { departamentos } from '../../utils/Departamentos.js'

const API_BASE_URL = 'https://backend-uywa.onrender.com';

function VerAlertaGoogle() {
  // State management
  const [markerData, setMarkerData] = useState([]);
  const [animalOptions, setAnimalOptions] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [animal, setAnimal] = useState(null);
  const [region, setRegion] = useState(null);
  const [fechaIni, setFechaIni] = useState(dayjs().subtract(1, 'month'));
  const [fechaFin, setFechaFin] = useState(dayjs());
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('guest');
  const [progressStatus, setProgressStatus] = useState("Cargando datos del mapa...");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Handler for animal selection with Autocomplete
  const handleAnimalChange = (event, newValue) => {
    setAnimal(newValue);
  };

  // Handler for region selection with Autocomplete
  const handleRegionChange = (event, newValue) => {
    setRegion(newValue);
  };

  // Load animals from API
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/animal/list`);
        if (!response.ok) {
          throw new Error(`Error al cargar animales: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Animales cargados:", data.data);
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
    console.log("Transformando reporte:", report);
    return {
      id: report.id,
      latitud: report.evidencia?.latitud,
      longitud: report.evidencia?.longitud,
      animal_nombre: report.animal?.nombre,
      descripcion: report.evidencia?.descipcion,
      fecha_creacion: report.fecha_creacion,
      estado: report.estado,
      nombre_reportante: `${report.usuario?.nombres || ''} ${report.usuario?.apellidos || ''}`.trim() || 'Anónimo',
      evidencia_imagen: report.evidencia?.imagen_url,
      departamento: report.evidencia?.departamento?.nombre,
      departamento_id: report.evidencia?.departamento_id,
      animal_id: report.animal?.id,
      // Additional data
      animal_descripcion: report.animal?.descripcion,
      animal_habitad: report.animal?.habitad,
      animal_estado: report.animal?.estado,
      usuario_email: report.usuario?.email,
    };
  };

  // Load all markers
  const cargarMarcadores = async () => {
    setLoading(true);
    setProgressStatus("Obteniendo ubicaciones de reportes...");
    try {
      const response = await fetch(`${API_BASE_URL}/reportes/`);
      console.log("Cargando marcadores, respuesta:", response.status);
      
      if (response.ok) {
        setProgressStatus("Procesando datos...");
        const data = await response.json();
        console.log("Datos recibidos de reportes:", data);
        const transformedData = (data.data || []).map(transformReportToMarker);
        console.log("Marcadores transformados:", transformedData);
        setMarkerData(transformedData);
      } else {
        const errorText = await response.text();
        console.error('Error al cargar reportes:', errorText);
        setError(`Error al cargar los reportes: ${response.status}`);
      }
    } catch (error) {
      console.error('Error en la operación:', error);
      setError('Error de conexión al servidor. Verifique que la API esté corriendo.');
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
    
    // Fechas - siempre se envían con formato YYYY-MM-DD
    params.append('fecha_ini', fechaIni.format('YYYY-MM-DD'));
    params.append('fecha_fin', fechaFin.format('YYYY-MM-DD'));
    
    // Animal - solo si se seleccionó
    if (animal && animal.id) {
      params.append('animal_id', animal.id);
    }
    
    // Región - solo si se seleccionó
    if (region && region.id) {
      params.append('departamento_id', region.id);
    }
    
    console.log("Parámetros de búsqueda:", params.toString());
    return params;
  };

  // Extracted response handler function
  const handleSearchResponse = async (response) => {
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error en respuesta:', errorText);
      throw new Error(`Error al buscar reportes: ${response.status}`);
    }

    const data = await response.json();
    console.log("Respuesta de búsqueda:", data);
    const transformedData = (data.data || []).map(transformReportToMarker);
    setMarkerData(transformedData);
    
    if (transformedData.length === 0) {
      setError('No se encontraron reportes con los filtros seleccionados');
    } else {
      // Limpiar error si se encontraron resultados
      setError(null);
    }
  };

  // Refactored main function
  const handleSearch = async () => {
    console.log("=== INICIANDO BÚSQUEDA ===");
    console.log("Filtros actuales:", { animal, region, fechaIni: fechaIni.format(), fechaFin: fechaFin.format() });
    
    if (!validateSearchParams()) return;

    setLoading(true);
    setProgressStatus("Buscando reportes...");

    try {
      const params = buildSearchParams();
      const url = `${API_BASE_URL}/reportes/search?${params.toString()}`;
      console.log("URL de búsqueda:", url);
      
      const response = await fetch(url);
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
    setAnimal(null);
    setRegion(null);
    setFechaIni(dayjs().subtract(1, 'month'));
    setFechaFin(dayjs());
    setError(null);
    await cargarMarcadores();
  };

  // Handle marker click
  const handleMarkerClick = (alert) => {
    console.log("Marcador clickeado:", alert);
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
            {selectedAlert.usuario_email && (
              <Typography variant="caption" display="block" color="textSecondary">
                Email: {selectedAlert.usuario_email}
              </Typography>
            )}
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
              <Box sx={{ textAlign: 'center' }}>
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
                <Typography variant="caption" color="textSecondary">
                  {selectedAlert.evidencia_imagen}
                </Typography>
              </Box>
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

  // Helper function to format date for display
  const formatDateDisplay = (date) => {
    return dayjs(date).format('DD/MM/YYYY');
  };

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

            {/* Search Dropdown for Animals */}
            <Box sx={{ marginBottom: 2 }}>
              {loadingAnimals ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Autocomplete
                  id="animal-search-dropdown"
                  options={animalOptions}
                  getOptionLabel={(option) => option?.nombre || ""}
                  value={animal}
                  onChange={handleAnimalChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Buscar animal"
                      placeholder="Escribe para buscar..."
                      variant="outlined"
                      fullWidth
                      disabled={loading}
                    />
                  )}
                  noOptionsText="No se encontraron animales"
                  loadingText="Cargando animales..."
                  clearText="Limpiar"
                  openText="Abrir"
                  closeText="Cerrar"
                  isOptionEqualToValue={(option, value) => {
                    if (!option || !value) return false;
                    return option.id === value.id;
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option.id}>
                      <Box>
                        <Typography variant="body1">{option.nombre}</Typography>
                        {option.descripcion && (
                          <Typography variant="caption" color="textSecondary">
                            {option.descripcion.substring(0, 80)}...
                          </Typography>
                        )}
                      </Box>
                    </li>
                  )}
                  sx={{ width: '100%' }}
                />
              )}
            </Box>

            {/* Search Dropdown for Regions/Departments */}
            <Box sx={{ marginBottom: 3 }}>
              <Autocomplete
                id="region-search-dropdown"
                options={departamentos}
                getOptionLabel={(option) => option?.nombre || ""}
                value={region}
                onChange={handleRegionChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar región/departamento"
                    placeholder="Escribe para buscar..."
                    variant="outlined"
                    fullWidth
                    disabled={loading}
                  />
                )}
                noOptionsText="No se encontraron regiones"
                clearText="Limpiar"
                openText="Abrir"
                closeText="Cerrar"
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option.id === value.id;
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    <Box>
                      <Typography variant="body1">{option.nombre}</Typography>
                      {option.descripcion && (
                        <Typography variant="caption" color="textSecondary">
                          {option.descripcion}
                        </Typography>
                      )}
                    </Box>
                  </li>
                )}
                sx={{ width: '100%' }}
              />
            </Box>

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

            {/* Debug Information */}
            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1, display: 'none' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Debug Info:
              </Typography>
              <Typography variant="caption" display="block">
                Animal seleccionado: {JSON.stringify(animal)}
              </Typography>
              <Typography variant="caption" display="block">
                Región seleccionada: {JSON.stringify(region)}
              </Typography>
              <Typography variant="caption" display="block">
                Fechas: {fechaIni.format('YYYY-MM-DD')} a {fechaFin.format('YYYY-MM-DD')}
              </Typography>
              <Typography variant="caption" display="block">
                Total marcadores: {markerData.length}
              </Typography>
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