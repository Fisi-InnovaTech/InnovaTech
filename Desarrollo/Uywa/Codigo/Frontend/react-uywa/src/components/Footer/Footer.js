import React from 'react';
import { Box, TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import './Footer.css';
import { ReactComponent as Logo } from '../logoprincipal.svg';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 6,  
        px: 6,
        mt: 'auto',
        backgroundColor: '#003049',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
  
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <hr className="line" />
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '10px', marginBottom: '10px' }}>
          <Logo className="logo" />
        </Box>
        <hr className="line" />
      </Box>

  
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginTop: '20px' }}>
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

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', marginBottom: '10px' }}>
              Recibe nuestras ultimas noticias
            </Typography>
            <TextField
              variant="filled"
              label="Correo electrónico"
              className="email-input" 
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ width: '300px' }}
            />
            <Button
              variant="contained"
              className="send-button" 
              sx={{
                backgroundColor: '#E52F60',
                borderRadius: '0 8px 8px 0',
                '&:hover': {
                  backgroundColor: '#E52F60',
                },
              }}
            >
              Registrarme
            </Button>
            <FormGroup>
              <FormControlLabel className='letraBlanca' control={<Checkbox defaultChecked />} label="Acepto los términos y condiciones" />
            </FormGroup>
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