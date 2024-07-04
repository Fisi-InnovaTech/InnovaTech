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

const MisLogros = [
  { insignia: "1", logro: 'Bienvenido a Uywa',  image: primerReporte , rango: 'Aprendiz de Naturaleza'},
  { insignia: "2", logro: 'Primeros Pasos',  image: DiezContribuciones, rango: 'Vigilante de la Vida Silvestre' },
  { insignia: "3", logro: 'Amante de los animales',  image: primerLogro, rango: 'Guardián del Medio Ambiente' },
  { insignia: "4", logro: 'Guardián de la naturaleza', image: segundoReporte, rango: 'Defensor del Ecosistema' },
  { insignia: "5", logro: 'Protector de la biósfera',  image: tercerReporte, rango: 'Héroe de la Tierra' },
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
  const cookie = JSON.parse(window.localStorage.getItem('UW-logged-session'));
  function filtrarLogros(logros) {
    return MisLogros.filter(logro => logros.includes(logro.insignia));
  }
  function obtenerRangoPorInsignia(insignia) {
    const logro = MisLogros.find(logro => logro.insignia === insignia);
    return logro ? logro.rango : null;
  }
  const logrosFiltrados = filtrarLogros(cookie.insignias);
  const cadena = cookie.insignias;
  const _range = cadena.charAt(cadena.length - 1);
  const rangoCorrespondiente = obtenerRangoPorInsignia(_range);


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
          <Typography variant="subtitle1">{cookie.nombre}</Typography>
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
                <Typography variant="body1"><strong>Correo:</strong> {cookie.email}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Rango:</strong> {rangoCorrespondiente}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Contribuciones:</strong> 0</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.halfPaper}>
                <Typography variant="h6" gutterBottom>Mis Logros</Typography>
                <Box>
                  {logrosFiltrados.map((logro, index) => (
                    <Box key={index} style={profileStyles.achievementBox}>
                      <img src={logro.image} alt={logro.logro} style={profileStyles.achievementImage} />
                      <Typography variant="body1">
                        <strong>{logro.logro}</strong> 
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
                <Typography variant="body1"><strong>Correo:</strong> {cookie.email}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Rango:</strong> {rangoCorrespondiente}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper style={profileStyles.infoPaper}>
                <Typography variant="body1"><strong>Contribuciones:</strong> 120</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper style={profileStyles.halfPaper}>
                <Typography variant="h6" gutterBottom>Mis Logros</Typography>
                <Box>
                  {logrosFiltrados.map((logro, index) => (
                    <Box key={index} style={profileStyles.achievementBox}>
                      <img src={logro.image} alt={logro.logro} style={profileStyles.achievementImage} />
                      <Typography variant="body1">
                        <strong>{logro.logro}</strong> 
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
