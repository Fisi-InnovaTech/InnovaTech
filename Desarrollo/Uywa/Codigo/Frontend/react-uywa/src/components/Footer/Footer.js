import React from 'react';
import { Box, Typography, TextField, Button, Divider,Card, CardActionArea } from '@mui/material';
import { Email as EmailIcon, Phone as PhoneIcon } from '@mui/icons-material';
import './Footer.css';
import logo from '../../assets/logo-no-background.png';

const Footer = () => {
  return (
    <Box component="footer" className="footer-container">
      <Box sx={{ textAlign:'start', p:2,mx:7}}>
        <a href="/">
          <img src={logo} alt='Innovatech' className='footer-logo'/>
        </a>
      </Box>
      <Divider variant='middle' sx={{backgroundColor:'#495057', mx:7}}/>
      
      <Box className="footer-section">
        <Box className="footer-links" sx={{flexDirection:{xs:'column', md:'row'}, textAlign:'start', px:7, py:2}}>
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
        <Box>
          <Typography variant="h6"sx={{ color: 'white' }}>
            Recibe nuestras últimas noticias
          </Typography>
        </Box>

        <Box sx={{display:'flex', mx:2, mb:2, px:2, justifyContent:'center'}}>
          <TextField
            variant="outlined"
            placeholder="Correo electrónico"
            className="email-input"
          />
          <Button
            variant="contained"
            className="send-button"
          >
            Registrar
          </Button>
        </Box>
      </Box>

      <Divider variant='middle' sx={{backgroundColor:'#495057', mx:7}}/>

      <Box className="footer-section" sx={{display:'flex', justifyContent:'space-around', flexWrap:'wrap', m:2}}>

        <Card sx={{minWidth:150, backgroundColor:'#495057', color:'whitesmoke', m:1, p:1}} >
          <CardActionArea>
            <EmailIcon/>
            <Typography variant="h6">E-MAIL</Typography>
            <Typography variant="body1">alerta@serfor.gob.pe</Typography>
          </CardActionArea>
        </Card>
        <Card sx={{minWidth:150, backgroundColor:'#495057', color:'whitesmoke', m:1,p:1}}>
          <CardActionArea>
            <PhoneIcon/>
            <Typography variant="h6" >TELEFONO</Typography>
            <Typography variant="body1">9871654321</Typography>
          </CardActionArea>
        </Card>
      </Box>

      <Divider variant='middle' sx={{backgroundColor:'#495057', mx:7}}/>
      <Box>
          <Typography variant="body1" sx={{ color: 'white', p:2 }}>
            © 2024 UYWA. Todos los derechos reservados.
          </Typography>
  
      </Box>
    </Box>
  );
};

export default Footer;