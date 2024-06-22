import React from 'react';
import { Box, Typography, TextField, Button, Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import './Footer.css';
import { ReactComponent as Logo } from '../logoprincipal.svg';

const Footer = () => {
  return (
    <Box component="footer" className="footer-container">
      <Box className="footer-content">
        <hr className="line" />
        <Box className="footer-logo">
          <a href="/">
            <Logo className="logo" sx={{ mt: '20px' }} />
          </a>
        </Box>
        <hr className="line" />


        <Box className="footer-content footer-section">
          <Box className="footer-links">
            <a href="https://www.centrodeayuda.com" className="custom-link">
              Centro de ayuda animal
            </a>
            <a href="https://servicios.com" className="custom-link">
              Servicios
            </a>
            <a href="https://www.zonasderiesgo.com" className="custom-link">
              Zonas de Riesgo
            </a>
            <a href="https://www.soporte.com" className="custom-link">
              Soporte
            </a>
          </Box>
        </Box>

        <Typography variant="h6" className="footer-section" sx={{ color: 'white' }}>
          Recibe nuestras últimas noticias
        </Typography>

        <Box className="footer-grid">
          <TextField
            variant="outlined"
            placeholder="Correo electrónico"
            className="email-input"
          />
          <Button
            variant="contained"
            className="send-button"
          >
            Registrarme
          </Button>
        </Box>

        <FormGroup>
          <FormControlLabel
            className='letraBlanca'
            control={<Checkbox defaultChecked />}
            label="Acepto los términos y condiciones"
          />
        </FormGroup>
      </Box>

      <hr className="line" />

      <Box className="footer-content footer-section">
        <Box className="footer-section">
          <EmailIcon className="email-icon" />
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>E-MAIL</Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>wasa@unsm.edu.pe</Typography>
          </Box>
        </Box>

        <Box className="footer-section">
          <PhoneIcon className="phone-icon" />
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>TELÉFONO</Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>987654321</Typography>
          </Box>
        </Box>
      </Box>

   
      <Box className="circle-container">
   
        <div className="circle">
          <EmailIcon />
        </div>
        <div>
          <Typography variant="h6" color={'white'}>E-MAIL</Typography>
          <Typography variant="body1" color={'white'}>alerta@serfor.gob.pe</Typography>
    
        </div>
      
        <div className="circle">
          <PhoneIcon />
        </div>
        <div>
          <Typography variant="h6" color={'white'}>TELÉFONO</Typography>
          <Typography variant="body1" color={'white'}>947588269</Typography>
    
        </div>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center',marginTop:'15px'}}>
       <hr className="line" />
      </Box>
      <Box>
          <Typography variant="body1" sx={{ color: 'white', marginTop: '10px' }}>
            © 2024 UYWA. Todos los derechos reservados.
          </Typography>
  
      </Box>
    </Box>
  );
};

export default Footer;