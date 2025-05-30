import * as React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const CardsInformation = ({ icono, numero, contenido }) => {
  return (
    <Card sx={{ maxWidth: 180, height: 220, padding: 1, margin: 2 }} data-testid="card-info">
      {icono}
      <CardContent sx={{ textAlign: 'center', pt: 0 }}>
        <Typography gutterBottom variant="h3" component="div" margin={0}>
          {numero}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {contenido}
        </Typography>
      </CardContent>
    </Card>
  );
};

CardsInformation.propTypes = {
  icono: PropTypes.node.isRequired,
  numero: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  contenido: PropTypes.string.isRequired,
};

export default CardsInformation;