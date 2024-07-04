import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import Carrusel from "../components/Carrusel/Carousel";
import ReportHelp from '../components/cards/Informacion.js';
import CardsInformation from '../components/cards/CardInfo.js';
import { Typography } from '@mui/material';
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
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', py:7, px:3, m:3}}>
          <Typography variant='body1' fontWeight='bold' sx={{m:2}}>CONTRIBUYE A PROTEGER NUESTRA FAUNA </Typography>
          <Typography variant='h3' sx={{display:{xs:'none', sm:'flex'}}}>REPORTA Y ACTÚA CONTRA EL TRÁFICO ANIMAL</Typography>
          <Box sx={{display:'flex', flexWrap:'wrap', justifyContent:'center', mt:3}}>
            <ReportHelp
              item = "01"
              title1 = "AVISTA"
              title2 = "un caso de tráfico animal"
              descrip = "Si has presenciado el tráfico ilegal de animales, ¡tienes el poder de hacer la diferencia! Dirígete a nuestra plataforma de reportes especializada para tomar acción."
            />
            <ReportHelp
              item = "02"
              title1 = "REPORTA"
              title2 = "el incidente aqui"
              descrip = "Si has presenciado el tráfico ilegal de animales, ¡tienes el poder de hacer la diferencia! Dirígete a nuestra plataforma de reportes especializada para tomar acción."
            />
            <ReportHelp
              item = "03"
              title1 = "ENVIA"
              title2 = "tu reporte"
              descrip = 'Una vez completado, envía tu reporte haciendo clic en "Enviar". Nuestro equipo revisará cuidadosamente la información proporcionada y tomará medidas inmediatas.'
            />
            <ReportHelp
              item = "04"
              title1 = "ACTUA"
              title2 = "contra el tráfico ilegal"
              descrip = "Juntos podemos proteger a las especies vulnerables y mantener seguras nuestras comunidades. Tu contribución es crucial para detener el tráfico ilegal de animales y promover la conservación de la vida silvestre."
            />
          </Box>
        </Box>
      </div>
    );
  }
  
  export default Home;
