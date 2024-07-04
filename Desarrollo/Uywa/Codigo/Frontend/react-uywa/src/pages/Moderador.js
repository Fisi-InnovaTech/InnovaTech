import React from "react";
import {Box, Container, Typography, CardMedia, Card}  from '@mui/material';
import Charter from '../components/CharterModerador/Charter';
import Warning from '@mui/icons-material/Warning';
import Person from "@mui/icons-material/Person";
import QueryStats from '@mui/icons-material/QueryStats';
import '../App.css';
import { moderadorContainerImage, moderadorTitle, moderadorCharterBox } from "../components/CharterModerador/CharterConstStyle";

function ModeradorPrincipal() {
    return (
        <div className="Menu">
            <Container maxWidth={false} sx={{display: "flex", flexDirection: "column", alignItems: "center",}}>
                <Box sx={moderadorContainerImage}>
                    <CardMedia
                        component="img"
                        alt="InnovaTech"
                        height="600px"
                        image="https://static.nationalgeographic.es/files/styles/image_3200/public/ngsppamztp2305120203520.jpg?w=1600&h=900"
                        sx={{width: "100%", height: "100%"}}
                    />
                    <Typography variant="body" sx={moderadorTitle}>
                        Bienvenido Moderador
                    </Typography>
                </Box>
                <Card sx={{backgroundColor:"#D3D3D3", width:"58%", margin:"2%"}}>
                    <Typography sx={{textAlign:"center", padding:"18px"}}>
                    Estamos encantados de tenerte como moderador de este valioso espacio dedicado a la protección de la fauna silvestre en el Perú. En Uywa, nuestra misión es combatir el tráfico ilegal de animales, preservar la biodiversidad y crear conciencia sobre la importancia de proteger nuestras especies.
                    </Typography>
                </Card>
                <Box sx={moderadorCharterBox}>
                    <Charter opcion="Lista de Alertas" colorFondo="#1ec48c" IconComponent={Warning} ruta="/moderador-reportes"/>
                    <Charter opcion="Promover Usuario" colorFondo="#E02200" IconComponent={Person} ruta="/promover-usuario"/>
                    <Charter opcion="Ver estadística" colorFondo="#E02200" IconComponent={QueryStats} ruta="/estadistica"/>
                </Box>
            </Container>
        </div>
    );
}
  
export default ModeradorPrincipal;
