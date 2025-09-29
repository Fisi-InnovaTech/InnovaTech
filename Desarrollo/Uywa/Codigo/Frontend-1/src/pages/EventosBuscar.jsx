import './Event.css';
import React from "react";
import { Box, TextField, Button } from '@mui/material';


function Cuadro() {
    return (
        <Box className="event-screens">
          <Box className="item-split">
            <Box className="search-event">
              <h3 style={{textAlign: "left"}}>Buscar eventos</h3>
              <TextField label="Fecha" margin="dense" />
              <TextField label="Categoría" margin="dense" />
              <TextField label="Lugar" margin="dense" />
                <Box className="button-container">
                  <Button variant="contained" className='button-search'>
                        Buscar
                  </Button> 
                </Box>
            </Box>
          </Box>
        </Box>
    );
}

export default Cuadro;