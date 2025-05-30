import React from "react";
import Box from '@mui/material/Box';
import {  Typography } from "@mui/material";
import AnimalCardInformation from "../components/Informacion/AnimalCards";
const Blog = () =>{
    return(
        <div>
            <Box sx={{mt:'70px', height:'auto', display:'flex'}}>
                <Typography variant="h3" sx={{mt:5, py:3, width:'100vw', height:'auto', alignContent:'center', fontWeight:'bold'}}>CONOCE MAS SOBRE NUESTRA FAUNA</Typography>
            </Box>
            <Box sx={{display:'flex', p:5, flexWrap:'wrap', justifyContent:'center'}}>
            <a href="https://www.gob.pe/institucion/serfor/campa%C3%B1as/44774-yo-no-soy-parte-de-la-ruta-del-trafico-de-fauna-silvestre" style={{textDecoration:'none'}}>
            <AnimalCardInformation
                imgAnimal="https://cdn.www.gob.pe/uploads/campaign/photo/000/044/774/campaign_Dise%C3%B1o_web_842x450_px_-_No_soy_parte_de_la_Ruta_del_tr%C3%A1fico.jpg"
                textAlter="Animal"
                title="Yo no soy parte de la ruta del tráfico de fauna silvestre"
                description = "30 de noviembre de 2023"
            />
            </a>
            <a href ="https://www.gob.pe/institucion/serfor/campa%C3%B1as/1784-prevencion-y-reduccion-de-incendios-forestales" style={{textDecoration:'none'}}>
            <AnimalCardInformation
                imgAnimal="https://cdn.www.gob.pe/uploads/campaign/photo/000/001/784/campaign_PORTADAPRINCIPALIF.png"
                textAlter="Animal"
                title="Prevención y reducción de incendios forestales"
                description = "27 de agosto de 2020"
            />
            </a>
            <a href="https://www.gob.pe/institucion/serfor/campa%C3%B1as/53150-curso-internacional-identificacion-botanica-y-anatomica-de-especies-forestales" style={{textDecoration:'none'}}>
            <AnimalCardInformation
                imgAnimal="https://cdn.www.gob.pe/uploads/campaign/photo/000/053/150/campaign_WhatsApp_Image_2024-02-20_at_11.00.59.jpeg"
                textAlter="20 de febrero de 2024"
                title="Curso Internacional: Identificación botánica"
                description = "20 de febrero de 2024"
                />
            </a>
            <a href="https://www.gob.pe/institucion/serfor/campa%C3%B1as/67942-el-bosque-en-nuestras-manos" style={{textDecoration:'none'}}>
            <AnimalCardInformation
                imgAnimal="https://cdn.www.gob.pe/uploads/campaign/photo/000/056/829/campaign_campa%C3%B1a_madera.png"
                textAlter="Animal"
                title="Conoce sobre el bosque en nuestras manos"
                description = "20 de junio de 2024"
                />
            </a>
            <a href="https://www.gob.pe/institucion/serfor/campa%C3%B1as/57266-convocatoria-para-la-seleccion-de-coordinadores-regionales-del-programa-bps" style={{textDecoration:'none'}}>
            <AnimalCardInformation
                imgAnimal="https://cdn.www.gob.pe/uploads/campaign/photo/000/057/266/campa%C3%B1a_bps.png"
                textAlter="Animal"
                title="Convocatoria para la selección de coordinadores"
                description = "18 de marzo de 2024"
            />
            </a>
            </Box>
            
        </div>
    );
}

export default Blog;