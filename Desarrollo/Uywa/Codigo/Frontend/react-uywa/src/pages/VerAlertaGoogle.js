import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Mapa from "../components/Mapa/MapaMarks";
import { Box, Container, Button, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertaContainer, mapBotonBuscar, mapSearchAlert, mapMark } from "../components/Mapa/MapConstStyle";

const ANIMAL_OPTIONS = [
  { id: 'animal-1', value: "Anaconda", animal: "Anaconda" },
  { id: 'animal-2', value: "Boa", animal: "Boa" },
  { id: 'animal-3', value: "Cotorra", animal: "Cotorra" },
  { id: 'animal-4', value: "Escarabajo", animal: "Escarabajo" },
  { id: 'animal-5', value: "Escarabajo arlequín", animal: "Escarabajo arlequín" },
  { id: 'animal-6', value: "Gallinazo de cabeza negra", animal: "Gallinazo de cabeza negra" },
  { id: 'animal-7', value: "Garza huaco", animal: "Garza huaco" },
  { id: 'animal-8', value: "Gavilán acanelado", animal: "Gavilán acanelado" },
  { id: 'animal-9', value: "Golondrina de mar acollarada", animal: "Golondrina de mar acollarada" },
  { id: 'animal-10', value: "Golondrina de mar de Markham", animal: "Golondrina de mar de Markham" },
  { id: 'animal-11', value: "Guanay", animal: "Guanay" },
  { id: 'animal-12', value: "Lagartija", animal: "Lagartija" },
  { id: 'animal-13', value: "Lobo marino chusco", animal: "Lobo marino chusco" },
  { id: 'animal-14', value: "Mantona", animal: "Mantona" },
  { id: 'animal-15', value: "Mono machín negro", animal: "Mono machín negro" },
  { id: 'animal-16', value: "Pihuicho ala amarilla", animal: "Pihuicho ala amarilla" },
  { id: 'animal-17', value: "Rana acuática", animal: "Rana acuática" },
  { id: 'animal-18', value: "Rana del Titicaca", animal: "Rana del Titicaca" },
  { id: 'animal-19', value: "Sapo", animal: "Sapo" },
  { id: 'animal-20', value: "Sapo marino", animal: "Sapo marino" },
  { id: 'animal-21', value: "Taricaya", animal: "Taricaya" },
  { id: 'animal-22', value: "Tortuga motelo", animal: "Tortuga motelo" },
  { id: 'animal-23', value: "Venado cola blanca", animal: "Venado cola blanca" },
  { id: 'animal-24', value: "Zorro costeño", animal: "Zorro costeño" }
];

const DEPARTMENT_OPTIONS = [
  { id: 'dept-1', value: "Amazonas", departamento: "Amazonas" },
  { id: 'dept-2', value: "Ancash", departamento: "Ancash" },
  { id: 'dept-3', value: "Apurímac", departamento: "Apurímac" },
  { id: 'dept-4', value: "Arequipa", departamento: "Arequipa" },
  { id: 'dept-5', value: "Ayacucho", departamento: "Ayacucho" },
  { id: 'dept-6', value: "Cajamarca", departamento: "Cajamarca" },
  { id: 'dept-7', value: "Callao", departamento: "Callao" },
  { id: 'dept-8', value: "Cusco", departamento: "Cusco" },
  { id: 'dept-9', value: "Huancavelica", departamento: "Huancavelica" },
  { id: 'dept-10', value: "Huanuco", departamento: "Huanuco" },
  { id: 'dept-11', value: "Ica", departamento: "Ica" },
  { id: 'dept-12', value: "Junín", departamento: "Junín" },
  { id: 'dept-13', value: "La Libertad", departamento: "La Libertad" },
  { id: 'dept-14', value: "Lambayeque", departamento: "Lambayeque" },
  { id: 'dept-15', value: "Lima", departamento: "Lima" },
  { id: 'dept-16', value: "Loreto", departamento: "Loreto" },
  { id: 'dept-17', value: "Madre de Dios", departamento: "Madre de Dios" },
  { id: 'dept-18', value: "Moquegua", departamento: "Moquegua" },
  { id: 'dept-19', value: "Pasco", departamento: "Pasco" },
  { id: 'dept-20', value: "Piura", departamento: "Piura" },
  { id: 'dept-21', value: "Puno", departamento: "Puno" },
  { id: 'dept-22', value: "San Martín", departamento: "San Martín" },
  { id: 'dept-23', value: "Tacna", departamento: "Tacna" },
  { id: 'dept-24', value: "Tumbes", departamento: "Tumbes" },
  { id: 'dept-25', value: "Ucayali", departamento: "Ucayali" }
];

