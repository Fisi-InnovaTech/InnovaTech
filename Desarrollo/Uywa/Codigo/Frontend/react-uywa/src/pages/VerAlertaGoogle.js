import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Mapa from "../components/Mapa/MapaMarks";
import { Box, Container, Button, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertaContainer, mapBotonBuscar, mapSearchAlert, mapMark } from "../components/Mapa/MapConstStyle";
import { animales, departamentos } from "./RealizarAlerta";



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

  const filtro = {
    fecha_ini: fechaIni,
    fecha_fin: fechaFin,
    animal,
    region
  };


  const handleSearch = async () => {

    const queryParams = new URLSearchParams(filtro).toString();
    const url = `http://localhost:8000/alertas/search?${queryParams}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMarkerData(data);
        console.log(filtro);
        console.log(markerData);
      } else {
        console.log("Error al buscar back, status: ", response.status);
      }
    } catch (error) {
      console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
    }
  }

  useEffect(() => {
    const cargarMarcadores = async () => {
      try {
        const response = await fetch('http://localhost:8000/alertas/allmap');
        if (response.ok) {
          const data = await response.json();
          setMarkerData(data);
          console.log(markerData);
        } else {
          console.log("Error al buscar back, status: ", response.status);
        }
      } catch (error) {
        console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
      }
    };

    cargarMarcadores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container maxWidth={false} sx={alertaContainer}>
      <Box sx={mapMark}>
        <Mapa markerData={markerData}/>
      </Box>

      <Container maxWidth={false} sx={{ width: { xs: "100%", md: "30%" } }}>
        <Box sx={mapSearchAlert}>
          <h3 style={{textAlign: "left"}}>Buscar alerta</h3>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoItem sx={{ marginBottom: "10px"}}>
              <DatePicker 
              label={"Fecha inicial"}
              onChange={(newValue) => setFechaIni(newValue)}
              />
            </DemoItem>
            <DemoItem sx={{ marginBottom: "10px"}}>
            <DatePicker 
              label={"Fecha final"}
              onChange={(newValue) => setFechaFin(newValue)}
              />
            </DemoItem>
          </LocalizationProvider>

          <FormControl sx={{ marginBottom: "10px"}}>
          <InputLabel id="category-select-label">Animal</InputLabel>
          <Select 
            labelId="category-select-label"
            id="category-select"
            value={animal}
            label="Animal"
            onChange={handleAnimal}
            sx={{ textAlign: "left" }}
            >
            {animales.map((tipo, index) => (
              <MenuItem key={index} value={tipo.animal}>
                {tipo.animal}
              </MenuItem>
            ))}
          </Select>
          </FormControl>

          <FormControl >
          <InputLabel id="category-select-label">Region</InputLabel>
          <Select 
            labelId="category-select-label"
            id="category-select"
            value={region}
            label="Region"
            onChange={handleRegion}
            sx={{ textAlign: "left" }}
            >
            {departamentos.map((tipo, index) => (
              <MenuItem key={index} value={tipo.departamento}>
                {tipo.departamento}
              </MenuItem>
            ))}
          </Select>
          </FormControl>

          <Box sx={{display: "flex", justifyContent: "center"}}>
            <Button variant="contained" sx={mapBotonBuscar} onClick={handleSearch}>
              Buscar
            </Button> 
          </Box>
        </Box>
      </Container>
    </Container>
  );
}

export default Maps;
