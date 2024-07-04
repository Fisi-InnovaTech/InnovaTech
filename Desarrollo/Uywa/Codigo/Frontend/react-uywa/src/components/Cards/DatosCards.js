import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const CardsListado = ({icono, numero, contenido})=> {
  return (
    <Card sx={{ maxWidth: 180, height:220, padding:1, margin:2 }} data-testid="card-info">
      {imagen}
      <CardContent sx={{textAlign:'center', pt:0}}>
        <Typography gutterBottom variant="h3" component="div" margin={0}>
          {numero}
        </Typography>
        <Typography variant="body2" color="text.secondary">
            {contenido} 
        </Typography>
      </CardContent>
    </Card>
  );
}
export default CardsListado;