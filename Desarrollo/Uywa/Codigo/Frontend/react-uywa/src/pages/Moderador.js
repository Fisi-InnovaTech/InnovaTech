import React from "react";
import {Box, Container, Typography, CardMedia, Card}  from '@mui/material';
import Charter from '../components/CharterModerador/Charter';
import Warning from '@mui/icons-material/Warning';
import InsertInvitation from "@mui/icons-material/InsertInvitation";
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
                        image="https://source.unsplash.com/random?wallpapers"
                        sx={{width: "100%", height: "100%"}}
                    />
                    <Typography variant="body" sx={moderadorTitle}>
                        Bienvenido Moderador
                    </Typography>
                </Box>
                <Card sx={{backgroundColor:"#D3D3D3", width:"58%", margin:"2%"}}>
                    <Typography sx={{textAlign:"center", padding:"18px"}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>
                </Card>
                <Box sx={moderadorCharterBox}>
                    <Charter opcion="Lista de Alertas" colorFondo="#1ec48c" IconComponent={Warning} ruta="/ver-alerta"/>
                    <Charter opcion="Gestionar Eventos" colorFondo="#1ec48c" IconComponent={InsertInvitation} ruta="/ver-alerta"/>
                    <Charter opcion="Promover Usuario" colorFondo="#E02200" IconComponent={Person} ruta="/ver-alerta"/>
                    <Charter opcion="Ver estadística" colorFondo="#E02200" IconComponent={QueryStats} ruta="ver-alerta"/>
                </Box>
            </Container>
        </div>
    );
}
  
export default ModeradorPrincipal;
