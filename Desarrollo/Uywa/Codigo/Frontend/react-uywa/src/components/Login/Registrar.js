import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import {ReactComponent as Logo} from '../logoprincipal.svg';
import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const images = ['https://images.vexels.com/media/users/3/157890/isolated/preview/4f2c005416b7f48b3d6d09c5c6763d87-icono-de-circulo-de-marca-de-verificacion.png', 'https://static.vecteezy.com/system/resources/previews/001/192/257/non_2x/incorrect-sign-circle-png.png'];
const message = ['Usuario registrado correctamente' , 'Error, Intente de nuevo']
const url = "https://innovatech-0rui.onrender.com";
const registerUrl = url + '/auth/register';

  export default function SignUp() {

  const [openAlert, setOpenAlert] = useState(false);
  const [error, setError] = useState(false);


  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");

  const handleErrorAlert =  () =>{
    setOpenAlert(false);
  
  }
  const handleCloseAlert = () =>{
    setOpenAlert(false);
    window.location.href = '/iniciar-sesion';
  }

  const handleSumbit = (event) => {
    event.preventDefault();

    console.log({
      nombre: firstName ,
      apellidos:  lastName ,
      correo: email ,
      dni: parseInt(dni) ,
      password: password,
      estado : " ",
      insignias : " "
    })
    fetch(registerUrl,
      {
        method:'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: firstName ? firstName : "No ingresado",
          apellidos: lastName ? lastName : "No ingresado",
          correo: email ? email : "No ingresado",
          dni: parseInt(dni) ? parseInt(dni) : "No ingresado",
          password: password ? password : "No ingresado",
          estado : "",
          insignias : ""
        })
      }
    ).then(res => res.json()).then(res =>{
      console.log(res);
      if(res.statusCode === 400){
        setError(true);
        setOpenAlert(true);
        setFirstName(()=> "");
        setLastName(()=> "");
        setEmail(()=> "");
        setDni(()=> "");
        setPassword(()=> "");
      }else if(res.status === 400 ){
        setError(true);
        setOpenAlert(true);
        setFirstName(()=> "");
        setLastName(()=> "");
        setEmail(()=> "");
        setDni(()=> "");
        setPassword(()=> "");
      }
      else{
        setError(false);
        setOpenAlert(true);
      }
    })
  };
  
  return (
    <Container component="main" sx={{width:'100%', display:'flex', justifyContent:'center'}}>
      
    <Dialog
        open={openAlert}
        onClose={error ? handleErrorAlert : handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style = {{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}
      >
        <DialogTitle id="alert-dialog-title"  >{error ? message[1] : message[0]}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" >
            <img src= {error ?  images[1]: images[0]}  alt="login" style={{ width: '30%', height: '30%'}}/>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={error ? handleErrorAlert : handleCloseAlert} color="primary" autoFocus>
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
    <Box component="form" noValidate onSubmit={handleSumbit} sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            error = {firstName.length === 0  || firstName.length <4 ? true : false}
            helperText = {firstName.length === 0 || firstName.length <4 ? "Campo requerido" : ""}
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            placeholder="Nombres"
            autoFocus
            value = {firstName}
            onChange = {(e) => setFirstName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error = {lastName.length === 0  || lastName.length <4 ? true : false}
            helperText = {lastName.length === 0 || lastName.length <4 ? "Campo requerido" : ""}
            required
            fullWidth
            id="lastName"
            name="lastName"
            placeholder="Apellidos"
            autoComplete="family-name"
            value = {lastName}
            onChange = {(e) => setLastName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error = {dni.length !== 8 || isNaN(parseInt(dni)) ? true : false}
            helperText = {dni.length !== 8 || isNaN(parseInt(dni)) ? "DNI no valido" : ""}
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
            error = {!email.includes('@') || !email.includes('.')  ? true : false}
            helperText = {!email.includes('@') ? "Correo no valido" : ""}
            required
            fullWidth
            id="email"
            name="email"
            placeholder="Correo electronico"
            autoComplete="email"
            value = {email}
            onChange = {(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error = {password.length < 6 ? true : false}
            helperText = {password.length < 6 ? "Contraseña no valida" : ""}
            required
            fullWidth
            name="password"
            type="password"
            id="password"
            placeholder="Contraseña"
            autoComplete="new-password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
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