import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAuthStore } from '../../auth/store/authStore';

const images = [
  'https://images.vexels.com/media/users/3/157890/isolated/preview/4f2c005416b7f48b3d6d09c5c6763d87-icono-de-circulo-de-marca-de-verificacion.png', 
  'https://static.vecteezy.com/system/resources/previews/001/192/257/non_2x/incorrect-sign-circle-png.png'
];

const message = ['Inicio de sesión exitoso', 'Error en las credenciales'];

export default function InicioSesion() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [openAlert, setOpenAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (!error) {
      navigate('/');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMessage("");

    try {
      const response = await fetch('https://backend-uywa.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso - guardar en Zustand
        login(data);
        setError(false);
        setOpenAlert(true);
        
        // Redirigir según el rol después de un breve delay
        setTimeout(() => {
          if (data.rol === 'moderador' || data.rol === 'admin') {
            navigate('/moderador');
          } else {
            navigate('/');
          }
        }, 1500);
      } else {
        // Error en el login
        setError(true);
        setErrorMessage(data.message || 'Credenciales incorrectas');
        setOpenAlert(true);
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError(true);
      setErrorMessage('Error de conexión. Intente nuevamente.');
      setOpenAlert(true);
      setEmail("");
      setPassword("");
    } finally {
      setLoading(false);
    }
  };

  const isEmailValid = email.length === 0 || (email.includes('@') && email.includes('.'));
  const isPasswordValid = password.length === 0 || password.length >= 6;
  const isFormValid = email.length > 0 && password.length > 0 && isEmailValid && isPasswordValid;

  return (
    <Grid container component="main" sx={{ height: { md: '100vh', xs: '100vh' } }}>
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
          {error ? (errorMessage || message[1]) : message[0]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img 
              src={error ? images[1] : images[0]} 
              alt="login" 
              style={{ width: '30%', height: '30%' }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <CssBaseline />
      
      {/* Imagen de fondo */}
      <Grid
        size={{ xs: false, sm: 4, md: 7 }}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544923408-75c5cef46f14?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      />
      
      {/* Botón de regreso */}
      <Link to={"/"}>
        <IconButton sx={{ 
          position: 'absolute', 
          backgroundColor: { sm: '#DDE2E5' }, 
          color: 'gray', 
          m: 2 
        }}>
          <ArrowBackIcon />
        </IconButton>
      </Link>

      {/* Formulario de login */}
      <Grid size={{ xs: 12, sm: 8, md: 5 }} component={Paper} square>
        <Box
          sx={{
            my: 4,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '200px', height: '100px' }}>
            {/* Logo aquí */}
          </Box>
          
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              error={!isEmailValid}
              helperText={!isEmailValid ? "Correo no válido" : ""}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo"
              name="email"
              autoComplete="email"
              autoFocus
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
            
            <TextField
              error={!isPasswordValid}
              helperText={!isPasswordValid ? "La contraseña debe tener al menos 6 caracteres" : ""}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
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
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={!isFormValid || loading}
              sx={{ 
                my: 2, 
                backgroundColor: '#4caf50', 
                '&:hover': { backgroundColor: '#66bb6a' },
                '&:disabled': { backgroundColor: '#cccccc' }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
            
            <Grid container>
              <Grid>
                <Link to="/registrar" style={{ textDecoration: 'none', color: '#4caf50' }}>
                  {"¿No tienes una cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}