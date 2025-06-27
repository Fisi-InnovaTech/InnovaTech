import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ReportHelp = ({ item, title1, title2, descrip }) => {
  return (
    <Box 
      data-testid="action-area-card" 
      sx={{ 
        textAlign: 'start', 
        display: 'flex', 
        alignItems: 'start', 
        justifyContent: 'center', 
        width: { xs: '90vw', md: '40vw', lg: '30vw' }, 
        m: 3 
      }}
    >
      <Typography 
        variant='h4' 
        sx={{ 
          borderRight: 3, 
          borderColor: '#F9C22E', 
          p: 1,
          minWidth: '40px' // Ensures consistent width for the item number
        }}
      >
        {item}
      </Typography>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          borderLeft: 1.5, 
          borderColor: '#F9C22E', 
          pl: 3, 
          height: '100%', 
          width: '60%'
        }}
      >
        <Typography sx={{ fontSize: '2.3vh', fontWeight: 'bold' }}>
          {title1}
        </Typography>
        <Typography sx={{ mb: 1, color: '#F15946', fontWeight: 'bold' }}>
          {title2}
        </Typography>
        <Typography variant='body1'>
          {descrip}
        </Typography>
      </Box>
    </Box>
  );
};

ReportHelp.propTypes = {
  item: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  title1: PropTypes.string.isRequired,
  title2: PropTypes.string.isRequired,
  descrip: PropTypes.string.isRequired,
};

export default ReportHelp;