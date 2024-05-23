import * as React from 'react';
import { Box, Typography } from '@mui/material';
import imagen1 from './zorrito.png';

export default function Card1() {
    return (
      <React.Fragment>
        <Box
          sx={{
            width: 800,
            height: 300,
            borderRadius: 2,
            bgcolor: 'white',
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, 40%)',
            border: '1px solid #ccc',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'center',
          }}
        >
          
          <div style={{ flex: '1', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: '20px' }}>
            <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
            ¿QUIÉNES SOMOS?
            </Typography>
            <Typography variant="body2" component="h2" sx={{ color: 'black' }}>
              Somos una organización comprometida con la protección y bienestar de los animales silvestres en el Perú. Nuestra misión es defender los derechos de estas especies vulnerables, enfrentando el tráfico ilegal y promoviendo su respeto y cuidado en todos los niveles de la sociedad. Trabajamos incansablemente para crear conciencia sobre la importancia de conservar la biodiversidad y asegurar un futuro sostenible para todas las formas de vida en nuestro país.
            </Typography>
          </div>
          <div style={{ flex: '1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <img src={imagen1} alt="Example" style={{ width: '90%', height: '80%', objectFit: 'cover', borderRadius: 10}}></img>
          </div>
          
        </Box>
        
      </React.Fragment>
    );
  }