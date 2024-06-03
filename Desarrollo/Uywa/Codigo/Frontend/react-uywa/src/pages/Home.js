import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import Carrusel from "../components/Carrusel/Carousel";
import ActionAreaCard from '../components/Cards/Informacion';
import CardsInformation from '../components/Cards/CardInfo';
import TextoCarrusel from '../components/TextoPrincipal';
function Home() {
    return (
      <div className="Menu">
        <Box sx={{position:'relative'}}>
          <Carrusel/>
        </Box>
        <Box sx={{display:'flex',justifyContent:'center', alignItems:'center', margin:4, flexDirection:{xs:'column', sm:'row'}}}>
          <CardsInformation
          numero = "9890"
          contenido= "Intervenciones de animales en todo el año "
          />
          <CardsInformation
          numero = "1830"
          contenido= "Intervenciones en regiones del Perú "
          />
          <CardsInformation
          numero = "2873"
          contenido= "Ranas acuáticas intervenidas en todo el año "
          />
        </Box>
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingY:7, backgroundColor:'#DDE2E5'}}>
          <ActionAreaCard/>
        </Box>
      </div>
    );
  }
  
  export default Home;