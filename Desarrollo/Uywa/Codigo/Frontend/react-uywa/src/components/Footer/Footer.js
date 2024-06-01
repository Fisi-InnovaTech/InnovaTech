import React from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import './Footer.css';
import { ReactComponent as Logo } from '../logoprincipal.svg';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 12,
        px: 6,
        mt: 'auto',
        backgroundColor: '#003049',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center', // Centra los elementos verticalmente
        position: 'relative', // Asegura que las líneas y la imagen estén dentro del Footer
      }}
    >
      {/* Líneas y logo arriba del Footer */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <hr className="line" />
        <Logo className="logo" style={{ width: '200px', marginTop: '20px' }} />
        <hr className="line" />
      </Box>

      {/* Contenido del Footer */}
      <Box sx={{ maxWidth: '50%' }}>
        <a href="https://www.ejemplo.com" className="custom-link">
          Centro de ayuda animal
        </a>
        <a href="https://www.otra-pagina.com" className="custom-link">
          Servicios
        </a>
        <a href="https://www.otra-pagina.com" className="custom-link">
          Zonas de Riesgo
        </a>
        <a href="https://www.otra-pagina.com" className="custom-link">
          Soporte
        </a>
      </Box>

      {/* Formulario y Checkbox */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>
          <TextField
            variant="filled"
            label="Correo electrónico"
            className="email-input" // Agrega la clase para el TextField
            InputProps={{
              disableUnderline: true,
            }}
            sx={{ width: '300px' }}
          />
          <Button
            variant="contained"
            color="primary"
            className="send-button" // Agrega la clase para el Button
          >
            Registrarme
          </Button>
          <FormGroup>
            <FormControlLabel className='letraBlanca' control={<Checkbox defaultChecked />} label="Acepto los términos y condiciones" />
          </FormGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
