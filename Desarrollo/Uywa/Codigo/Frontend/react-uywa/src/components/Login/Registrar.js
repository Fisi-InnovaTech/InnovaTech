import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {ReactComponent as Logo} from '../logoprincipal.svg';
import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const images = [
  'https://images.vexels.com/media/users/3/157890/isolated/preview/4f2c005416b7f48b3d6d09c5c6763d87-icono-de-circulo-de-marca-de-verificacion.png', 
  'https://static.vecteezy.com/system/resources/previews/001/192/257/non_2x/incorrect-sign-circle-png.png'
];

const messages = [
  'Usuario registrado correctamente',
  'Error, Intente de nuevo'
];

const url = "https://innovatech-ztzv.onrender.com";
const registerUrl = url + '/auth/register';

const resetFormState = (setters) => {
  setters.forEach(setter => setter(""));
};

const isNameInvalid = (name) => name.length > 0 && name.length < 4;

const isDniInvalid = (dni) => {
  if (dni.length === 0) return false;
  return dni.length !== 8 || isNaN(parseInt(dni));
};

const isEmailInvalid = (email) => {
  if (email.length === 0) return false;
  return !email.includes('@') || !email.includes('.');
};

const isPasswordInvalid = (password) => password.length > 0 && password.length < 6;

export default function SignUp() {
  const [openAlert, setOpenAlert] = useState(false);
  const [isError, setIsError] = useState(false);
  const [alertMessage, setAlertMessage] = useState(messages[0]);
  const [alertImage, setAlertImage] = useState(images[0]);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");

  const handleErrorAlert = () => setOpenAlert(false);
  
  const handleCloseAlert = () => {
    setOpenAlert(false);
    window.location.href = '/iniciar-sesion';
  };

  const resetForm = () => resetFormState([setFirstName, setLastName, setEmail, setDni, setPassword]);

  const handleApiResponse = (res, resetForm) => {
    if (res.ok) {
      setIsError(false);
      setAlertMessage(messages[0]);
      setAlertImage(images[0]);
      setOpenAlert(true);
    } else {
      setIsError(true);
      let errorMsg = messages[1];
      
      if (res.status === 400) {
        errorMsg = 'Datos inválidos. Por favor verifica la información';
      } else if (res.status === 409) {
        errorMsg = 'El correo electrónico ya está registrado';
      } else if (res.status === 500) {
        errorMsg = 'Error del servidor. Por favor intenta más tarde';
      }
      
      setAlertMessage(errorMsg);
      setAlertImage(images[1]);
      setOpenAlert(true);
      resetForm();
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validación del formulario
    if (isNameInvalid(firstName) || isNameInvalid(lastName) || 
        isDniInvalid(dni) || isEmailInvalid(email) || 
        isPasswordInvalid(password)) {
      setIsError(true);
      setAlertMessage('Por favor completa todos los campos correctamente');
      setAlertImage(images[1]);
      setOpenAlert(true);
      return;
    }

    const userData = {
      nombre: firstName,
      apellidos: lastName,
      correo: email,
      dni: parseInt(dni),
      password: password,
      estado: "activo",
      insignias: "1"
    };

    fetch(registerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    .then(async (res) => {
      const data = await res.json();
      return {
        ok: res.ok,
        status: res.status,
        ...data
      };
    })
    .then(res => handleApiResponse(res, resetForm))
    .catch(error => {
      setIsError(true);
      setAlertMessage('Error de conexión. Por favor verifica tu internet');
      setAlertImage(images[1]);
      setOpenAlert(true);
      resetForm();
    });
  };

  return (
    <Container component="main" sx={{width:'100%', display:'flex', justifyContent:'center'}}>
      <Dialog
        open={openAlert}
        onClose={isError ? handleErrorAlert : handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}
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
          <Button onClick={isError ? handleErrorAlert : handleCloseAlert} color="primary" autoFocus>
            Continuar
          </Button>
        </DialogActions>
      </Dialog>
      
      <Link to={"/"}>
        <IconButton sx={{position:'absolute', backgroundColor:{sm:'#DDE2E5'}, color:'gray', my:2}}>
          <ArrowBackIcon/>
        </IconButton>
      </Link>
      
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
          <Logo style={{ width: '200px', height: '100px' }}/>
        </Box>
        
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={isNameInvalid(firstName)}
                helperText={isNameInvalid(firstName) ? "Campo requerido" : ""}
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                placeholder="Nombres"
                autoFocus
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={isNameInvalid(lastName)}
                helperText={isNameInvalid(lastName) ? "Campo requerido" : ""}
                required
                fullWidth
                id="lastName"
                name="lastName"
                placeholder="Apellidos"
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={isDniInvalid(dni)}
                helperText={isDniInvalid(dni) ? "DNI no válido" : ""}
                required
                fullWidth
                id="dni"
                name="dni"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={isEmailInvalid(email)}
                helperText={isEmailInvalid(email) ? "Correo no válido" : ""}
                required
                fullWidth
                id="email"
                name="email"
                placeholder="Correo electronico"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={isPasswordInvalid(password)}
                helperText={isPasswordInvalid(password) ? "Contraseña no válida" : ""}
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                placeholder="Contraseña"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Acepto los terminos y condiciones"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#66bb6a' }}}
          >
            REGISTRAR
          </Button>
        </Box>
      </Box>
    </Container>
  );
}