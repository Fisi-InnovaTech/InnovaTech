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

// ✅ Objeto de usuario anónimo (solo para el payload, no afecta el store)
const ANONYMOUS_USER = {
  id: 3,
  email: "anonimo@anonimo.com",
  nombres: "anonimo",
  apellidos: "anonimo",
  rol: "user",
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjMsImVtYWlsIjoiYW5vbmltb0Bhbm9uaW1vLmNvbSIsInJvbCI6InVzZXIiLCJpYXQiOjE3NjM5OTQzMDAsImV4cCI6MTc2NDA4MDcwMH0.7Gcclr3q0tt88aX1Gwas_EBcIPrntLM5DUcbaJnVPH0"
};

export const DEPARTMENT_OPTIONS = [
  { id: 'dept-1', value: 1, departamento: "Amazonas" },
  { id: 'dept-2', value: 2, departamento: "Ancash" },
  { id: 'dept-3', value: 3, departamento: "Apurímac" },
  { id: 'dept-4', value: 4, departamento: "Arequipa" },
  { id: 'dept-5', value: 5, departamento: "Ayacucho" },
  { id: 'dept-6', value: 6, departamento: "Cajamarca" },
  { id: 'dept-7', value: 7, departamento: "Callao" },
  { id: 'dept-8', value: 8, departamento: "Cusco" },
  { id: 'dept-9', value: 9, departamento: "Huancavelica" },
  { id: 'dept-10', value: 10, departamento: "Huanuco" },
  { id: 'dept-11', value: 11, departamento: "Ica" },
  { id: 'dept-12', value: 12, departamento: "Junín" },
  { id: 'dept-13', value: 13, departamento: "La Libertad" },
  { id: 'dept-14', value: 14, departamento: "Lambayeque" },
  { id: 'dept-15', value: 15, departamento: "Lima" },
  { id: 'dept-16', value: 16, departamento: "Loreto" },
  { id: 'dept-17', value: 17, departamento: "Madre de Dios" },
  { id: 'dept-18', value: 18, departamento: "Moquegua" },
  { id: 'dept-19', value: 19, departamento: "Pasco" },
  { id: 'dept-20', value: 20, departamento: "Piura" },
  { id: 'dept-21', value: 21, departamento: "Puno" },
  { id: 'dept-22', value: 22, departamento: "San Martín" },
  { id: 'dept-23', value: 23, departamento: "Tacna" },
  { id: 'dept-24', value: 24, departamento: "Tumbes" },
  { id: 'dept-25', value: 25, departamento: "Ucayali" }
];

export const ANIMAL_OPTIONS = [
  { id: 'animal-1', value: 1, animal: "Anaconda" },
  { id: 'animal-2', value: 2, animal: "Boa" },
  { id: 'animal-3', value: 3, animal: "Cotorra" },
  { id: 'animal-4', value: 4, animal: "Escarabajo" },
  { id: 'animal-5', value: 5, animal: "Escarabajo arlequín" },
  { id: 'animal-6', value: 6, animal: "Gallinazo de cabeza negra" },
  { id: 'animal-7', value: 7, animal: "Garza huaco" },
  { id: 'animal-8', value: 8, animal: "Gavilán acanelado" },
  { id: 'animal-9', value: 9, animal: "Golondrina de mar acollarada" },
  { id: 'animal-10', value: 10, animal: "Golondrina de mar de Markham" },
  { id: 'animal-11', value: 11, animal: "Guanay" },
  { id: 'animal-12', value: 12, animal: "Lagartija" },
  { id: 'animal-13', value: 13, animal: "Lobo marino chusco" },
  { id: 'animal-14', value: 14, animal: "Mantona" },
  { id: 'animal-15', value: 15, animal: "Mono machín negro" },
  { id: 'animal-16', value: 16, animal: "Pihuicho ala amarilla" },
  { id: 'animal-17', value: 17, animal: "Rana acuática" },
  { id: 'animal-18', value: 18, animal: "Rana del Titicaca" },
  { id: 'animal-19', value: 19, animal: "Sapo" },
  { id: 'animal-20', value: 20, animal: "Sapo marino" },
  { id: 'animal-21', value: 21, animal: "Taricaya" },
  { id: 'animal-22', value: 22, animal: "Tortuga motelo" },
  { id: 'animal-23', value: 23, animal: "Venado cola blanca" },
  { id: 'animal-24', value: 24, animal: "Zorro costeño" }
];

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
  // ✅ Zustand store
  const { user, isAuthenticated } = useAuthStore();

  // ESTADOS
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [finishAlert, setFinishAlert] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
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
    auth: false // ✅ Nuevo error para autenticación obligatoria
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const urlBackend = "http://localhost:3000/reportes";

  // ✅ Validar formulario (ahora incluye auth si no es anónimo)
  const validateForm = () => {
    const newErrors = {
      animal: !selectedAnimal,
      description: description.length < MIN_DESCRIPTION_LENGTH,
      location: !latitud || !longitud,
      file: !tosendFile,
      auth: !isAnonymous && !isAuthenticated(), // Obligatorio estar logueado si no es anónimo
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

  // ✅ Manejar cambio de anónimo → asegurar consistencia de errores
  const handleAnonymousChange = (e) => {
    const checked = e.target.checked;
    setIsAnonymous(checked);
    if (checked) {
      // Al activar anónimo, limpiar error de auth
      setErrors(prev => ({ ...prev, auth: false }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage("Complete todos los campos obligatorios");
      setOpenSnackbar(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedAnimalData = ANIMAL_OPTIONS.find(a => a.value == selectedAnimal);

      const formData = new FormData();
      formData.append("animal_nombre", selectedAnimalData?.animal || "");
      formData.append("descripcion", description);
      formData.append("latitud", latitud);
      formData.append("longitud", longitud);
      formData.append("estado", "pendiente");

      // ✅ Determinar qué usuario usar para el payload
      let reportUser;
      if (isAnonymous) {
        reportUser = ANONYMOUS_USER;
      } else {
        // Aquí user está garantizado por validateForm (no auth error)
        reportUser = user;
      }

      // ✅ Enviar campos según backend
      formData.append("usuarioId", reportUser.id.toString());
      formData.append("nombre_reportante", `${reportUser.nombres} ${reportUser.apellidos}`);

      // Imagen
      formData.append("evidencia_imagen", tosendFile);

      // PETICIÓN AL BACKEND
      const response = await fetch(urlBackend, {
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
            <Typography>Seleccionar Animal *</Typography>
            <Select
              value={selectedAnimal}
              onChange={(e) => setSelectedAnimal(e.target.value)}
              error={errors.animal}
            >
              <MenuItem value=""><em>Seleccione</em></MenuItem>
              {ANIMAL_OPTIONS.map(a => (
                <MenuItem key={a.id} value={a.value}>{a.animal}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* MAPA */}
        <Box sx={{ p: 2 }}>
          <Typography sx={labelName}>UBICACIÓN *</Typography>
          <Box sx={{ width: "100%", height: "60vh" }}>
            <Mapa lat={setLatitud} long={setLongitud} />
          </Box>
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
            {/* ✅ Mensaje de advertencia si intenta desactivar sin estar logueado */}
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