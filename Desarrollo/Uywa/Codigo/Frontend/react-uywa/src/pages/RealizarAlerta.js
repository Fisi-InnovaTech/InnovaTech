import * as React from 'react';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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
import {useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const ANIMAL_OPTIONS = [
  { id: 'animal-1', value: 1, animal: "Anaconda" },
  { id: 'animal-2', value: 2, animal: "Boa" },
  { id: 'animal-3', value: 3, animal: "Cotorra" },
  { id: 'animal-4', value: 4, animal: "Escarabajo" },
  { id: 'animal-5', value: 5, animal: "Escarabajo arlequín" },
  { id: 'animal-6', value: 6, animal: "Gallinazo de cabeza negra" },
  { id: 'animal-7', value: 7, animal: "Garza huaco" },
  { id: 'animal-8', value: 8, animal: "Gavilán acanelado" },
  { id: 'animal-9', value: 9, animal: "Golondrina de mar acollarada" },
  { id: 'animal-10', value: 10, animal: "Golondrina de mar de Markham" },
  { id: 'animal-11', value: 11, animal: "Guanay" },
  { id: 'animal-12', value: 12, animal: "Lagartija" },
  { id: 'animal-13', value: 13, animal: "Lobo marino chusco" },
  { id: 'animal-14', value: 14, animal: "Mantona" },
  { id: 'animal-15', value: 15, animal: "Mono machín negro" },
  { id: 'animal-16', value: 16, animal: "Pihuicho ala amarilla" },
  { id: 'animal-17', value: 17, animal: "Rana acuática" },
  { id: 'animal-18', value: 18, animal: "Rana del Titicaca" },
  { id: 'animal-19', value: 19, animal: "Sapo" },
  { id: 'animal-20', value: 20, animal: "Sapo marino" },
  { id: 'animal-21', value: 21, animal: "Taricaya" },
  { id: 'animal-22', value: 22, animal: "Tortuga motelo" },
  { id: 'animal-23', value: 23, animal: "Venado cola blanca" },
  { id: 'animal-24', value: 24, animal: "Zorro costeño" }
];

const DEPARTMENT_OPTIONS = [
  { id: 'dept-1', value: 1, departamento: "Amazonas" },
  { id: 'dept-2', value: 2, departamento: "Ancash" },
  { id: 'dept-3', value: 3, departamento: "Apurímac" },
  { id: 'dept-4', value: 4, departamento: "Arequipa" },
  { id: 'dept-5', value: 5, departamento: "Ayacucho" },
  { id: 'dept-6', value: 6, departamento: "Cajamarca" },
  { id: 'dept-7', value: 7, departamento: "Callao" },
  { id: 'dept-8', value: 8, departamento: "Cusco" },
  { id: 'dept-9', value: 9, departamento: "Huancavelica" },
  { id: 'dept-10', value: 10, departamento: "Huanuco" },
  { id: 'dept-11', value: 11, departamento: "Ica" },
  { id: 'dept-12', value: 12, departamento: "Junín" },
  { id: 'dept-13', value: 13, departamento: "La Libertad" },
  { id: 'dept-14', value: 14, departamento: "Lambayeque" },
  { id: 'dept-15', value: 15, departamento: "Lima" },
  { id: 'dept-16', value: 16, departamento: "Loreto" },
  { id: 'dept-17', value: 17, departamento: "Madre de Dios" },
  { id: 'dept-18', value: 18, departamento: "Moquegua" },
  { id: 'dept-19', value: 19, departamento: "Pasco" },
  { id: 'dept-20', value: 20, departamento: "Piura" },
  { id: 'dept-21', value: 21, departamento: "Puno" },
  { id: 'dept-22', value: 22, departamento: "San Martín" },
  { id: 'dept-23', value: 23, departamento: "Tacna" },
  { id: 'dept-24', value: 24, departamento: "Tumbes" },
  { id: 'dept-25', value: 25, departamento: "Ucayali" }
];

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

export default function AlertForm() {
  const [selectedAnimal, setSelectedAnimal] = React.useState('');
  const [finishAlert, setFinishAlert] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [tosendFile, setTosendFile] = useState(null);
  const [description, setDescription] = useState('');
  const [latitud, setLatitud] = useState(0);
  const [longitud, setLongitud] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [file, setFile] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const url = "https://innovatech-0rui.onrender.com";
  const urlAlertas = url+'/alertas/guardar';

  const handleAnimalChange = (event) => {
    setSelectedAnimal(event.target.value);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    const fileType = selectedFile.type;
    if(!fileType.includes('image')) {
      setAlertMessage('Solo se permiten archivos de imagen (JPG, PNG)');
      setOpenSnackbar(true);
    }
    else {
      setFile(URL.createObjectURL(selectedFile));
      setTosendFile(selectedFile);
    }
  };

  const handleSubmit = () => {
    setIsButtonDisabled(true);
    
    if(localStorage.getItem('UW-logged-session') === null) {
      setOpenAlert(true);
      setIsButtonDisabled(false);
      return;
    }

    const userLogged = JSON.parse(localStorage.getItem('UW-logged-session'));
    const selectedAnimalData = ANIMAL_OPTIONS.find(animal => animal.value === selectedAnimal);

    let formData = new FormData();
    formData.append('user_id', userLogged.id);
    formData.append('animal_nombre', selectedAnimalData?.animal || 'No ingresado');
    formData.append('nombre_reportante', userLogged.nombre);
    formData.append('fecha_creacion', new Date().toISOString().split('T')[0]);
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
      setFinishAlert(true);
      setIsButtonDisabled(false);
    })
    .catch(error => {
      console.error(error);
      setIsButtonDisabled(false);
    });
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
    window.location.href = '/iniciar-sesion';
  };

  const handleCloseFinishAlert = () => {
    setFinishAlert(false);
    window.location.href = '/realizar-alerta';
  };

  const labelName = {
    py: 1.5,
    px: 2,
    backgroundColor: '#FB9678',
    color: '#FFFFFF',
    textAlign: 'left',
    fontWeight: 'bold'
  };

  return (
    <Container sx={{display: 'flex', minWidth: '100%', justifyContent: 'center', marginTop: '70px', backgroundColor: '#EDF1F5'}}>
      <Paper sx={{width: {xs: '95%', sm: '70%', md: '60%'}, justifyContent: 'center', margin: 4}}>
        
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

        <Dialog
          open={finishAlert}
          onClose={handleCloseFinishAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Alerta Realizada Correctamente"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Para visualizar su alerta debe esperar a que sea revisada por un moderador
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseFinishAlert} color="primary" autoFocus>
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>

        <Box aria-label='archivo-subida'>
          <Typography sx={labelName}>SUBIR ARCHIVO</Typography>
          <Typography sx={{py: 2}}>Solo formato JPG,PNG</Typography>
          <Button
            component="label"
            variant="outlined"
            size="large"
            startIcon={<CloudUploadIcon />}
            sx={{mb: 3}}
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
          <Typography sx={labelName}>DESCRIPCION DEL CASO</Typography>
          <Box sx={{flexGrow: 1, p: 3}}> 
            <Grid container spacing={2} sx={{justifyContent: 'left'}}>
              <Grid item xs={12} md={6}>
                <List aria-label='datos-caso-animal'>
                  <FormControl sx={{width: '90%'}}>
                    <Typography sx={{textAlign: 'left', mb: 2}}>Seleccionar animal</Typography>
                    <Select
                      value={selectedAnimal}
                      onChange={handleAnimalChange}
                      inputProps={{id: 'category-input'}}
                    >
                      {ANIMAL_OPTIONS.map((animal) => (
                        <MenuItem key={animal.id} value={animal.value}>
                          {animal.animal}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </List>
              </Grid>

              <Grid item xs={11.5}>
                <Typography sx={{textAlign: 'left', mb: 2}}>Describir el caso</Typography>
                <TextField 
                  id="hechos-descripcion"
                  multiline
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  sx={{width: '100%'}}
                />
              </Grid>
            </Grid>
          </Box>

          <Box aria-label='marca-ubicacion'>
            <Typography sx={labelName}>UBICACION</Typography>
            <Box sx={{width: "100%", height: "60vh"}}>
              <Mapa lat={setLatitud} long={setLongitud}/>
            </Box>
          </Box>

          <FormGroup>
            <FormControlLabel control={<Checkbox defaultChecked />} sx={{p: 3}} label="Subir de forma anónima" />
          </FormGroup>
          <Divider/>
          <Button variant="contained" onClick={handleSubmit} disabled={isButtonDisabled} sx={{m: 4}}>
            Enviar
          </Button>   
        </Box>
      </Paper>
      
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{width: '100%'}}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}