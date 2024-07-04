import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ReportHelp = ({item,title1,title2, descrip}) =>{
  return (
  <Box data-testid="action-area-card" sx={{ textAlign: 'start', display: 'flex', alignItems: 'start', width:300, m:3 }}>
    <Typography variant='h4' sx={{ borderRight: 3, borderColor: '#F9C22E', p: 1}}>{item}</Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', borderLeft: 1.5, borderColor:'#F9C22E', pl:3, height:200 }}>
      <Typography variant='h5' sx={{fontWeight:'bold'}}>{title1}</Typography>
      <Typography variant='body1' sx={{mb:1,color:'#F15946',fontWeight:'bold'}}>{title2}</Typography>
      <Typography variant='body2'>{descrip}</Typography>
    </Box>
  </Box>
  );
}

export  default ReportHelp;



