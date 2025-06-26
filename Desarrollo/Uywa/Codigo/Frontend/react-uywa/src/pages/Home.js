import '../App.css';
import React from "react";
import Box from '@mui/material/Box';
import Carrusel from "../components/Carrusel/Carousel";

import ReportHelp from '../components/cards/Informacion.js';
import CardsInformation from '../components/cards/CardInfo.js';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
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
        <Box sx={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', py:7, px:'7%', m:3}}>
          <Typography fontWeight='bold' sx={{m:2, fontSize:'1.5vh'}}>CONTRIBUYE A PROTEGER NUESTRA FAUNA </Typography>
          <Typography sx={{fontSize:'3.5vh'}}>REPORTA Y ACTÚA CONTRA EL TRÁFICO ANIMAL</Typography>
          <Box sx={{display:'flex', flexWrap:'wrap', justifyContent:'center', mt:3, mb:6}}>
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
          <Box sx={{display:'flex', justifyContent:'center'}}>
            <Card sx={{display:{xs:'',sm:'flex'}, flexWrap:'wrap', mt:5, maxWidth:{xs:'70vw',md:'60vw'}, alignContent:'center'}}>
              <CardMedia
              component="img"
              image="https://cdn.www.gob.pe/uploads/document/file/4926067/IMG_20230602_105541.jpg"
              alt="quienes-somos"
              sx={{ width:{sm:'40%', xs:'100%'},objectFit:'cover', height:{xs:'30%', sm:'100%'}}} 
              />
              <CardContent sx={{ flex: 1,m:2, px:2}}>
                <Typography gutterBottom variant="h3" component="div" sx={{fontSize:'5vh'}}>
                  Únete a Nosotros
                </Typography>
                <Typography color="text.secondary" sx={{fontSize:'1.8vh'}}>
                La protección de la biodiversidad es una tarea compartida que define nuestro compromiso con el futuro del planeta. Juntos, podemos marcar la diferencia y asegurar un futuro seguro y próspero para la fauna del Perú.

                </Typography>
                <Typography color="text.secondary" sx={{fontSize:'1.8vh'}}>
                  Tu participación es fundamental para fortalecer la conservación de nuestros ecosistemas naturales y garantizar que nuestras especies más preciadas puedan prosperar. Únete a nuestra red dedicada y sé parte del movimiento para preservar la riqueza natural que nos define como nación.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </div>
    );
  }
  
  export default Home;
