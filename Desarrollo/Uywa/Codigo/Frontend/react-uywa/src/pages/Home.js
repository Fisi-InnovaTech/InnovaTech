import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import Carrusel from "../components/Carrusel/Carousel";
import Card1 from '../components/Cards/Tabla1';
import Card2 from '../components/Cards/Tabla2';

function Home() {
    return (
      <div className="App">

        <Box>
          <Carrusel/>
        </Box>
        <div>

        </div> 
        <Card1/>
        <Card2/>
       
      </div>
    );
  }
  
  export default Home;