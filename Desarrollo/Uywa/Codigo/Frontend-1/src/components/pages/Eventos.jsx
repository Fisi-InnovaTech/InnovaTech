import React from 'react';
import { Grid, Box, Typography, CardMedia, CardContent, CardActionArea, Card } from '@mui/material';
import Busqueda from './EventosBuscar';
import './Event.css';

export default function Eventos() {
  return (  
       <Grid className="event-screen">
            <Grid className="event-items">
                <Card className='event-description'>
                    <CardActionArea>
                        <CardMedia
                        className="event-img"
                        image= "/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            primer evento
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            fecha hora lugar
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
                
                <Card className='event-description'>
                    <CardActionArea>
                        <CardMedia
                        className="event-img"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            segundo evento
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            fecha hora lugar
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card className='event-description'>
                    <CardActionArea>
                        <CardMedia
                        className="event-img"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            tercer evento
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            HOLA SOY CUETO MIRA MIRA MIRAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            
                <Card className='event-description'>
                    <CardActionArea>
                        <CardMedia
                        className="event-img"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            segundo evento
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            fecha hora lugar
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

                <Card className='event-description'>
                    <CardActionArea>
                        <CardMedia
                        className="event-img"
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                        />
                        <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            segundo evento
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            fecha hora lugar
                        </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>

            </Grid>  
        
            <Box>
                <Busqueda/>
            </Box>
        </Grid>
        
  );
}
