import './AlertaGoogle.css';
import React from "react";
import { Box, TextField, Button } from '@mui/material';
import Mapa from "../components/Mapa/CargadorMarks";

function Maps() {
    return (
        <Box className="ag-flex-container">
          <Box>
            <Mapa/>
          </Box>
          <Box className="ag-search-container">
            <Box className="ag-search-alert">
              <h3 style={{textAlign: "left"}}>Buscar alerta</h3>
              <TextField label="Fecha" margin="dense" />
              <TextField label="Categoría" margin="dense" />
              <TextField label="Lugar" margin="dense" />
                <Box className="ag-boton-container">
                  <Button variant="contained" className='ag-boton-buscar'>
                        Buscar
                  </Button> 
                </Box>
            </Box>
          </Box>
        </Box>
    );
}

export default Maps;