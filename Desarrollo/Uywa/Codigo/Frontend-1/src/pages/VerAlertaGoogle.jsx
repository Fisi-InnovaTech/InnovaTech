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

// Animal Options
const ANIMAL_OPTIONS = [
  { id: 'animal-1', value: "Anaconda", animal: "Anaconda" },
  { id: 'animal-2', value: "Boa", animal: "Boa" },
  { id: 'animal-3', value: "Cotorra", animal: "Cotorra" },
  { id: 'animal-4', value: "Escarabajo", animal: "Escarabajo" },
  { id: 'animal-5', value: "Escarabajo arlequín", animal: "Escarabajo arlequín" },
  { id: 'animal-6', value: "Gallinazo de cabeza negra", animal: "Gallinazo de cabeza negra" },
  { id: 'animal-7', value: "Garza huaco", animal: "Garza huaco" },
  { id: 'animal-8', value: "Gavilán acanelado", animal: "Gavilán acanelado" },
  { id: 'animal-9', value: "Golondrina de mar acollarada", animal: "Golondrina de mar acollarada" },
  { id: 'animal-10', value: "Golondrina de mar de Markham", animal: "Golondrina de mar de Markham" },
  { id: 'animal-11', value: "Guanay", animal: "Guanay" },
  { id: 'animal-12', value: "Lagartija", animal: "Lagartija" },
  { id: 'animal-13', value: "Lobo marino chusco", animal: "Lobo marino chusco" },
  { id: 'animal-14', value: "Mantona", animal: "Mantona" },
  { id: 'animal-15', value: "Mono machín negro", animal: "Mono machín negro" },
  { id: 'animal-16', value: "Pihuicho ala amarilla", animal: "Pihuicho ala amarilla" },
  { id: 'animal-17', value: "Rana acuática", animal: "Rana acuática" },
  { id: 'animal-18', value: "Rana del Titicaca", animal: "Rana del Titicaca" },
  { id: 'animal-19', value: "Sapo", animal: "Sapo" },
  { id: 'animal-20', value: "Sapo marino", animal: "Sapo marino" },
  { id: 'animal-21', value: "Taricaya", animal: "Taricaya" },
  { id: 'animal-22', value: "Tortuga motelo", animal: "Tortuga motelo" },
  { id: 'animal-23', value: "Venado cola blanca", animal: "Venado cola blanca" },
  { id: 'animal-24', value: "Zorro costeño", animal: "Zorro costeño" }
];

// Department Options
const DEPARTMENT_OPTIONS = [
  { id: 'dept-1', value: "Amazonas", departamento: "Amazonas" },
  { id: 'dept-2', value: "Ancash", departamento: "Ancash" },
  { id: 'dept-3', value: "Apurímac", departamento: "Apurímac" },
  { id: 'dept-4', value: "Arequipa", departamento: "Arequipa" },
  { id: 'dept-5', value: "Ayacucho", departamento: "Ayacucho" },
  { id: 'dept-6', value: "Cajamarca", departamento: "Cajamarca" },
  { id: 'dept-7', value: "Callao", departamento: "Callao" },
  { id: 'dept-8', value: "Cusco", departamento: "Cusco" },
  { id: 'dept-9', value: "Huancavelica", departamento: "Huancavelica" },
  { id: 'dept-10', value: "Huanuco", departamento: "Huanuco" },
  { id: 'dept-11', value: "Ica", departamento: "Ica" },
  { id: 'dept-12', value: "Junín", departamento: "Junín" },
  { id: 'dept-13', value: "La Libertad", departamento: "La Libertad" },
  { id: 'dept-14', value: "Lambayeque", departamento: "Lambayeque" },
  { id: 'dept-15', value: "Lima", departamento: "Lima" },
  { id: 'dept-16', value: "Loreto", departamento: "Loreto" },
  { id: 'dept-17', value: "Madre de Dios", departamento: "Madre de Dios" },
  { id: 'dept-18', value: "Moquegua", departamento: "Moquegua" },
  { id: 'dept-19', value: "Pasco", departamento: "Pasco" },
  { id: 'dept-20', value: "Piura", departamento: "Piura" },
  { id: 'dept-21', value: "Puno", departamento: "Puno" },
  { id: 'dept-22', value: "San Martín", departamento: "San Martín" },
  { id: 'dept-23', value: "Tacna", departamento: "Tacna" },
  { id: 'dept-24', value: "Tumbes", departamento: "Tumbes" },
  { id: 'dept-25', value: "Ucayali", departamento: "Ucayali" }
];

const API_BASE_URL = 'https://innovatech-ztzv.onrender.com';

function VerAlertaGoogle() {
  // State management
  const [markerData, setMarkerData] = useState([
    
  ]);
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

  // Check authentication status
  useEffect(() => {
    //cargarMarcadores();
  }, []);

  // Load all markers
/*   const cargarMarcadores = async () => {
    setLoading(true);
    setProgressStatus("Obteniendo ubicaciones de alertas...");
    try {
      const response = await fetch(`${API_BASE_URL}/alertas/allmap`);
      if (response.ok) {
        setProgressStatus("Procesando datos...");
        const data = await response.json();
        setMarkerData(data);
      } else {
        setError('Error al cargar los marcadores');
      }
    } catch (error) {
      console.error('Error en la operación:', error);
      
      let errorMessage = 'Error de conexión al servidor';
      
      if (error.name === 'AbortError') {
        errorMessage = 'La solicitud fue cancelada';
      } else if (error.response) {
        errorMessage = `Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Sin detalles'}`;
      } else if (error.request) {
        errorMessage = 'El servidor no respondió. Verifica tu conexión a internet';
      } else if (error instanceof TypeError) {
        errorMessage = 'Error de tipo en la aplicación';
      } else if (error instanceof SyntaxError) {
        errorMessage = 'Error en el formato de los datos';
      } else if (error.message) {
        errorMessage = error.message;
      }
    
      setError(errorMessage);
      setOpenSnackbar(true);
      
      if (process.env.NODE_ENV === 'production') {
        logErrorToService(error);
      }
    } finally {
      setIsSubmitting(false);
      setIsButtonDisabled(false);
    }
  }; */

  // Handle search with filters
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
  if (animal) params.append('animal', animal);
  if (region) params.append('region', region);
  return params;
};

