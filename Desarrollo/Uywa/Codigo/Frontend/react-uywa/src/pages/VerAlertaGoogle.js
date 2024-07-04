import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Mapa from "../components/Mapa/MapaMarks";
import { Box, Container, Button, MenuItem, InputLabel, FormControl, Select } from '@mui/material';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { alertaContainer, mapBotonBuscar, mapSearchAlert, mapMark } from "../components/Mapa/MapConstStyle";
import { animales, departamentos } from "./RealizarAlerta";

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

  const filtro = {
    fecha_ini: fechaIni,
    fecha_fin: fechaFin,
    animal,
    region
  };

  const handleSearch = async () => {
    const queryParams = new URLSearchParams(filtro).toString();
    const url = `${baseUrl}/alertas/search?${queryParams}`;
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
      } else {
        console.log("Error al buscar back, status: ", response.status);
      }
    } catch (error) {
      console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
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
      } else {
        console.log("Error al buscar back, status: ", response.status);
      }
    } catch (error) {
      console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
    }
  };

  useEffect(() => {
    cargarMarcadores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
                label={"Fecha inicial"}
                value={fechaIni}
                onChange={(newValue) => setFechaIni(newValue)}
              />
            </DemoItem>
            <DemoItem sx={{ marginBottom: "10px" }}>
              <DatePicker
                label={"Fecha final"}
                value={fechaFin}
                onChange={(newValue) => setFechaFin(newValue)}
              />
            </DemoItem>
          </LocalizationProvider>

          <FormControl sx={{ marginBottom: "10px" }}>
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

          <FormControl>
            <InputLabel id="region-select-label">Region</InputLabel>
            <Select
              labelId="region-select-label"
              id="region-select"
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

          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button variant="contained" sx={mapBotonBuscar} onClick={handleSearch}>
              Buscar
            </Button>
            <Button variant="contained" sx={{ ...mapBotonBuscar, ml: 2 }} onClick={handleReset}>
              Reiniciar
            </Button>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}

export default Maps;
