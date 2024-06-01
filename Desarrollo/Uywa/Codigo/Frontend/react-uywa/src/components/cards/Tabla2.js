import * as React from 'react';
import { Box, Typography } from '@mui/material';
import imagen2 from './comunidad.png';

export default function Card2() {
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
            transform: 'translate(-50%, 70%)',
            border: '1px solid #ccc',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'left',
            justifyContent: 'center',
          }}
        >
          <div style={{ flex: '1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <img src={imagen2} alt="Example" style={{ width: '90%', height: '80%', objectFit: 'cover', borderRadius: 10}}></img>
          </div>
          <div style={{ flex: '1', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginRight: '20px' }}>
            <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
            ¿QUÉ HACEMOS? 
            </Typography>
            <Typography variant="body2" component="h2" sx={{ color: 'black' }}>
              Nos enfocamos en proporcionar a la comunidad una herramienta efectiva para hacer frente al tráfico ilegal de animales. Nuestra plataforma permite a los usuarios reportar de manera anónima y segura cualquier actividad sospechosa, lo que contribuye a la identificación y prevención de casos de tráfico de fauna silvestre. Trabajamos en estrecha colaboración con las autoridades pertinentes para asegurar que cada alerta sea atendida adecuadamente y que se tomen las medidas necesarias para combatir este grave problema ambiental.
            </Typography>
          </div>
          
        </Box>
        
      </React.Fragment>
    );
  }