// Extracted response handler function
const handleSearchResponse = async (response) => {
  if (!response.ok) {
    throw new Error('Error al buscar alertas');
  }

  const data = await response.json();
  setMarkerData(data);
  
  if (data.length === 0) {
    setError('No se encontraron alertas con los filtros seleccionados');
  }
};

// Refactored main function
const handleSearch = async () => {
  if (!validateSearchParams()) return;

  setLoading(true);
  setProgressStatus("Buscando alertas...");

  try {
    const params = buildSearchParams();
    const response = await fetch(`${API_BASE_URL}/alertas/search?${params.toString()}`);
    await handleSearchResponse(response);
  } catch (error) {
    handleSearchError(error);
  } finally {
    setLoading(false);
  }
};

// Extracted error handler (reusable for other API calls)
const handleSearchError = (error) => {
  console.error('Error en la operación:', error);
  
  let errorMessage = 'Error de conexión al servidor';
  
  if (error.name === 'AbortError') {
    errorMessage = 'La solicitud fue cancelada';
  } else if (error.response) {
    errorMessage = `Error del servidor: ${error.response.status} - ${error.response.data?.message || 'Sin detalles'}`;
  } else if (error.request) {
    errorMessage = 'El servidor no respondió. Verifica tu conexión a internet';
  } else if (error.message) {
    errorMessage = error.message;
  }

  setError(errorMessage);
  setOpenSnackbar(true);
  
  if (process.env.NODE_ENV === 'production') {
    logErrorToService(error);
  }
};

  // Reset all filters
  const handleReset = async () => {
    setAnimal("");
    setRegion("");
    setFechaIni(dayjs().subtract(1, 'month'));
    setFechaFin(dayjs());
    setError(null);
    //await cargarMarcadores();
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
        <DialogTitle>Detalles de la Alerta</DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            {selectedAlert.animal_nombre || 'Animal no especificado'}
          </Typography>
          
          <Box mb={2}>
            <Typography variant="subtitle2">Información básica:</Typography>
            <Typography>Fecha: {dayjs(selectedAlert.fecha_creacion).format('DD/MM/YYYY HH:mm')}</Typography>
            <Typography>Región: {selectedAlert.region || 'No especificada'}</Typography>
            <Typography>Estado: {selectedAlert.estado || 'No especificado'}</Typography>
            {userRole === 'user' && (
              <Typography>Reportado por: {selectedAlert.nombre_reportante || 'Anónimo'}</Typography>
            )}
          </Box>

          {selectedAlert.descripcion && (
            <Box mb={2}>
              <Typography variant="subtitle2">Descripción:</Typography>
              <Typography>{selectedAlert.descripcion}</Typography>
            </Box>
          )}

          <Box mb={2}>
            <Typography variant="subtitle2">Evidencia:</Typography>
            {selectedAlert.evidencia_imagen ? (
              <img 
                src={`${API_BASE_URL}/uploads/${selectedAlert.evidencia_imagen}`} 
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
          markerData={[
  {
    id: 1,
    latitud: -12.0464,
    longitud: -77.0428,
    animal_nombre: "Anaconda",
    descripcion: "Avistamiento cerca del río Amazonas, ejemplar adulto de aproximadamente 5 metros",
    evidencia_imagen: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=150&fit=crop"
  },
  {
    id: 2,
    latitud: -12.0564,
    longitud: -77.0328,
    animal_nombre: "Taricaya",
    descripcion: "Nido de taricayas encontrado en playa del río Madre de Dios",
    evidencia_imagen: "https://images.unsplash.com/photo-1558098329-a11cff621064?w=200&h=150&fit=crop"
  },
  {
    id: 3,
    latitud: -12.0364,
    longitud: -77.0528,
    animal_nombre: "Cotorra",
    descripcion: "Grupo de cotorras en zona urbana, comportamiento normal",
    evidencia_imagen: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&h=150&fit=crop"
  },
  {
    id: 4,
    latitud: -12.0664,
    longitud: -77.0228,
    animal_nombre: "Consenegro",
    descripcion: "Avistamiento en zona boscosa, ejemplar adulto en mal estado",
    evidencia_imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZGeajOiuB1wZ0aEQNWujutiHF9c1sN5fU7g&s"
  },
  {
    id: 5,
    latitud: -12.0264,
    longitud: -77.0628,
    animal_nombre: "Mono machín negro",
    descripcion: "Grupo familiar de monos en zona de conservación",
    evidencia_imagen: "https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=200&h=150&fit=crop"
  }
]} 
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
              Buscar alertas
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
                {ANIMAL_OPTIONS.map((animal) => (
                  <MenuItem key={animal.id} value={animal.value}>
                    {animal.animal}
                  </MenuItem>
                ))}
              </Select>
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
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <MenuItem key={dept.id} value={dept.value}>
                    {dept.departamento}
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