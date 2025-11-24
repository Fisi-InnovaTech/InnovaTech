import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';

const AnimalCardInformation = ({ imgAnimal, textAlter, title, description }) => {
  return (
    <Card sx={{ width: { xs: 300, sm: 500 }, height: 450, m: 2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="200"
          width="100"
          image={imgAnimal}
          alt={textAlter}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Ver más
        </Button>
      </CardActions>
    </Card>
  );
};

AnimalCardInformation.propTypes = {
  imgAnimal: PropTypes.string.isRequired,
  textAlter: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default AnimalCardInformation;