const baseUrl = 'https://innovatech-0rui.onrender.com';

function Maps() {
  const [markerData, setMarkerData] = useState([]);
  const [animal, setAnimal] = useState("");
  const [region, setRegion] = useState("");
  const [fechaIni, setFechaIni] = useState(dayjs());
  const [fechaFin, setFechaFin] = useState(dayjs());

  const handleAnimal = (event) => {
    setAnimal(event.target.value);
  };

  const handleRegion = (event) => {
    setRegion(event.target.value);
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (fechaIni) params.append('fecha_ini', fechaIni.format('YYYY-MM-DD'));
    if (fechaFin) params.append('fecha_fin', fechaFin.format('YYYY-MM-DD'));
    if (animal) params.append('animal', animal);
    if (region) params.append('region', region);

    try {
      const response = await fetch(`${baseUrl}/alertas/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setMarkerData(data);
      } else {
        console.error("Error fetching data:", response.status);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleReset = async () => {
    setAnimal("");
    setRegion("");
    setFechaIni(dayjs());
    setFechaFin(dayjs());
    await cargarMarcadores();
  };

  const cargarMarcadores = async () => {
    try {
      const response = await fetch(`${baseUrl}/alertas/allmap`);
      if (response.ok) {
        const data = await response.json();
        setMarkerData(data);
      }
    } catch (error) {
      console.error("Error loading markers:", error);
    }
  };

  useEffect(() => {
    cargarMarcadores();
  }, []);

  return (
    <Container maxWidth={false} sx={alertaContainer}>
      <Box sx={mapMark}>
        <Mapa markerData={markerData} />
      </Box>

      <Container maxWidth={false} sx={{ width: { xs: "100%", md: "30%" } }}>
        <Box sx={mapSearchAlert}>
          <h3 style={{ textAlign: "left" }}>Buscar alerta</h3>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem sx={{ marginBottom: "10px" }}>
              <DatePicker
                label="Fecha inicial"
                value={fechaIni}
                onChange={setFechaIni}
                format="DD/MM/YYYY"
              />
            </DemoItem>
            <DemoItem sx={{ marginBottom: "10px" }}>
              <DatePicker
                label="Fecha final"
                value={fechaFin}
                onChange={setFechaFin}
                format="DD/MM/YYYY"
              />
            </DemoItem>
          </LocalizationProvider>

          <FormControl fullWidth sx={{ marginBottom: "10px" }}>
            <InputLabel id="animal-select-label">Animal</InputLabel>
            <Select
              labelId="animal-select-label"
              id="animal-select"
              value={animal}
              label="Animal"
              onChange={handleAnimal}
            >
              {ANIMAL_OPTIONS.map((animal) => (
                <MenuItem key={animal.id} value={animal.value}>
                  {animal.animal}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ marginBottom: "20px" }}>
            <InputLabel id="region-select-label">Región</InputLabel>
            <Select
              labelId="region-select-label"
              id="region-select"
              value={region}
              label="Región"
              onChange={handleRegion}
            >
              {DEPARTMENT_OPTIONS.map((dept) => (
                <MenuItem key={dept.id} value={dept.value}>
                  {dept.departamento}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
            <Button 
              variant="contained" 
              onClick={handleSearch}
              sx={mapBotonBuscar}
            >
              Buscar
            </Button>
            <Button 
              variant="outlined" 
              onClick={handleReset}
              sx={mapBotonBuscar}
            >
              Reiniciar
            </Button>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}

export default Maps;