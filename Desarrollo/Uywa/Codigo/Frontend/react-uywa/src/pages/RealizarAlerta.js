import * as React from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Container, Snackbar, Typography } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import Mapa from '../components/Mapa/MapaVisualizar';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import {useState, useEffect} from 'react';
import {Alert} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



export const animales = [
  {"value": 1, "animal": "Anaconda"},
  {"value": 2, "animal": "Boa"},
  {"value": 3, "animal": "Cotorra"},
  {"value": 4, "animal": "Escarabajo"},
  {"value": 5, "animal": "Escarabajo arlequín"},
  {"value": 6, "animal": "Gallinazo de cabeza negra"},
  {"value": 7, "animal": "Garza huaco"},
  {"value": 8, "animal": "Gavilán acanelado"},
  {"value": 9, "animal": "Golondrina de mar acollarada"},
  {"value": 10, "animal": "Golondrina de mar de Markham"},
  {"value": 11, "animal": "Guanay"},
  {"value": 12, "animal": "Lagartija"},
  {"value": 13, "animal": "Lobo marino chusco"},
  {"value": 14, "animal": "Mantona"},
  {"value": 15, "animal": "Mono machín negro"},
  {"value": 16, "animal": "Pihuicho ala amarilla"},
  {"value": 17, "animal": "Rana acuática"},
  {"value": 18, "animal": "Rana del Titicaca"},
  {"value": 19, "animal": "Sapo"},
  {"value": 20, "animal": "Sapo marino"},
  {"value": 21, "animal": "Taricaya"},
  {"value": 22, "animal": "Tortuga motelo"},
  {"value": 23, "animal": "Venado cola blanca"},
  {"value": 24, "animal": "Zorro costeño"},
];

