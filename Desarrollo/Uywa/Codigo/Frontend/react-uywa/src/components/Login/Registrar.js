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


const url = "https://innovatech-0rui.onrender.com";
const registerUrl = url + '/auth/register';

  export default function SignUp() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dni, setDni] = useState("");
  const [password, setPassword] = useState("");

const handleSumbit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
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
      if(res!=null){
        alert('Usuario registrado');
        window.location.href = '/iniciar-sesion';
      }
      else{
        alert('Error al registrar usuario')
        setFirstName(()=> "");
        setLastName(()=> "");
        setEmail(()=> "");
        setDni(()=> "");
        setPassword(()=> "");
      }
    })
  };
  
  return (
    <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box sx={{ width: '200px', height: '100px' }}>
            <Logo style={{ width: '200px', height: '100px' }}/>
          </Box>
          <Box component="form" noValidate onSubmit={handleSumbit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
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