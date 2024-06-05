import React from "react";
import {Box, Container, Typography, CardMedia, Card}  from '@mui/material';
import Charter from '../components/CharterModerador/Charter';
import image1 from '@mui/icons-material/Warning';
import image2 from "@mui/icons-material/InsertInvitation";
import image3 from "@mui/icons-material/Person";
import image4 from '@mui/icons-material/QueryStats';
import '../App.css';

function ModeradorPrincipal() {
    return (
        <div className="Menu">
            <Container  sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom:"15vh"}}>
                <div style={{height: 'auto', position:"relative"}}>
                    <CardMedia
                        component="img"
                        alt="InnovaTech"
                        height="600"
                        image="https://source.unsplash.com/random?wallpapers"
                        sx={{width: '100vw'}}
                    />
                    <Typography variant="h1" className="charter-title">
                        Bienvenido Moderador
                    </Typography>
                </div>
                <Card sx={{textAlign:'center', backgroundColor:"#D3D3D3", width:"80vw", margin:"5%"}}>
                    <Typography variant="h4" sx={{textAlign:'center', padding:3}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>
                </Card>
                <Box className="charter-box">
                    <Charter opcion="Lista de Alertas" colorFondo="#1ec48c" IconComponent={image1} ruta="/ver-alerta"/>
                    <Charter opcion="Gestionar Eventos" colorFondo="#1ec48c" IconComponent={image2} ruta="/ver-alerta"/>
                    <Charter opcion="Promover Usuario" colorFondo="#E02200" IconComponent={image3} ruta="/ver-alerta"/>
                    <Charter opcion="Ver estadística" colorFondo="#E02200" IconComponent={image4} ruta="ver-alerta"/>
                </Box>
            </Container>
        </div>
    );
}
  
export default ModeradorPrincipal;