export const departamentos =[
  {"value": 1, "departamento": "Amazonas"},
  {"value": 2, "departamento": "Ancash"},
  {"value": 3, "departamento": "Apurímac"},
  {"value": 4, "departamento": "Arequipa"},
  {"value": 5, "departamento": "Ayacucho"},
  {"value": 6, "departamento": "Cajamarca"},
  {"value": 7, "departamento": "Callao"},
  {"value": 8, "departamento": "Cusco"},
  {"value": 9, "departamento": "Huancavelica"},
  {"value": 10, "departamento": "Huanuco"},
  {"value": 11, "departamento": "Ica"},
  {"value": 12, "departamento": "Junín"},
  {"value": 13, "departamento": "La Libertad"},
  {"value": 14, "departamento": "Lambayeque"},
  {"value": 15, "departamento": "Lima"},
  {"value": 16, "departamento": "Loreto"},
  {"value": 17, "departamento": "Madre de Dios"},
  {"value": 18, "departamento": "Moquegua"},
  {"value": 19, "departamento": "Pasco"},
  {"value": 20, "departamento": "Piura"},
  {"value": 21, "departamento": "Puno"},
  {"value": 22, "departamento": "San Martín"},
  {"value": 23, "departamento": "Tacna"},
  {"value": 24, "departamento": "Tumbes"},
  {"value": 25, "departamento": "Ucayali"}
]

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ListDividers() {
  const [cat, setCat] = React.useState('');
  const handleChange = (event) => {
    setCat(event.target.value); };
  
  const [openAlert, setOpenAlert] = useState(false);
  const [tosendFile, setTosendFile] = useState(null);
  const [description, setDescrition] = useState('');
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
    const url = "https://innovatech-0rui.onrender.com";

    const urlAlertas = url+'/alertas/guardar' 
 
    useEffect(() => {
      if(localStorage.getItem('UW-logged-session') === null){
      console.log('Usuario no logueado');
      setOpenAlert(true);
      //window.location.href = '/iniciar-sesion';
    }
    else{
      setOpenAlert(false);
    }
    }, []);
 
    const handleCloseAlert = () => {
      setOpenAlert(false);
      window.location.href = '/iniciar-sesion';
    }

    const handleSumbit = () => {
    console.log({latitud, longitud });
    console.log(animales[cat-1].animal);
    console.log(description);
    console.log(file);
    console.log(tosendFile);
    console.log('Subiendo archivo');
    if(localStorage.getItem('UW-logged-session') === null){
      console.log('Usuario no logueado');
      setOpenAlert(true);
      //window.location.href = '/iniciar-sesion';
    }
    else{
      setOpenAlert(false);
      const userLogged = JSON.parse(localStorage.getItem('UW-logged-session'));
      console.log(userLogged);
      console.log(userLogged.nombre)
      
      let formData = new FormData();
      formData.append('user_id', userLogged.id);
      formData.append('animal_nombre', animales[cat-1].animal);
      formData.append('nombre_reportante', userLogged.nombre);
      formData.append('fecha_creacion', '2024-12-12');
      formData.append('latitud', latitud);
      formData.append('longitud', longitud);
      formData.append('descripcion', description);
      formData.append('estado', 'pendiente');
      formData.append('evidencia_imagen', tosendFile);
      
      fetch(urlAlertas, {
        method: 'POST',
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });


  }
  }
  //Estilos
  const labelName = {
    py:1.5,
    px:2,
    backgroundColor:'#FB9678',
    color:'#FFFFFF',
    textAlign:'left',
    fontWeight:'bold'
  }



  const [file, setFile] = useState(null);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileType = selectedFile.type;
    if(!fileType.includes('image')) {
      setAlertMessage('Solo se permiten archivos de imagen (JPG, PNG)');
      setOpen(true);
    }
    else{
      setFile(URL.createObjectURL(selectedFile));
      setTosendFile(selectedFile);
    }
  };
  const handleClose = ()=>{
    setOpen(false);
  }

  return (
    <Container sx={{display:'flex', minWidth:'100%', justifyContent:'center', marginTop:'70px', backgroundColor:'#EDF1F5'}}>
      <Paper sx={{width: {xs:'95%', sm:'70%',md:'60%'}, justifyContent:'center', margin:4}}>



      {/* ... */}
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Usuario no logueado"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Debe iniciar sesión para realizar una alerta
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert} color="primary" autoFocus>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>


        <Box aria-label='archivo-subida'>
          <Typography sx={labelName}> SUBIR ARCHIVO </Typography>
          <Typography sx={{py:2}}> Solo formato JPG,PNG </Typography>
          <Button
            component="label"
            role={undefined}
            variant="outlined"
            size="large"
            tabIndex={-1}
            startIcon={<CloudUploadIcon />}
            sx={{mb:3}}
          >
            Subir archivo
            <VisuallyHiddenInput type="file" onChange={handleFileChange} />
          </Button>
          <Grid>
            {file && (
              <img src={file} alt="Archivo seleccionado" style={{ width: '40%', height: 'auto' }} />
              )}
          </Grid>
        </Box>

        
        <Box>

          <Typography sx={labelName}> DESCRIPCION DEL CASO </Typography>
          <Box sx={{flexGrow:1, p:3}}> 

            <Grid container spacing={2} sx={{justifyContent:'left'}}>

              <Grid item xs={12} md={6}>
                <List aria-label='datos-caso-animal'>

                  <FormControl sx={{width:'90%'}}>
                    <Typography sx={{textAlign:'left', mb:2}}>Seleccionar animal</Typography>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={cat}
                      label=""
                      onChange={handleChange}
                      inputProps={{id:'category-input'}}
                    >
                      {animales.map((tipo, index) => (
                        <MenuItem key={index} value={tipo.value}>
                          {tipo.animal}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </List>
              </Grid>

              <Grid item xs ={11.5}>
                <Typography sx={{textAlign:'left', mb:2}}>Describir el caso</Typography>
                <TextField 
                  id="hechos-descripcion"
                  multiline
                  rows={5}
                  defaultValue=" "
                  value={description}
                  onChange = {(e) => {setDescrition(e.target.value)}}
                  sx={{ width:'100%' }}
                />
              </Grid>

            </Grid>
          </Box>

        
        <Box aria-label='marca-ubicacion'>
          <Typography sx={labelName}>UBICACION</Typography>
          <Box sx={{ width: "100%", height: "60vh" }}>
            
            <Mapa lat={setLatitud} long = {setLongitud}/>

          </Box>
        </Box>

        <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} sx={{p:3}} label="Subir de forma anónima" />
        </FormGroup>
        <Divider/>
        <Button variant="contained" onClick = {handleSumbit} sx={{m:4}}>Enviar</Button>   
      </Box>
      </Paper>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}