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
  const handleChange1 = (event) => {
    setSel(event.target.value);
  } 
  ;
  return (
    <Container sx={{maxWidth: '80%', mt:5}}>

    <List sx={style} aria-label="mailbox folders">
        <ListItem sx={{backgroundColor: '#F15946'}}>
            <ListItemText primary="SUBIR ARCHIVO" />
        </ListItem>
        <Divider component="li"/> 
          <Box sx={{py: 5}}>
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
        <Box sx={{ display: 'flex', flexDirection: 'row', width:'100%', overflow:'hidden'}}>
            <Box>
            <p>Categoria</p>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cat}
                    label=""
                    onChange={handleChange}
                    >
                    <MenuItem value={10}>Item1</MenuItem>
                    <MenuItem value={20}>Item2</MenuItem>
                    <MenuItem value={30}>Item3</MenuItem>
                    </Select>
                </FormControl>
                <div>
                    <p>Describir al animal afectado</p>
                    <TextField
                    id="outlined-multiline-flexible"
                    label=""
                    multiline
                    maxRows={4}
                    /> 
                </div>
            </Box>
            <Box>
                <p>Seleccionar</p>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label"></InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={cat}
                    label=""
                    onChange={handleChange1}
                    >
                    <MenuItem value={10}>wasa1</MenuItem>
                    <MenuItem value={20}>wasa2</MenuItem>
                    <MenuItem value={30}>wasa3</MenuItem>
                    </Select>
                </FormControl>
                <div>
                    <p>Describir los hechos </p>
                    <TextField
                    id="outlined-multiline-flexible"
                    label=""
                    multiline
                    maxRows={10}
                    /> 
                </div>
            </Box>
        </Box>
            
        <Divider component="li" />
        
        <ListItem sx={{backgroundColor: '#F15946'}}>
            <ListItemText primary="UBICACIÓN" />
        </ListItem>
        <Divider component="li" />
        <ListItem>
            <ListItemText primary="WASAVACIO3" />
        </ListItem>
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
