// src/pages/Reportes.jsx
import React, { useState, useEffect } from 'react';
import { 
  Container,
  Box,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, LineChart } from '@mui/x-charts';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styles } from '../components/Estadistica/StatisticsStyle.js';
import { animales, departamentos } from './RealizarAlerta.js';
import dayjs from 'dayjs';

const monthNames = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];
const charters = ['Reportes por Fechas', 'Reportes por Animales', 'Reportes por Region', 'Comparación de Reportes'];

const Reportes = () => {
  // Selectors
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartX, setChartX] = useState(charters[0]);

  // Arrays by statistics
  const [reports, setReports] = useState([]);
  const [latestReports, setLatestReports] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [animalData, setAnimalData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  // Add estado data
  const [aprobadoData, setAprobadoData] = useState([]);
  const [rechazadoData, setRechazadoData] = useState([]);
  const navigate = useNavigate();
  // Callbackend data
  useEffect(() => {
    const fetchReports = async (selectedYear) => {
      try {
        const response = await fetch(`https://innovatech-0rui.onrender.com/alertas/alertsByYear?year=${selectedYear}`);
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.log('Error al conectarse al back:', error);
      }
    };

    fetchReports(year);
  }, [year]);

  useEffect(() => {
    const fetchLatestReports = async () => {
      try {
        const response = await fetch('https://innovatech-0rui.onrender.com/alertas/latestAlerts');
        const data = await response.json();
        setLatestReports(data);
      } catch (error) {
        console.log('Error al conectarse al back:', error);
      }
    };

    fetchLatestReports();
  }, []);

  // Filter data by month
  useEffect(() => {
    const groupByMonth = reports.reduce((acc, report) => {
      const month = new Date(report.fecha_creacion).getMonth();
      acc[month] = acc[month] ? acc[month] + 1 : 1;
      return acc;
    }, {});

    const data = Array.from({ length: 12 }, (_, i) => ({
      month: monthNames[i],
      count: groupByMonth[i] || 0,
    }));

    setFilteredData(data);
  }, [reports]);

  // Filter data by animal
  useEffect(() => {
    const animalCounts = reports.reduce((acc, report) => {
      const animal = report.animal_nombre;
      acc[animal] = acc[animal] ? acc[animal] + 1 : 1;
      return acc;
    }, {});

    const data = animales.map(animal => ({
      animal: animal.animal,
      count: animalCounts[animal.animal] || null,
    }));

    setAnimalData(data);
  }, [reports]);

  // Filter data by region
  useEffect(() => {
    const regionCounts = reports.reduce((acc, report) => {
      const region = report.region;
      acc[region] = acc[region] ? acc[region] + 1 : 1;
      return acc;
    }, {});

    const data = departamentos.map(departamento => ({
      region: departamento.departamento,
      count: regionCounts[departamento.departamento] || 0,
    }));

    setRegionData(data);
  }, [reports]);

  
  // Filter by estado
  useEffect(() =>{
    const estadosCounts = (status) => {
      return reports.reduce((acc, report) => {
        if (report.estado === status) {
          const month = new Date(report.fecha_creacion).getMonth();
          acc[month] = acc[month] ? acc[month] + 1 : 1;
        }
        return acc;
      }, {});
    };

    const aprobados = estadosCounts('aprobado');
    const rechazados = estadosCounts('rechazado');

    const createDataArray = (groupedData) => {
      return Array.from({ length: 12 }, (_, i) => groupedData[i] || 0);
    };

    setAprobadoData(createDataArray(aprobados));
    setRechazadoData(createDataArray(rechazados));
  }, [reports])

  // Manejadores para selectores
  const handleYearChange = (newDate) => {
    setYear(new Date(newDate).getFullYear());
  };

  const handleChartX = (event) => {
    setChartX(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.searchBox}>
        <FormControl  sx={styles.searchField}>
          <InputLabel id="category-select-label">Gráfico Estadístico</InputLabel>
          <Select 
            labelId="category-select-label"
            id="category-select"
            value={chartX}
            label="Gráfico Estadístico"
            onChange={handleChartX}
            sx={{ textAlign: "left" }}
            >
            {charters.map((chart, index) => (
              <MenuItem key={index} value={chart}>
                {chart}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoItem sx={styles.searchField}>
            <DatePicker
            label={'"Año"'}
            views={['year']}
            value={dayjs(new Date(year, 0, 1))}
            onChange={handleYearChange}/>
          </DemoItem>
        </LocalizationProvider>
      </Box>

      <Box style={{width: "100%"}}>
        {chartX === charters[0] && (
          <BarChart
            dataset={filteredData}
            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'count', label: 'Fechas Reports' }]}
            height={500}
          />
        )}
        {chartX === charters[1] && (
          <BarChart
            dataset={animalData}
            yAxis={[{ scaleType: 'band', dataKey: 'animal' }]}
            series={[{ dataKey: 'count', label: 'Animal Reports' }]}
            layout="horizontal"
            height={500}
            sx={{
              padding: "40px",
            }}
          />
        )}
        {chartX === charters[2] && (
          <BarChart
            dataset={regionData}
            yAxis={[{ scaleType: 'band', dataKey: 'region' }]}
            series={[{ dataKey: 'count', label: 'Region Reports' }]}
            layout="horizontal"
            height={500}
            sx={{
              padding: "20px",
            }}
          />
        )}

        {chartX === charters[3] && (
          <LineChart
            xAxis={[
              {
                data: monthNames.map((_label, index) => index + 1),
                valueFormatter: (value) => monthNames[value - 1],
              },
            ]}
            series={[
              {
                data: aprobadoData,
                label: 'Aprobados',
              },
              {
                data: rechazadoData,
                label: 'Rechazados',
              },
            ]}
            height={500}
            sx={{  width: '100%' }}
          />
        )}
      </Box>
      
      <TableContainer component={Paper} sx={{ marginY: "20px"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre Reportante</TableCell>
              <TableCell>Animal Nombre</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>{report.nombre_reportante}</TableCell>
                <TableCell>{report.animal_nombre}</TableCell>
                <TableCell>{new Date(report.fecha_creacion).toLocaleString()}</TableCell>
                <TableCell>{report.estado}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      
      <Box display="flex" justifyContent="center" padding="1.5rem" mt="auto">
        <Button variant="contained" color="primary" onClick={() => navigate('/moderador')}>
          Volver
        </Button>
      </Box>
    </Container>
  );
};

export default Reportes;
