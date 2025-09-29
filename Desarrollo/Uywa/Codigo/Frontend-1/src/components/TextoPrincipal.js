import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

function TextoCarrusel() {
    return (
      <Card sx={{ maxWidth: 180, height:230, padding:1, margin:2, position:'absolute' }}>
        <CardMedia
          component="img"
          alt="green iguana"
          height="80"
          image="/static/images/cards/contemplative-reptile.jpg"
        />
        <CardContent sx={{textAlign:'center'}}>
          <Typography gutterBottom variant="h3" component="div" margin={0}>
            
          </Typography>
          <Typography variant="body2" color="text.secondary">
              
          </Typography>
        </CardContent>
      </Card>
    );
  }
  export default TextoCarrusel;