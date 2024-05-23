import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {ReactComponent as Logo} from '../logoprincipal.svg';


const defaultTheme = createTheme();

export default function SignInSide() {
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" alignItems="center"   justifyContent="center" sx={{ height: '100vh' }}>
        <Grid 
          item 
          xs={12} 
          sm={8} 
          md={5} 
          component={Paper} 
          elevation={6} 
          square 
          container 
          alignItems="center" 
          justifyContent="center"
          >

          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '400px',
            }}
          >
            
            <div style={{ width: '250px', height: '100px' }}> 
              <Logo style={{ width: '100%', height: '80%' }}/> 
            </div>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                name="email"
                autoComplete="email"
                placeholder="Usuario"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                placeholder="Contraseña"
                autoComplete="current-password"
              />

              <Grid container justifyContent="flex-end">
                <Grid>
                  <Link href="#" variant="body2" sx={{ color: 'black', textDecoration: 'none' }}>
                    Registrarse
                  </Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, backgroundColor: '#4caf50', '&:hover': { backgroundColor: '#66bb6a' } }}
              >
                INICIAR SESIÓN
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
