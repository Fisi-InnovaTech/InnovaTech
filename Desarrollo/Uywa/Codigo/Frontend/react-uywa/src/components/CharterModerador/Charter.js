import * as React from 'react';
import {
    Card, 
    CardContent, 
    Box, 
    Typography
} 
from '@mui/material';
import { Link } from 'react-router-dom';
import { charterCard } from './CharterConstStyle';

const Charter = ({opcion, colorFondo, IconComponent, ruta})=> {
  charterCard.backgroundColor = colorFondo;
  return (
    <Link to={ruta} style={{textDecoration: 'none'}}>
      <Card sx={charterCard}>
        <Box sx={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
          <IconComponent sx={{ fontSize: 140, color: 'white' }} />
        </Box>
        <CardContent sx={{textAlign: "center"}}>
          <Typography variant="body2" color="text.secondary" sx={{fontSize:"25px", color:"white"}}>
              {opcion}
          </Typography>
        </CardContent>
      </Card>
    </Link>
  );
}
export default Charter;