import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

const AnimalCardInformation =({imgAnimal, textAlter, title, description})=> {
  return (
    <Card sx={{ minWidth: 300, m:2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={imgAnimal}
          alt={textAlter}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Ver mas
        </Button>
      </CardActions>
    </Card>
  );
}

export default AnimalCardInformation;
