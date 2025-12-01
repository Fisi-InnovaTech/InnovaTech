import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const images = [
  'https://images.vexels.com/media/users/3/157890/isolated/preview/4f2c005416b7f48b3d6d09c5c6763d87-icono-de-circulo-de-marca-de-verificacion.png', 
  'https://static.vecteezy.com/system/resources/previews/001/192/257/non_2x/incorrect-sign-circle-png.png'
];

const messages = {
  success: 'Usuario registrado correctamente',
  error: 'Error al registrar usuario',
  invalidData: 'Por favor completa todos los campos correctamente',
  emailExists: 'El correo electrónico ya está registrado',
  serverError: 'Error del servidor. Por favor intenta más tarde',
  connectionError: 'Error de conexión. Verifica tu internet',
  termsRequired: 'Debes aceptar los términos y condiciones'
};

const API_URL = "https://backend-uywa.onrender.com";

const isNameInvalid = (name) => name.length > 0 && name.length < 2;

const isDniInvalid = (dni) => {
  if (dni.length === 0) return false;
  return dni.length !== 8 || isNaN(parseInt(dni));
};

const isEmailInvalid = (email) => {
  if (email.length === 0) return false;
  return !email.includes('@') || !email.includes('.');
};

const isPasswordInvalid = (password) => password.length > 0 && password.length < 6;

const isDateInvalid = (date) => {
  if (!date) return false;
  const selectedDate = new Date(date);
  const today = new Date();
  const age = today.getFullYear() - selectedDate.getFullYear();
  return age < 13 || age > 120; // Usuario debe tener entre 13 y 120 años
};

export default function Registrar() {
  const navigate = useNavigate();
  
  const [openAlert, setOpenAlert] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState(messages.success);
  const [alertImage, setAlertImage] = useState(images[0]);
  const [loading, setLoading] = useState(false);
  
  // Estados del formulario
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (!isError) {
      navigate('/iniciar-sesion');
    }
  };

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setDni("");
    setPassword("");
    setBirthDate("");
    setAcceptTerms(false);
  };

  const showAlert = (error, message) => {
    setIsError(error);
    setAlertMessage(message);
    setAlertImage(error ? images[1] : images[0]);
    setOpenAlert(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    // Validación de términos y condiciones
    if (!acceptTerms) {
      showAlert(true, messages.termsRequired);
      setLoading(false);
      return;
    }

    // Validación de campos
    if (isNameInvalid(firstName) || isNameInvalid(lastName) || 
        isDniInvalid(dni) || isEmailInvalid(email) || 
        isPasswordInvalid(password) || isDateInvalid(birthDate)) {
      showAlert(true, messages.invalidData);
      setLoading(false);
      return;
    }

    // Preparar datos según el formato de la API
    const userData = {
      email: email,
      password: password,
      nombres: firstName,
      apellidos: lastName,
      dni: parseInt(dni),
      fechaNacimiento: birthDate
    };

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (response.ok) {
        showAlert(false, messages.success);
        resetForm();
      } else {
        // Manejo de errores específicos
        let errorMessage = messages.error;
        
        if (response.status === 400) {
          errorMessage = data.message || messages.invalidData;
        } else if (response.status === 409) {
          errorMessage = messages.emailExists;
        } else if (response.status === 500) {
          errorMessage = messages.serverError;
        }
        
        showAlert(true, errorMessage);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      showAlert(true, messages.connectionError);
    } finally {
      setLoading(false);
    }
  };

  // Validación del formulario completo
  const isFormValid = 
    firstName.length >= 2 && 
    lastName.length >= 2 && 
    !isDniInvalid(dni) && 
    dni.length === 8 &&
    !isEmailInvalid(email) && 
    email.length > 0 &&
    !isPasswordInvalid(password) && 
    password.length >= 6 &&
    birthDate.length > 0 &&
    !isDateInvalid(birthDate) &&
    acceptTerms;

  return (
    <Container component="main" sx={{width:'100%', display:'flex', justifyContent:'center'}}>
      {/* Dialog de alerta */}
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          textAlign: 'center'
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {alertMessage}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img src={alertImage} alt="status" style={{ width: '30%', height: '30%'}}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Botón de regreso */}
      <Link to={"/"}>
        <IconButton sx={{
          position:'absolute', 
          backgroundColor:{sm:'#DDE2E5'}, 
          color:'gray', 
          my:2
        }}>
          <ArrowBackIcon/>
        </IconButton>
      </Link>
      
      {/* Formulario */}
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width:{xs:'85vw', sm:'50vw', lg:'30vw'}
        }}
      >
        <Box sx={{ width: '200px', height: '100px' }}>
          {/* Logo aquí */}
        </Box>
        
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Crear cuenta
        </Typography>
        
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                error={isNameInvalid(firstName)}
                helperText={isNameInvalid(firstName) ? "Mínimo 2 caracteres" : ""}
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="Nombres"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#66bb6a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#66bb6a'
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12, sm: 6}}>
              <TextField
                error={isNameInvalid(lastName)}
                helperText={isNameInvalid(lastName) ? "Mínimo 2 caracteres" : ""}
                required
                fullWidth
                id="lastName"
                label="Apellidos"
                name="lastName"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#66bb6a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#66bb6a'
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                error={isDniInvalid(dni)}
                helperText={isDniInvalid(dni) ? "DNI debe tener 8 dígitos" : ""}
                required
                fullWidth
                id="dni"
                label="DNI"
                name="dni"
                value={dni}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    setDni(value.slice(0, 8));
                  }
                }}
                disabled={loading}
                inputProps={{ maxLength: 8 }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#66bb6a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#66bb6a'
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                error={isEmailInvalid(email)}
                helperText={isEmailInvalid(email) ? "Correo no válido" : ""}
                required
                fullWidth
                id="email"
                label="Correo electrónico"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#66bb6a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#66bb6a'
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                error={isPasswordInvalid(password)}
                helperText={isPasswordInvalid(password) ? "Mínimo 6 caracteres" : ""}
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#66bb6a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#66bb6a'
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <TextField
                error={isDateInvalid(birthDate)}
                helperText={isDateInvalid(birthDate) ? "Edad inválida (13-120 años)" : ""}
                required
                fullWidth
                id="birthDate"
                label="Fecha de Nacimiento"
                name="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={loading}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0] // No permitir fechas futuras
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#66bb6a',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    '&.Mui-focused': {
                      color: '#66bb6a'
                    },
                  },
                }}
              />
            </Grid>
            
            <Grid size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    color="primary"
                    disabled={loading}
                  />
                }
                label="Acepto los términos y condiciones"
              />
            </Grid>
          </Grid>
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={!isFormValid || loading}
            sx={{ 
              mt: 3, 
              mb: 2, 
              backgroundColor: '#4caf50', 
              '&:hover': { backgroundColor: '#66bb6a' },
              '&:disabled': { backgroundColor: '#cccccc' }
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'REGISTRAR'}
          </Button>
          
          <Grid container justifyContent="center">
            <Grid>
              <Link to="/iniciar-sesion" style={{ textDecoration: 'none', color: '#4caf50' }}>
                ¿Ya tienes una cuenta? Inicia sesión
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}