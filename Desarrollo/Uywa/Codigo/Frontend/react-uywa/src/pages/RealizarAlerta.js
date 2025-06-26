import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Mapa from '../components/Mapa/MapaVisualizar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, CircularProgress } from '@mui/material';
import { Container, Snackbar, Typography } from '@mui/material';

// Constantes de configuración
const MAX_FILE_SIZE_MB = 5;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_DESCRIPTION_LENGTH = 30;
const VALID_FILE_TYPES = ['image/jpeg', 'image/png'];

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
  // Estados
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [finishAlert, setFinishAlert] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [tosendFile, setTosendFile] = useState(null);
  const [description, setDescription] = useState('');
  const [latitud, setLatitud] = useState(null);
  const [longitud, setLongitud] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [errors, setErrors] = useState({
    animal: false,
    description: false,
    location: false,
    file: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = "https://innovatech-ztzv.onrender.com";
  const urlAlertas = url + '/alertas/guardar';

  // Efectos
  useEffect(() => {
    if (!localStorage.getItem('UW-logged-session')) {
      setOpenAlert(true);
    }
  }, []);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {
      animal: !selectedAnimal,
      description: description.length < MIN_DESCRIPTION_LENGTH,
      location: !latitud || !longitud,
      file: !tosendFile
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Manejo de cambios
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    if (!VALID_FILE_TYPES.includes(selectedFile.type)) {
      setAlertMessage(`Formato no válido. Solo se permiten: ${VALID_FILE_TYPES.map(t => t.split('/')[1]).join(', ')}`);
      setOpenSnackbar(true);
      return;
    }

    // Validar tamaño
    const maxSize = MAX_FILE_SIZE_MB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setAlertMessage(`El archivo es demasiado grande (Máx. ${MAX_FILE_SIZE_MB}MB)`);
      setOpenSnackbar(true);
      return;
    }

    setFile(URL.createObjectURL(selectedFile));
    setTosendFile(selectedFile);
    setErrors({...errors, file: false});
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(e.target.value);
      setErrors({...errors, description: e.target.value.length < MIN_DESCRIPTION_LENGTH});
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    window.location.href = '/iniciar-sesion';
  };

  const handleCloseFinishAlert = () => {
    setFinishAlert(false);
    window.location.href = '/realizar-alerta';
  };

  // Envío del formulario
  const handleSubmit = async () => {
    if (!validateForm()) {
      setAlertMessage('Por favor complete todos los campos requeridos');
      setOpenSnackbar(true);
      return;
    }

    setIsSubmitting(true);
    setIsButtonDisabled(true);

    try {
      const userLogged = JSON.parse(localStorage.getItem('UW-logged-session'));
      const selectedAnimalData = ANIMAL_OPTIONS.find(animal => animal.value === selectedAnimal);

      let formData = new FormData();
      formData.append('user_id', isAnonymous ? '' : userLogged.id);
      formData.append('animal_nombre', selectedAnimalData?.animal || '');
      formData.append('nombre_reportante', isAnonymous ? 'Anónimo' : userLogged.nombre);
      formData.append('fecha_creacion', new Date().toISOString());
      formData.append('latitud', latitud);
      formData.append('longitud', longitud);
      formData.append('descripcion', description);
      formData.append('estado', 'pendiente');
      formData.append('evidencia_imagen', tosendFile);
      formData.append('es_anonimo', isAnonymous);

      const response = await fetch(urlAlertas, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Error en el servidor');

      await response.json();
      setFinishAlert(true);
    } catch (error) {
      console.error('Error:', error);
      setAlertMessage('Error al enviar la alerta. Por favor intente nuevamente');
      setOpenSnackbar(true);
    } finally {
      setIsSubmitting(false);
      setIsButtonDisabled(false);
    }
  };

  // Componentes de UI
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
      {/* Diálogos */}
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Acceso Requerido"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Debes iniciar sesión para acceder a esta página. Serás redirigido a la página de inicio de sesión.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Entendido
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={finishAlert}
        onClose={handleCloseFinishAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Alerta Enviada"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tu alerta ha sido enviada correctamente.
            <br /><br />
            Recibirás una notificación cuando sea revisada por nuestros moderadores.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFinishAlert} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Formulario */}
      {localStorage.getItem('UW-logged-session') && (
        <Paper sx={{ width: { xs: '95%', sm: '70%', md: '60%' }, justifyContent: 'center', margin: 4 }}>
          {/* Sección de imagen */}
          <Box sx={{ p: 2 }}>
            <Typography sx={labelName}>EVIDENCIA FOTOGRÁFICA *</Typography>
            <Box sx={{ 
              border: `2px dashed ${errors.file ? 'red' : '#ccc'}`,
              borderRadius: 2,
              p: 3,
              textAlign: 'center',
              mb: 2,
              backgroundColor: '#f9f9f9'
            }}>
              <CloudUploadIcon sx={{ fontSize: 50, color: errors.file ? 'red' : '#FB9678', mb: 1 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Subir imagen del suceso</Typography>
              <Typography variant="body2" sx={{ mb: 2, color: errors.file ? 'red' : 'text.secondary' }}>
                Formatos aceptados: JPG, PNG (Máx. {MAX_FILE_SIZE_MB}MB)
              </Typography>
              
              <Button
                component="label"
                variant="contained"
                size="medium"
                startIcon={<CloudUploadIcon />}
                sx={{
                  backgroundColor: errors.file ? 'red' : '#FB9678',
                  '&:hover': { backgroundColor: errors.file ? '#d32f2f' : '#E87A5D' }
                }}
              >
                Seleccionar archivo
                <VisuallyHiddenInput 
                  type="file" 
                  onChange={handleFileChange}
                  accept={VALID_FILE_TYPES.join(',')} 
                />
              </Button>
            </Box>

            {file && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>Vista previa:</Typography>
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  border: '1px solid #eee',
                  borderRadius: 1,
                  overflow: 'hidden'
                }}>
                  <img 
                    src={file} 
                    alt="Previsualización" 
                    style={{ width: '100%', height: 'auto' }} 
                  />
                  <Button 
                    onClick={() => {
                      setFile(null);
                      setTosendFile(null);
                      setErrors({...errors, file: true});
                    }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    ✕
                  </Button>
                </Box>
                <Typography variant="caption">
                  {tosendFile?.name} - {(tosendFile?.size / 1024 / 1024).toFixed(2)}MB
                </Typography>
              </Box>
            )}
          </Box>

          {/* Sección de descripción */}
          <Box sx={{ p: 2 }}>
            <Typography sx={labelName}>DESCRIPCIÓN DEL CASO *</Typography>
            <Box sx={{ flexGrow: 1, p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth error={errors.animal}>
                    <Typography sx={{ textAlign: 'left', mb: 2 }}>Seleccionar animal *</Typography>
                    <Select
                      value={selectedAnimal}
                      onChange={(e) => {
                        setSelectedAnimal(e.target.value);
                        setErrors({...errors, animal: false});
                      }}
                      error={errors.animal}
                    >
                      <MenuItem value=""><em>Seleccione un animal</em></MenuItem>
                      {ANIMAL_OPTIONS.map((animal) => (
                        <MenuItem key={animal.id} value={animal.value}>
                          {animal.animal}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.animal && <Typography color="error" variant="caption">Este campo es requerido</Typography>}
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Typography sx={{ textAlign: 'left', mb: 2 }}>Describa el caso en detalle *</Typography>
                  <TextField
                    multiline
                    rows={5}
                    value={description}
                    onChange={handleDescriptionChange}
                    error={errors.description}
                    helperText={
                      errors.description 
                        ? `Mínimo ${MIN_DESCRIPTION_LENGTH} caracteres (actual: ${description.length})` 
                        : `${description.length}/${MAX_DESCRIPTION_LENGTH} caracteres`
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>

          {/* Sección de ubicación */}
          <Box sx={{ p: 2 }}>
            <Typography sx={labelName}>UBICACIÓN *</Typography>
            <Box sx={{ width: "100%", height: "60vh", position: 'relative' }}>
              <Mapa 
                lat={setLatitud} 
                long={setLongitud} 
                onError={() => {
                  setErrors({...errors, location: true});
                  setAlertMessage('Debe seleccionar una ubicación dentro del territorio nacional');
                  setOpenSnackbar(true);
                }}
              />
              {errors.location && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(255,0,0,0.1)',
                  p: 1,
                  textAlign: 'center'
                }}>
                  <Typography color="error">Seleccione una ubicación válida</Typography>
                </Box>
              )}
            </Box>
          </Box>

          {/* Privacidad */}
          <Box sx={{ p: 2 }}>
            <Typography sx={labelName}>CONFIDENCIALIDAD</Typography>
            <FormGroup sx={{ p: 3 }}>
              <FormControlLabel 
                control={
                  <Checkbox 
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                } 
                label={
                  <>
                    Enviar de forma anónima
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      {isAnonymous 
                        ? 'Tu identidad no será revelada' 
                        : 'Tu nombre será visible en la alerta'}
                    </Typography>
                  </>
                } 
              />
            </FormGroup>
          </Box>

          {/* Envío */}
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={isButtonDisabled}
              sx={{ 
                m: 2,
                minWidth: 200,
                backgroundColor: '#FB9678',
                '&:hover': { backgroundColor: '#E87A5D' }
              }}
            >
              {isSubmitting ? (
                <>
                  <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                  Enviando...
                </>
              ) : 'Enviar Alerta'}
            </Button>
            <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
              * Campos obligatorios
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'text.secondary', mt: 2 }}>
              Al enviar esta alerta aceptas nuestros términos y condiciones de uso.
              <br />
              Nos comprometemos a proteger tu privacidad y no almacenamos información sensible.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Notificaciones */}
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setOpenSnackbar(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}