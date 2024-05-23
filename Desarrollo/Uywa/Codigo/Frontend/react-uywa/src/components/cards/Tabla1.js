import * as React from 'react';
import { Box, Typography } from '@mui/material';
import imagen1 from './zorrito.png';

export default function Card1() {
    return (
      <React.Fragment>
        <Box
          sx={{
            width: 800,
            height: 300,
            borderRadius: 2,
            bgcolor: 'white',
            '&:hover': {
              bgcolor: '#f0f0f0',
            },
            position: 'relative',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, 40%)',
            border: '1px solid #ccc',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'left',
            justifyContent: 'center',
          }}
        >
          
          <div style={{ flex: '1', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginLeft: '20px' }}>
            <Typography variant="h5" component="h2" sx={{ color: 'black' }}>
            ¿QUIÉNES SOMOS?
            </Typography>
            <Typography variant="body2" component="h2" sx={{ color: 'black' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed quis ultrices diam, at vulputate dolor. Mauris vitae eros ac enim bibendum fringilla. Nullam nec bibendum justo. Morbi congue nisi non justo dapibus, sed gravida metus viverra. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
            </Typography>
          </div>
          <div style={{ flex: '1', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <img src={imagen1} alt="Example" style={{ width: '90%', height: '80%', objectFit: 'cover', borderRadius: 10}}></img>
          </div>
          
        </Box>
        
      </React.Fragment>
    );
  }