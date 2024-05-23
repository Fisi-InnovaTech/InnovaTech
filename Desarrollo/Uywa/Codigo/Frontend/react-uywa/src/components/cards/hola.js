import * as React from 'react';
import { Box, Typography } from '@mui/material';
import './App.css';
import imagen1 from './Imagen1.png';
import imagen2 from './Tortuguita.png';
import imagen3 from './region.png';
import imagen4 from './Ranita.png';

export default function BoxSx() {
  return (
    <React.Fragment>
      <Box
        sx={{
          width: 150,
          height: 200,
          borderRadius: 2,
          bgcolor: 'white',
          '&:hover': {
            bgcolor: '#f0f0f0',
          },
          position: 'absolute',
          top: '50%',
          left: '25%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #ccc',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={imagen1} alt="Example" style={{ width: '70%', height: '60%', borderRadius: '100%', objectFit: 'cover' }}></img>
          <img src={imagen2} alt="Example" style={{ position: 'absolute', top: '07%', width: '50%', height: '40%', borderRadius: '100%', objectFit: 'cover' }}></img>
          <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
            hola
          </Typography>
          <Typography variant="body2" component="h2" sx={{ color: 'black' }}>
            Intervenciones <br></br> de animales en <br></br> todo el año
          </Typography>
        </div>
      </Box>
      <Box
        sx={{
          width: 150,
          height: 200,
          borderRadius: 2,
          bgcolor: 'white',
          '&:hover': {
            bgcolor: '#f0f0f0',
          },
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #ccc',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={imagen1} alt="Example" style={{ width: '70%', height: '60%', borderRadius: '100%', objectFit: 'cover' }}></img>
          <img src={imagen3} alt="Example" style={{ position: 'absolute', top: '07%', width: '50%', height: '40%', borderRadius: '100%', objectFit: 'cover' }}></img>
          <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
            KE LY
          </Typography>
          <Typography variant="body2" component="h2" sx={{ color: 'black' }}>
            Intervenciones <br></br> en regiones del <br></br> Perú
          </Typography>
        </div>
      </Box>
      <Box
        sx={{
          width: 150,
          height: 200,
          borderRadius: 2,
          bgcolor: 'white',
          '&:hover': {
            bgcolor: '#f0f0f0',
          },
          position: 'absolute',
          top: '50%',
          left: '75%',
          transform: 'translate(-50%, -50%)',
          border: '1px solid #ccc',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={imagen1} alt="Example" style={{ width: '70%', height: '60%', borderRadius: '100%', objectFit: 'cover' }}></img>
          <img src={imagen4} alt="Example" style={{ position: 'absolute', top: '07%', width: '50%', height: '40%', borderRadius: '100%', objectFit: 'cover' }}></img>
          <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
            como TAS
          </Typography>
          <Typography variant="body2" component="h2" sx={{ color: 'black' }}>
            Ranas acuaticas <br></br> intervenidas en <br></br> todo el año
          </Typography>
        </div>
      </Box>
    </React.Fragment>
  );
}
