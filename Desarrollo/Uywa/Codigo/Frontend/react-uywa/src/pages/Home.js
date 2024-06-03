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
          <div className="text-overlay">
            <h1 className="title">AYUDANOS A SALVAR ANIMALES!</h1>
            <p className="description">Lorem Wasa Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</p>
          </div>
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