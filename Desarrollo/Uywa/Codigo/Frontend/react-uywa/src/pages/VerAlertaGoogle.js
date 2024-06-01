import './AlertaGoogle.css';
import React from "react";
import { Box, TextField, Button } from '@mui/material';
import Mapa from "../components/Mapa/Map";

function Maps() {
    return (
        <Box className="flex-container">
          <Box className="map-box-container">
            <Mapa/>
          </Box>
          <Box className="search-container">
            <Box className="search-alert">
              <h3 style={{textAlign: "left"}}>Buscar alerta</h3>
              <TextField label="Fecha" margin="dense" />
              <TextField label="Categoría" margin="dense" />
              <TextField label="Lugar" margin="dense" />
                <Box className="boton-container">
                  <Button variant="contained" className='boton-buscar'>
                        Buscar
                  </Button> 
                </Box>
            </Box>
          </Box>
        </Box>
    );
}

export default Maps;