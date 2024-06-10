import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import Carrusel from "../components/Carrusel/Carousel";
import ActionAreaCard from '../components/Cards/Informacion.js';
import CardsInformation from '../components/Cards/CardInfo.js';
import ReportIcon from '@mui/icons-material/Report';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

function Home() {
    return (
      <div className="Menu">
        <Box sx={{position:'relative'}}>
          <Carrusel/>
        </Box>
        <Box sx={{display:'flex',justifyContent:'center', alignItems:'center', margin:4, flexDirection:{xs:'column', sm:'row'}}}>
          <CardsInformation
          icono={<ReportIcon sx={{fontSize:80, mt:1}}/>}
          numero = "9890"
          contenido= "Intervenciones de animales en todo el año "
          />
          <CardsInformation
          icono={<LocationCityIcon sx={{fontSize:80, mt:1}}/>}
          numero = "1830"
          contenido= "Intervenciones en regiones del Perú "
          />
          <CardsInformation
          icono={<TravelExploreIcon sx={{fontSize:80, mt:1}}/>}
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
