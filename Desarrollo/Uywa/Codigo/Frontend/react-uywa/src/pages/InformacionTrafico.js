import React from "react";
import Box from '@mui/material/Box';
import { CardMedia, Container, Typography } from "@mui/material";
import AnimalCardInformation from "../components/Informacion/AnimalCards";
const Blog = () =>{
    return(
        <div className="informacion-blog">
            <Box sx={{mt:'70px', height:'auto', display:'flex'}}>
                <Typography variant="h3" sx={{m:5, py:3, width:'100vw', height:'auto', alignContent:'center', fontWeight:'bold'}}>CONOCE MAS SOBRE NUESTRA FAUNA</Typography>
            </Box>
            <Box sx={{display:'flex', p:5, flexWrap:'wrap', justifyContent:'center'}}>
            <AnimalCardInformation
                imgAnimal="https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                textAlter="Animal"
                title="TITULO"
                description = "Descripcion de la card"
            />
            <AnimalCardInformation
                imgAnimal="https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                textAlter="Animal"
                title="TITULO"
                description = "Descripcion de la card"
            />
            <AnimalCardInformation
                imgAnimal="https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                textAlter="Animal"
                title="TITULO"
                description = "Descripcion de la card"
            />
            <AnimalCardInformation
                imgAnimal="https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                textAlter="Animal"
                title="TITULO"
                description = "Descripcion de la card"
            />
            <AnimalCardInformation
                imgAnimal="https://plus.unsplash.com/premium_photo-1667873584030-ad34ab3f0f0c?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                textAlter="Animal"
                title="TITULO"
                description = "Descripcion de la card"
            />
            </Box>
            
        </div>
    );
}

export default Blog;