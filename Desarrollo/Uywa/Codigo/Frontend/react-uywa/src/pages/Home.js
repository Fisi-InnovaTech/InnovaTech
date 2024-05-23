import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import ResponsiveAppBar from "../components/AppBar/AppBar";
import Carrusel from "../components/Carrusel/Carousel";
import VerAlerta from "../pages/VerAlerta";

function Home() {
    return (
      <div className="App">

        <Box>
          <Carrusel/>
        </Box>
          
      </div>
    );
  }
  
  export default Home;