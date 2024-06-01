import * as React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import imagen from './Imagen1.png';
import imagen1 from './Tortuguita.png';
import imagen2 from './region.png';
import imagen3 from './Ranita.png';
import './Cards.css';

export default function BoxSx() {
  return (
    <React.Fragment>
      <Box className="cards-box-container">
        <Box className="card">
          <div className="image-container">
            <img src={imagen} alt="Example" className="image-background" />
            <img src={imagen1} alt="Example" className="image-secondary" />
          </div>
          <div className="text-container">
            <Typography variant="h5" component="h2" className="text-header">
              9890
            </Typography>
            <Typography variant="body2" component="h2" className="text-body">
              Intervenciones <br /> de animales en <br /> todo el año
            </Typography>
          </div>
        </Box>
        <Box className="card">
          <div className="image-container">
            <img src={imagen} alt="Example" className="image-background" />
            <img src={imagen2} alt="Example" className="image-secondary" />
          </div>
          <div className="text-container">
            <Typography variant="h5" component="h2" className="text-header">
              1830
            </Typography>
            <Typography variant="body2" component="h2" className="text-body">
              Intervenciones <br /> en regiones del <br /> Perú
            </Typography>
          </div>
        </Box>
        <Box className="card">
          <div className="image-container">
            <img src={imagen} alt="Example" className="image-background" />
            <img src={imagen3} alt="Example" className="image-secondary" />
          </div>
          <div className="text-container">
            <Typography variant="h5" component="h2" className="text-header">
              2873
            </Typography>
            <Typography variant="body2" component="h2" className="text-body">
              Ranas acuaticas <br /> intervenidas en <br /> todo el año
            </Typography>
          </div>
        </Box>
      </Box>
      <Box display="flex" justifyContent="center">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" className="cards-boton">MAS SOBRE UYWA</Button>
        </Stack>
      </Box>
    </React.Fragment>
  );
}
