import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';

export default function ActionAreaCard() {
  return (
    <>
    <Card sx={{display:'flex', padding:3, marginY:3, maxWidth:'70vw'}}>
        <CardContent sx={{ flex: 1}}>
          <Typography gutterBottom variant="h5" component="div">
            Quienes Somos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
        <CardMedia
          component="img"
          height="140"
          image="/static/images/cards/contemplative-reptile.jpg"
          alt="green iguana"
          sx={{ maxWidth: "30%", marginX:5 }} 
        />
    </Card>
    <Card sx={{display:'flex', padding:3, marginY:3, maxWidth:'70vw'}}>
        <CardMedia
            component="img"
            height="140"
            image="/static/images/cards/contemplative-reptile.jpg"
            alt="green iguana"
            sx={{ maxWidth: "30%", marginX:5 }} 
        />
        <CardContent sx={{ flex: 1}}>
          <Typography gutterBottom variant="h5" component="div">
            Que hacemos como wasasianos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        </CardContent>
    </Card>
    </>
    
  );
}



