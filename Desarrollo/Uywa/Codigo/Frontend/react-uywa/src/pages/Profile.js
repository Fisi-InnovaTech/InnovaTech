import React from 'react';
import { Avatar, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import primerReporte from '../assets/Logros/PrimerReporte.png';
import segundoReporte from '../assets/Logros/SegundoLogro.png';
import tercerReporte from '../assets/Logros/TercerLogro.png';
import primerLogro from '../assets/Logros/PrimerLogro.png';
import DiezContribuciones from '../assets/Logros/DiezContribuciones.png';
import avatarImage from '../assets/avatar.jpg';
import {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

const profileStyles = {
  paper: {
    padding: '50px',
    marginTop: '70px',
    maxWidth: '900px',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: '180px',
    height: '180px',
    margin: 'auto',
    marginTop: '50px',
    zIndex: 1,
    position: 'relative',
    backgroundImage: `url(${avatarImage})`,
    backgroundSize: 'cover',
    borderRadius: '50%',
    boxShadow: '0px 0px 8px 0px rgba(0,0,0,0.75)',
  },
  textCenter: {
    textAlign: 'center',
  },
  infoPaper: {
    color: 'white',
    padding: '15px',
    backgroundColor: '#3AB795',
  },
  table: {
    minWidth: 200,
  },

  halfPaper: {
    padding: '15px',
    height: '100%',
    backgroundColor: '#ffffff',
  },
  achievementBox: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  achievementImage: {
    width: '50px',
    height: '50px',
    marginRight: '10px',
  },
};

const reportData = [
  { animal: 'Anaconda', date: '2023-01-15' },
  { animal: 'Cotorra', date: '2023-02-22' },
  { animal: 'Rana del Titicaca', date: '2023-03-10' },
];

const MisLogros = [
  { logro: 'Bienvenido a Uywa', date: '2022-05-01', image: primerReporte },
  { logro: 'Primeros Pasos', date: '2022-12-10', image: DiezContribuciones },
  { logro: 'Amante de los animales', date: '2023-04-20', image: primerLogro },
  { logro: 'Guardián de la naturaleza', date: '2023-05-01', image: segundoReporte },
  { logro: 'Protector de la biósfera', date: '2023-06-10', image: tercerReporte },
];

const Profile = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [isLogin, setIsLogin] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [name, SetName] = useState('');

  const handleCloseAlert = () => {
    setOpenAlert(false);
    window.location.href = '/iniciar-sesion';
  }


  useEffect(()=>{
    if(window.localStorage.getItem('UW-logged-session') === null){
      console.log('')
      //setOpenAlert(true);
      //setIsLogin(false);
    }
    else{
        //setOpenAlert(false);
        //setIsLogin(true);
    }
  }, [])

  return (
    <Box sx={{display:'flex',justifyContent:'center', my:8, px:2}}>
    <Paper style={profileStyles.paper}>
    <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Usuario no logueado"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Debe iniciar sesión para poder ver su perfil
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>

      <Grid container spacing={2}>
        <Grid item xs={12} style={profileStyles.textCenter}>
          <Avatar alt="User Avatar" src="/path_to_your_avatar.jpg" style={profileStyles.avatar} />
        </Grid>
        <Grid item xs={12} style={profileStyles.textCenter}>
          <Typography variant="h5"> {} </Typography>
          <Typography variant="subtitle1">Doctor</Typography>
        </Grid>
        <Grid item xs={12} style={profileStyles.textCenter}>
          <Typography variant="body1">
            Doctor y diseñador gráfico amante de los animales
          </Typography>
        </Grid>
        {isMobile ? (
          <>
            <Grid item xs={12}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Correo:</strong> brayan@llacza.com</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Rango:</strong> Dotero Senior</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Contribuciones:</strong> 120</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.halfPaper}>
                <Typography variant="h6" gutterBottom>Mis reportes</Typography>
                <TableContainer>
                  <Table style={profileStyles.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Animal</TableCell>
                        <TableCell align="right">Fecha de Reporte</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((row) => (
                        <TableRow key={row.animal}>
                          <TableCell component="th" scope="row">{row.animal}</TableCell>
                          <TableCell align="right">{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.halfPaper}>
                <Typography variant="h6" gutterBottom>Mis Logros</Typography>
                <Box>
                  {MisLogros.map((logro, index) => (
                    <Box key={index} style={profileStyles.achievementBox}>
                      <img src={logro.image} alt={logro.logro} style={profileStyles.achievementImage} />
                      <Typography variant="body1">
                        <strong>{logro.logro}</strong> - {logro.date}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={4}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Correo:</strong> brayan@llacza.com</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Rango:</strong> Dotero Senior</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Contribuciones:</strong> 120</Typography>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper style={profileStyles.halfPaper}>
                <Typography variant="h6" gutterBottom>Mis reportes</Typography>
                <TableContainer>
                  <Table style={profileStyles.table} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Animal</TableCell>
                        <TableCell align="right">Fecha de Reporte</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reportData.map((row) => (
                        <TableRow key={row.animal}>
                          <TableCell component="th" scope="row">{row.animal}</TableCell>
                          <TableCell align="right">{row.date}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
            <Grid item xs={6}>
              <Paper style={profileStyles.halfPaper}>
                <Typography variant="h6" gutterBottom>Mis Logros</Typography>
                <Box>
                  {MisLogros.map((logro, index) => (
                    <Box key={index} style={profileStyles.achievementBox}>
                      <img src={logro.image} alt={logro.logro} style={profileStyles.achievementImage} />
                      <Typography variant="body1">
                        <strong>{logro.logro}</strong> - {logro.date}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
    </Box>
  );
};

export default Profile;
