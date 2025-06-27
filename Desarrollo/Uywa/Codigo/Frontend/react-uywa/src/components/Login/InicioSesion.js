import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as Logo } from '../logoprincipal.svg';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';

const images = [
  'https://images.vexels.com/media/users/3/157890/isolated/preview/4f2c005416b7f48b3d6d09c5c6763d87-icono-de-circulo-de-marca-de-verificacion.png', 
  'https://static.vecteezy.com/system/resources/previews/001/192/257/non_2x/incorrect-sign-circle-png.png'
];
const messages = ['Usuario logueado correctamente', 'Error, Intente de nuevo'];
const API_URL = "https://innovatech-ztzv.onrender.com";

export default function SignInSide() {
  const [isMod, setIsMod] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleCloseAlert = () => {
    setOpenAlert(false);
    if (!error) {
      navigate('/');
    }
  };

  const handleCheckboxChange = (event) => {
    setIsMod(event.target.checked);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(false);
    setErrorMessage('');

    try {
      const endpoint = isMod ? `${API_URL}/auth/login-moderator` : `${API_URL}/auth/login`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el inicio de sesión');
      }

      // Guardar datos de sesión
      const sessionKey = isMod ? 'UW-mod-logged-session' : 'UW-logged-session';
      const userData = {
        id: data.user.id,
        nombre: data.user.nombre,
        email: data.user.correo,
        token: data.token,
        isModerator: isMod,
        ...(isMod ? {} : { insignias: data.user.insignia })
      };

      localStorage.setItem(sessionKey, JSON.stringify(userData));

      // Verificación adicional para moderadores
      if (isMod) {
        const verifyResponse = await fetch(`${API_URL}/auth/verify-moderator`, {
          headers: {
            'Authorization': `Bearer ${data.token}`
          }
        });

        if (!verifyResponse.ok) {
          throw new Error('No tienes permisos de moderador');
        }
      }

      // Redirección según el tipo de usuario
      setError(false);
      setOpenAlert(true);
      
      // Redirigir después de mostrar el mensaje de éxito
      setTimeout(() => {
        navigate(isMod ? '/moderador' : '/');
      }, 1500);

    } catch (err) {
      console.error('Login error:', err);
      setError(true);
      setErrorMessage(err.message || 'Error en el inicio de sesión');
      setOpenAlert(true);
      setEmail('');
      setPassword('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container component="main" sx={{ height: { md: '100vh', xs: '100vh' } }}>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
      >
        <DialogTitle id="alert-dialog-title">
          {error ? messages[1] : messages[0]}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <img src={error ? images[1] : images[0]} alt="login" style={{ width: '30%', height: '30%' }} />
            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>

      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1544923408-75c5cef46f14?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'top',
        }}
      />
      <Link to={"/"}>
        <IconButton sx={{ position: 'absolute', backgroundColor: { sm: '#DDE2E5' }, color: 'gray', m: 2 }}>
          <ArrowBackIcon />
        </IconButton>
      </Link>

      <Grid item xs={12} sm={8} md={5} component={Paper} square>
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
            <Logo style={{ width: '200px', height: '100px' }} />
          </Box>
          <Typography component="h1" variant="h5">
            Iniciar sesión
          </Typography>
          <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              error={email.length > 0 && (!email.includes('@') || !email.includes('.'))}
              helperText={email.length > 0 && (!email.includes('@') || !email.includes('.')) ? "Correo no válido" : ""}
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
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
              error={password.length > 0 && password.length < 6}
              helperText={password.length > 0 && password.length < 6 ? "Contraseña no válida" : ""}
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
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
            <FormControlLabel
              control={<Checkbox
                value="remember"
                color="primary"
                checked={isMod}
                onChange={handleCheckboxChange}
              />}
              label="Ingresar como moderador"
              sx={{ width: '100%' }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ my: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#66bb6a' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Iniciar Sesión'}
            </Button>
            <Grid container>
              <Grid item>
                <Link to="/Registrar">
                  {"No tienes una cuenta? Registrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}