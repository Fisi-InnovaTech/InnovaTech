import * as React from 'react';
import {
    Card, 
    CardContent, 
    CardMedia, 
    Typography
} 
from '@mui/material';
import { Link } from 'react-router-dom';
import './Charter.css';

const Charter = ({opcion, colorFondo, image_ruta, ruta})=> {
  return (
    <Link to={ruta} style={{textDecoration: 'none'}}>
    <Card sx={{backgroundColor:colorFondo}} className="charter-card">
      <CardMedia
        sx={{position:"relative"}}
        component="img"
        alt="InnovaTech"
        height="auto"
        image={image_ruta}
      />
      <CardContent className="charter-cardContent">
        <Typography variant="body2" color="text.secondary" className="charter-typography">
            {opcion}
        </Typography>
      </CardContent>
    </Card>
    </Link>
  );
}
export default Charter;