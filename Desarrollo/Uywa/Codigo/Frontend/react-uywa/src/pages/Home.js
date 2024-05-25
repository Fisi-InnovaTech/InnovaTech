import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import Carrusel from "../components/Carrusel/Carousel";
import CardHorizontal from '../components/cards/CardsHorizontal';
import Card1 from '../components/cards/Tabla1';
import Card2 from '../components/cards/Tabla2';

function Home() {
    return (
      <div className="App">
        <Box className="slider-containers">
          <Carrusel/>
          <div className="text-overlay">
            <h1 className="title">AYUDANOS A SALVAR ANIMALES!</h1>
            <p className="description">Lorem Wasa Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relleno en documentos electrónicos, quedando esencialmente igual al original. Fue popularizado en los 60s con la creación de las hojas "Letraset", las cuales contenian pasajes de Lorem Ipsum, y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.</p>
          </div>
        </Box>
        <CardHorizontal/>
        <Card1/> 
        <Card2/>
       
      </div>
    );
  }
  
export default Home;