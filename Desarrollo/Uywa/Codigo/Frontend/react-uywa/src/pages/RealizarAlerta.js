import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Container } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import VerAlerta from './VerAlerta';

const animales = [
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
const style = {
  p: 0,
  width: '100%',
  //maxWidth: '100%',
  borderRadius: 3,
  border: '1px solid',
  borderColor: 'divider',
  backgroundColor: 'background.paper',
};

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
    setCat(event.target.value); }
    
  const [sel, setSel] = React.useState('');
  const handleChangeSel = (event) => {
    setSel(event.target.value);
  } 
  ;
  return (
    <Container sx={{maxWidth: '80%', my:6}}>

    <List sx={style} aria-label="mailbox folders">
        <ListItem sx={{backgroundColor: '#F15946'}}>
            <ListItemText primary="SUBIR ARCHIVO" />
        </ListItem>
        <Divider component="li"/> 
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems:'center', margin:7}}>
            <p>Solo formato JPG,PNG</p>

            <Button
              component="label"
              role={undefined}
              variant="outlined"
              size="large"
              
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Subir archivo
              <VisuallyHiddenInput type="file" />
            </Button>
          </Box>
        <Divider component="li" />
        <ListItem sx={{backgroundColor: '#F15946'}}>
            <ListItemText primary="DESCRIPCION DEL CASO"/> 
        </ListItem>
        
        <Divider component="li" />
        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection:{ xs: 'column', md: 'row' }, alignItems:'center', marginY:4}}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems:'center', margin:4}}>
            <p>Seleccionar animal</p>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label"></InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={cat}
                    label=""
                    onChange={handleChange}
                  >
                    {animales.map((tipo, index) => (
                      <MenuItem key={index} value={tipo.value}>
                        {tipo.animal}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <div>
                    <p>Describir al animal afectado</p>
                    <TextField 
                      id="outlined-multiline-static"
                      multiline
                      rows={5}
                      defaultValue=" "
                      sx={{ width: '300px' }}
                    /> 
                </div>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection:'column', alignItems:'center', margin:4}}>
            <p>Seleccionar</p>
                <FormControl fullWidth>
                  <InputLabel id="category-select-label"></InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={sel}
                    label=""
                    onChange={handleChangeSel}
                  >
                    <MenuItem value={10}>Item1</MenuItem>
                    <MenuItem value={20}>Item2</MenuItem>
                    <MenuItem value={30}>Item3</MenuItem>
                  </Select>
                </FormControl>
                <div>
                    <p>Descripción de los hechos</p>
                    <TextField 
                      id="outlined-multiline-static"
                      multiline
                      rows={5}
                      defaultValue=""
                      sx={{ width: '300px' }}
                      maxLength={10000000000000000000000000}
                    /> 
                </div>
            </Box>
            <Box>
             
            </Box>
        </Box>
            
        <Divider component="li" />
        
        <ListItem sx={{backgroundColor: '#F15946'}}>
            <ListItemText primary="UBICACIÓN" />
        </ListItem>
        <Divider component="li" />
        <VerAlerta/>
    </List>
    <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="Subir de forma anónima" />
    </FormGroup>
    <Box display="flex" justifyContent="center">
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Enviar</Button>
      </Stack>      
    </Box>
    </Container>
  );
}
