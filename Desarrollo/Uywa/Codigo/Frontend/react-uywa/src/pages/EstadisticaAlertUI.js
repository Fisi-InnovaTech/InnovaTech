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
import { ANIMAL_OPTIONS, DEPARTMENT_OPTIONS } from './RealizarAlerta.js';
import dayjs from 'dayjs';

export const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export const CHARTERS = [
  { id: 'date', label: 'Reportes por Fechas' },
  { id: 'animal', label: 'Reportes por Animales' },
  { id: 'region', label: 'Reportes por Region' },
  { id: 'comparison', label: 'Comparación de Reportes' }
];

const Reportes = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartX, setChartX] = useState(CHARTERS[0].id);
  const [reports, setReports] = useState([]);
  const [latestReports, setLatestReports] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [animalData, setAnimalData] = useState([]);
  const [regionData, setRegionData] = useState([]);
  const [aprobadoData, setAprobadoData] = useState([]);
  const [rechazadoData, setRechazadoData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async (selectedYear) => {
      try {
        const response = await fetch(`https://innovatech-ztzv.onrender.com/alertas/alertsByYear?year=${selectedYear}`);
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error('Error al conectarse al back:', error);
      }
    };

    fetchReports(year);
  }, [year]);

  useEffect(() => {
    const fetchLatestReports = async () => {
      try {
        const response = await fetch('https://innovatech-ztzv.onrender.com/alertas/latestAlerts');
        const data = await response.json();
        setLatestReports(data);
      } catch (error) {
        console.error('Error al conectarse al back:', error);
      }
    };

    fetchLatestReports();
  }, []);

  useEffect(() => {
    const groupByMonth = reports.reduce((acc, report) => {
      const month = new Date(report.fecha_creacion).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const data = MONTH_NAMES.map((month, index) => ({
      month,
      count: groupByMonth[index] || 0,
    }));

    setFilteredData(data);
  }, [reports]);

  useEffect(() => {
    const animalCounts = reports.reduce((acc, report) => {
      const animal = report.animal_nombre;
      acc[animal] = (acc[animal] || 0) + 1;
      return acc;
    }, {});

    const data = ANIMAL_OPTIONS.map(({ animal }) => ({
      animal,
      count: animalCounts[animal] || 0,
    }));

    setAnimalData(data);
  }, [reports]);

  useEffect(() => {
    const regionCounts = reports.reduce((acc, report) => {
      const region = report.region;
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {});

    const data = DEPARTMENT_OPTIONS.map(({ departamento }) => ({
      region: departamento,
      count: regionCounts[departamento] || 0,
    }));

    setRegionData(data);
  }, [reports]);

  useEffect(() => {
    const estadosCounts = (status) => {
      return reports.reduce((acc, report) => {
        if (report.estado === status) {
          const month = new Date(report.fecha_creacion).getMonth();
          acc[month] = (acc[month] || 0) + 1;
        }
        return acc;
      }, {});
    };

    setAprobadoData(Array.from({ length: 12 }, (_, i) => estadosCounts('aprobado')[i] || 0));
    setRechazadoData(Array.from({ length: 12 }, (_, i) => estadosCounts('rechazado')[i] || 0));
  }, [reports]);

  const handleYearChange = (newDate) => {
    setYear(new Date(newDate).getFullYear());
  };

  const handleChartX = (event) => {
    setChartX(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.searchBox}>
        <FormControl sx={styles.searchField}>
          <InputLabel id="category-select-label">Gráfico Estadístico</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={chartX}
            label="Gráfico Estadístico"
            onChange={handleChartX}
            sx={{ textAlign: "left" }}
          >
            {CHARTERS.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
                {label}
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
              onChange={handleYearChange}
            />
          </DemoItem>
        </LocalizationProvider>
      </Box>

      <Box style={{ width: "100%" }}>
        {chartX === 'date' && (
          <BarChart
            dataset={filteredData}
            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'count', label: 'Fechas Reports' }]}
            height={500}
          />
        )}
        {chartX === 'animal' && (
          <BarChart
            dataset={animalData}
            yAxis={[{ scaleType: 'band', dataKey: 'animal' }]}
            series={[{ dataKey: 'count', label: 'Animal Reports' }]}
            layout="horizontal"
            height={500}
          />
        )}
        {chartX === 'region' && (
          <BarChart
            dataset={regionData}
            yAxis={[{ scaleType: 'band', dataKey: 'region' }]}
            series={[{ dataKey: 'count', label: 'Region Reports' }]}
            layout="horizontal"
            height={500}
          />
        )}
        {chartX === 'comparison' && (
          <LineChart
            xAxis={[
              {
                data: MONTH_NAMES.map((_, index) => index + 1),
                valueFormatter: (value) => MONTH_NAMES[value - 1],
              },
            ]}
            series={[
              { data: aprobadoData, label: 'Aprobados' },
              { data: rechazadoData, label: 'Rechazados' },
            ]}
            height={500}
            sx={{ width: '100%' }}
          />
        )}
      </Box>
      
      <TableContainer component={Paper} sx={{ marginY: "20px" }}>
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