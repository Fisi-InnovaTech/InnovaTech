import { useState, useEffect } from 'react';
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
  Button,
  Autocomplete,
  TextField,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, LineChart } from '@mui/x-charts';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styles } from '../components/Estadistica/StatisticsStyle';
import dayjs from 'dayjs';
import { departamentos } from '../utils/Departamentos';

// Importar departamentos

export const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

export const CHARTERS = [
  { id: 'date', label: 'Reportes por Fechas' },
  { id: 'animal', label: 'Reportes por Animales' },
  { id: 'comparison', label: 'Comparación de Reportes' }
];

const Reportes = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartX, setChartX] = useState(CHARTERS[0].id);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [selectedDepartamento, setSelectedDepartamento] = useState(null);
  
  const [reports, setReports] = useState([]);
  const [latestReports, setLatestReports] = useState([]);
  const [animales, setAnimales] = useState([]); // Para el dropdown de animales
  const [loadingAnimals, setLoadingAnimals] = useState(false);
  const [loadingDepartamentos, setLoadingDepartamentos] = useState(false);

  const [filteredData, setFilteredData] = useState([]);
  const [animalData, setAnimalData] = useState([]);
  const [aprobadoData, setAprobadoData] = useState([]);
  const [rechazadoData, setRechazadoData] = useState([]);

  const navigate = useNavigate();

  // -------------------------------
  // FETCH ANIMALES PARA EL DROPDOWN
  // -------------------------------
  useEffect(() => {
    const fetchAnimales = async () => {
      try {
        setLoadingAnimals(true);
        const res = await fetch("https://backend-uywa.onrender.com/animal/list");
        const json = await res.json();
        
        if (json.data && Array.isArray(json.data)) {
          // Transformar datos para el Autocomplete
          const animalesData = json.data.map(animal => ({
            id: animal.id,
            label: animal.nombre,
            ...animal
          }));
          setAnimales(animalesData);
        }
      } catch (err) {
        console.error("Error al obtener animales:", err);
      } finally {
        setLoadingAnimals(false);
      }
    };

    fetchAnimales();
  }, []);

  // -------------------------------
  // FETCH DATA REAL DEL BACKEND CON FILTROS
  // -------------------------------
  const fetchReports = async (animalId = null, departamentoId = null) => {
    try {
      let url = "https://backend-uywa.onrender.com/reportes/";
      
      // Construir URL con filtros si existen
      if (animalId || departamentoId) {
        const params = new URLSearchParams();
        if (animalId) params.append('animal_id', animalId);
        if (departamentoId) params.append('departamento_id', departamentoId);
        url = `https://backend-uywa.onrender.com/reportes/search?${params.toString()}`;
      }

      const res = await fetch(url);
      const json = await res.json();
      const all = json.data || [];

      setReports(all);
      processReportData(all);

    } catch (err) {
      console.error("Error al obtener reportes:", err);
    }
  };

  // Procesar datos de reportes
  const processReportData = (allReports) => {
    // AGRUPAR POR MES
    const groupByMonth = allReports.reduce((acc, report) => {
      const month = new Date(report.fecha_creacion).getMonth();
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const monthlyData = MONTH_NAMES.map((m, i) => ({
      month: m,
      count: groupByMonth[i] || 0,
    }));

    setFilteredData(monthlyData);

    // AGRUPAR POR ANIMAL
    const animalCounts = allReports.reduce((acc, report) => {
      const animalName = report.animal?.nombre || 'Desconocido';
      acc[animalName] = (acc[animalName] || 0) + 1;
      return acc;
    }, {});

    // Crear dataset para el gráfico de animales
    const animalDataset = Object.keys(animalCounts).map(animalName => ({
      animal: animalName,
      count: animalCounts[animalName] || 0,
    }));

    setAnimalData(animalDataset);

    // APROBADOS VS RECHAZADOS (ajustar según tus estados reales)
    const estadosCounts = (estado) =>
      allReports.reduce((acc, report) => {
        if (report.estado === estado) {
          const m = new Date(report.fecha_creacion).getMonth();
          acc[m] = (acc[m] || 0) + 1;
        }
        return acc;
      }, {});

    const aprob = estadosCounts("resuelto"); // Cambiar por tu estado de aprobado
    const rech = estadosCounts("rechazado");

    setAprobadoData(Array.from({ length: 12 }, (_, i) => aprob[i] || 0));
    setRechazadoData(Array.from({ length: 12 }, (_, i) => rech[i] || 0));

    // TABLA → ÚLTIMOS REPORTES
    setLatestReports(allReports.slice(-10).reverse());
  };

  // Cargar reportes iniciales
  useEffect(() => {
    fetchReports();
  }, []);

  // ------------------------- HANDLERS -------------------------
  const handleYearChange = (newDate) => {
    setYear(new Date(newDate).getFullYear());
    // Aquí podrías agregar lógica para filtrar por año si tu backend lo soporta
  };

  const handleChartX = (event) => {
    setChartX(event.target.value);
  };

  const handleAnimalChange = (event, newValue) => {
    setSelectedAnimal(newValue);
    fetchReports(newValue?.id, selectedDepartamento?.id);
  };

  const handleDepartamentoChange = (event, newValue) => {
    setSelectedDepartamento(newValue);
    fetchReports(selectedAnimal?.id, newValue?.id);
  };

  const clearFilters = () => {
    setSelectedAnimal(null);
    setSelectedDepartamento(null);
    fetchReports();
  };

  // ------------------------------------------------------------
  // RENDERIZADO
  // ------------------------------------------------------------
  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.searchBox}>
        
        {/* SELECTOR DE GRÁFICOS */}
        <FormControl sx={styles.searchField}>
          <InputLabel id="category-select-label">Gráfico Estadístico</InputLabel>
          <Select
            labelId="category-select-label"
            id="category-select"
            value={chartX}
            label="Gráfico Estadístico"
            onChange={handleChartX}
          >
            {CHARTERS.map(({ id, label }) => (
              <MenuItem key={id} value={id}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* SELECTOR DE ANIMAL (Search Dropdown) */}
        <Autocomplete
          sx={styles.searchField}
          options={animales}
          loading={loadingAnimals}
          value={selectedAnimal}
          onChange={handleAnimalChange}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrar por Animal"
              variant="outlined"
              placeholder="Buscar animal..."
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.id}> 
              {option.label}
            </MenuItem>
          )}
        />

        {/* SELECTOR DE DEPARTAMENTO */}
        <Autocomplete
          sx={styles.searchField}
          options={departamentos}
          loading={loadingDepartamentos}
          value={selectedDepartamento}
          onChange={handleDepartamentoChange}
          getOptionLabel={(option) => option.nombre}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Filtrar por Departamento"
              variant="outlined"
              placeholder="Buscar departamento..."
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.id}>
              {option.nombre}
            </MenuItem>
          )}
        />

        {/* SELECTOR DE AÑO */}
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

        {/* BOTÓN PARA LIMPIAR FILTROS */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {(selectedAnimal || selectedDepartamento) && (
            <Chip
              label="Limpiar filtros"
              onDelete={clearFilters}
              variant="outlined"
              sx={{ height: '56px' }}
            />
          )}
        </Box>
      </Box>

      {/* INDICADORES DE FILTROS ACTIVOS */}
      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
        {selectedAnimal && (
          <Chip
            label={`Animal: ${selectedAnimal.label}`}
            onDelete={() => handleAnimalChange(null, null)}
            color="primary"
            variant="outlined"
          />
        )}
        {selectedDepartamento && (
          <Chip
            label={`Departamento: ${selectedDepartamento.nombre}`}
            onDelete={() => handleDepartamentoChange(null, null)}
            color="secondary"
            variant="outlined"
          />
        )}
      </Box>

      {/* ------------------ GRÁFICOS ------------------ */}
      <Box style={{ width: "100%" }}>
        {chartX === 'date' && (
          <BarChart
            dataset={filteredData}
            xAxis={[{ 
              scaleType: 'band', 
              dataKey: 'month',
              label: selectedAnimal ? `Reportes de ${selectedAnimal.label}` : 'Reportes por Mes'
            }]}
            series={[{ 
              dataKey: 'count', 
              label: selectedDepartamento 
                ? `Reportes en ${selectedDepartamento.nombre}` 
                : 'Total de Reportes'
            }]}
            height={500}
          />
        )}

        {chartX === 'animal' && (
          <BarChart
            dataset={animalData}
            yAxis={[{ 
              scaleType: 'band', 
              dataKey: 'animal',
              label: 'Animales'
            }]}
            series={[{ 
              dataKey: 'count', 
              label: selectedDepartamento 
                ? `Reportes en ${selectedDepartamento.nombre}` 
                : 'Número de Reportes'
            }]}
            layout="horizontal"
            height={500}
          />
        )}

        {chartX === 'comparison' && (
          <LineChart
            xAxis={[
              {
                data: MONTH_NAMES.map((_, i) => i + 1),
                valueFormatter: (v) => MONTH_NAMES[v - 1],
                label: 'Meses'
              },
            ]}
            series={[
              { 
                data: aprobadoData, 
                label: selectedAnimal 
                  ? `${selectedAnimal.label} - Resueltos` 
                  : 'Reportes Resueltos' 
              },
              { 
                data: rechazadoData, 
                label: selectedAnimal 
                  ? `${selectedAnimal.label} - Rechazados` 
                  : 'Reportes Rechazados' 
              },
            ]}
            height={500}
          />
        )}
      </Box>

      {/* ------------------ TABLA ------------------ */}
      <TableContainer component={Paper} sx={{ marginY: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre Reportante</TableCell>
              <TableCell>Animal</TableCell>
              <TableCell>Departamento</TableCell>
              <TableCell>Fecha Creación</TableCell>
              <TableCell>Estado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {latestReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.id}</TableCell>
                <TableCell>
                  {report.usuario?.nombres} {report.usuario?.apellidos}
                </TableCell>
                <TableCell>{report.animal?.nombre}</TableCell>
                <TableCell>{report.evidencia?.departamento?.nombre}</TableCell>
                <TableCell>
                  {new Date(report.fecha_creacion).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip 
                    label={report.estado} 
                    color={
                      report.estado === 'resuelto' ? 'success' : 
                      report.estado === 'rechazado' ? 'error' : 
                      'warning'
                    }
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* RESUMEN DE FILTROS */}
      <Box sx={{ 
        p: 2, 
        mb: 3, 
        backgroundColor: '#f5f5f5', 
        borderRadius: 1,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <strong>Resumen:</strong>
          <Box component="span" ml={1}>
            Total de reportes: {reports.length}
            {selectedAnimal && ` | Animal filtrado: ${selectedAnimal.label}`}
            {selectedDepartamento && ` | Departamento: ${selectedDepartamento.nombre}`}
          </Box>
        </Box>
        <Button 
          variant="outlined" 
          size="small"
          onClick={clearFilters}
          disabled={!selectedAnimal && !selectedDepartamento}
        >
          Limpiar todo
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" padding="1.5rem" mt="auto">
        <Button variant="contained" color="primary" onClick={() => navigate('/moderador')}>
          Volver
        </Button>
      </Box>
    </Container>
  );
};

export default Reportes;