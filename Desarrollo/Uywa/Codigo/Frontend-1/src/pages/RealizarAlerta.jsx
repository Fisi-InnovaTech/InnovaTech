import { useState, useEffect } from 'react';
import { 
  Box,
  TextField,
  MenuItem,
  FormControl,
  Select,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Paper,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  CircularProgress,
  Container, 
  Snackbar, 
  Typography,
  styled 
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import Mapa from '../components/Mapa/MapaVisualizar';
import { useAuthStore } from '../auth/store/authStore';

// CONSTANTES
const MAX_FILE_SIZE_MB = 5;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_DESCRIPTION_LENGTH = 30;
const VALID_FILE_TYPES = ['image/jpeg', 'image/png'];
const API_BASE_URL = "http://localhost:3000";

// Usuario anónimo
const ANONYMOUS_USER = {
  id: 19,
  email: "anonimo@anonimo.com",
  nombres: "anonimo",
  apellidos: "anonimo",
  rol: "user",
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiYW5vbmltb0Bhbm9uaW1vLmNvbSIsInJvbCI6InVzZXIiLCJpYXQiOjE3NjM5OTQzMDAsImV4cCI6MTc2NDA4MDcwMH0.7Gcclr3q0tt88aX1Gwas_EBcIPrntLM5DUcbaJnVPH0"
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function AlertForm() {
  const { user, isAuthenticated } = useAuthStore();

  // ESTADOS
  const [animalOptions, setAnimalOptions] = useState([]);
  const [loadingAnimals, setLoadingAnimals] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [finishAlert, setFinishAlert] = useState(false);
  const [tosendFile, setTosendFile] = useState(null);
  const [description, setDescription] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [errors, setErrors] = useState({
    animal: false,
    description: false,
    location: false,
    file: false,
    auth: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // CARGAR LISTA DE ANIMALES
  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/animal/list`);
        if (!response.ok) throw new Error('Error al cargar animales');
        
        const data = await response.json();
        setAnimalOptions(data.data || []);
      } catch (error) {
        console.error('Error cargando animales:', error);
        setAlertMessage('Error al cargar la lista de animales');
        setOpenSnackbar(true);
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimals();
  }, []);

  // VALIDAR FORMULARIO
  const validateForm = () => {
    const newErrors = {
      animal: !selectedAnimal,
      description: description.length < MIN_DESCRIPTION_LENGTH,
      location: !latitud || !longitud,
      file: !tosendFile,
      auth: !isAnonymous && !isAuthenticated(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(e => e);
  };

  // MANEJO DE IMAGEN
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
      setAlertMessage("Formato inválido. Solo JPG y PNG.");
      setOpenSnackbar(true);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setAlertMessage(`Máximo permitido: ${MAX_FILE_SIZE_MB}MB`);
      setOpenSnackbar(true);
      return;
    }

    setFile(URL.createObjectURL(selectedFile));
    setTosendFile(selectedFile);
    setErrors({ ...errors, file: false });
  };

  // DESCRIPCIÓN
  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(e.target.value);
      setErrors({
        ...errors,
        description: e.target.value.length < MIN_DESCRIPTION_LENGTH
      });
    }
  };

  // MANEJAR CAMBIO DE ANÓNIMO
  const handleAnonymousChange = (e) => {
    const checked = e.target.checked;
    setIsAnonymous(checked);
    if (checked) {
      setErrors(prev => ({ ...prev, auth: false }));
    }
  };

  // ENVIAR FORMULARIO
  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage("Complete todos los campos obligatorios");
      setOpenSnackbar(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Determinar qué usuario usar
      const reportUser = isAnonymous ? ANONYMOUS_USER : user;

      const formData = new FormData();
      formData.append("descripcion", description);
      formData.append("latitud", latitud.toString());
      formData.append("longitud", longitud.toString());
      formData.append("usuarioId", reportUser.id.toString());
      formData.append("animal_id", selectedAnimal.toString());
      formData.append("estado", "pendiente");
      formData.append("imagen_url", tosendFile);

      // PETICIÓN AL BACKEND
      const response = await fetch(`${API_BASE_URL}/reportes`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Error en el servidor");
      }

      await response.json();
      setFinishAlert(true);

    } catch (error) {
      console.error(error);
      setAlertMessage(error.message || "Error al enviar la alerta");
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const labelName = {
    py: 1.5,
    px: 2,
    backgroundColor: '#FB9678',
    color: '#FFFFFF',
    textAlign: 'left',
    fontWeight: 'bold'
  };

  return (
    <Container sx={{ display: 'flex', minWidth: '100%', justifyContent: 'center', marginTop: '70px', backgroundColor: '#EDF1F5' }}>
      {/* Diálogo éxito */}
      <Dialog open={finishAlert}>
        <DialogTitle>Alerta enviada</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Tu reporte ha sido enviado correctamente.
            Nuestros moderadores lo revisarán pronto.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => window.location.href = "/realizar-alerta"}>Aceptar</Button>
        </DialogActions>
      </Dialog>

      {/* FORM */}
      <Paper sx={{ width: '70%', margin: 4 }}>
        {/* IMAGEN */}
        <Box sx={{ p: 2 }}>
          <Typography sx={labelName}>EVIDENCIA FOTOGRÁFICA *</Typography>
          <Box sx={{ border: `2px dashed ${errors.file ? 'red' : '#ccc'}`, p: 3, textAlign: 'center' }}>
            <Button component="label" variant="contained">
              <CloudUploadIcon />
              Subir Foto
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          </Box>

          {file && (
            <Box sx={{ mt: 2 }}>
              <img src={file} alt="preview" style={{ width: "300px" }} />
            </Box>
          )}
        </Box>

        {/* DESCRIPCIÓN */}
        <Box sx={{ p: 2 }}>
          <Typography sx={labelName}>DESCRIPCIÓN DEL CASO *</Typography>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={description}
            onChange={handleDescriptionChange}
            error={errors.description}
            helperText={
              errors.description 
                ? `Mínimo ${MIN_DESCRIPTION_LENGTH} caracteres` 
                : `${description.length}/${MAX_DESCRIPTION_LENGTH}`
            }
          />
        </Box>

        {/* ANIMAL */}
        <Box sx={{ p: 2 }}>
          <FormControl fullWidth>
            <Typography sx={labelName}>SELECCIONAR ANIMAL *</Typography>
            {loadingAnimals ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Select
                value={selectedAnimal}
                onChange={(e) => {
                  setSelectedAnimal(e.target.value);
                  setErrors({ ...errors, animal: false });
                }}
                error={errors.animal}
              >
                <MenuItem value=""><em>Seleccione un animal</em></MenuItem>
                {animalOptions.map(animal => (
                  <MenuItem key={animal.id} value={animal.id}>
                    {animal.nombre}
                  </MenuItem>
                ))}
              </Select>
            )}
          </FormControl>
        </Box>

        {/* MAPA */}
        <Box sx={{ p: 2 }}>
          <Typography sx={labelName}>UBICACIÓN *</Typography>
          <Box sx={{ width: "100%", height: "60vh", border: errors.location ? '2px solid red' : 'none' }}>
            <Mapa lat={setLatitud} long={setLongitud} />
          </Box>
          {errors.location && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              Debe seleccionar una ubicación en el mapa
            </Typography>
          )}
        </Box>

        {/* PRIVACIDAD */}
        <Box sx={{ p: 2 }}>
          <Typography sx={labelName}>CONFIDENCIALIDAD</Typography>
          <FormGroup>
            <FormControlLabel 
              control={
                <Checkbox 
                  checked={isAnonymous} 
                  onChange={handleAnonymousChange} 
                />
              }
              label="Enviar reporte de forma anónima"
            />
            {!isAnonymous && !isAuthenticated() && (
              <Typography color="error" variant="caption">
                Debes iniciar sesión para enviar un reporte no anónimo.
              </Typography>
            )}
          </FormGroup>
        </Box>

        {/* BOTÓN ENVIAR */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Button 
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ minWidth: 200 }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Enviar Reporte"}
          </Button>
        </Box>
      </Paper>

      {/* Notificaciones */}
      <Snackbar 
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}