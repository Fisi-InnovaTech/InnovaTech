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
  Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { BarChart, LineChart } from '@mui/x-charts';
import { DemoItem } from '@mui/x-date-pickers/internals/demo';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { styles } from '../components/Estadistica/StatisticsStyle';
import dayjs from 'dayjs';
export const ANIMAL_OPTIONS = [
  { animal: 'Perro' },
  { animal: 'Gato' },
  { animal: 'Caballo' },
  { animal: 'Vaca' },
  { animal: 'Oveja' },
  { animal: 'Cerdo' },
  { animal: 'Gallina' },
  { animal: 'Conejo' }
];

export const MONTH_NAMES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
];

// ❌ Región eliminado del menú
export const CHARTERS = [
  { id: 'date', label: 'Reportes por Fechas' },
  { id: 'animal', label: 'Reportes por Animales' },
  { id: 'comparison', label: 'Comparación de Reportes' }
];

const Reportes = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [chartX, setChartX] = useState(CHARTERS[0].id);

  const [reports, setReports] = useState([]);
  const [latestReports, setLatestReports] = useState([]);

  const [filteredData, setFilteredData] = useState([]);
  const [animalData, setAnimalData] = useState([]);
  const [aprobadoData, setAprobadoData] = useState([]);
  const [rechazadoData, setRechazadoData] = useState([]);

  const navigate = useNavigate();

  // -------------------------------
  // FETCH DATA REAL DEL BACKEND
  // -------------------------------
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch("http://127.0.0.1:3000/reportes/");
        const json = await res.json();
        const all = json.data;

        setReports(all);

        // -------------------------
        // AGRUPAR POR MES
        // -------------------------
        const groupByMonth = all.reduce((acc, report) => {
          const month = new Date(report.fecha_creacion).getMonth();
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {});

        const monthlyData = MONTH_NAMES.map((m, i) => ({
          month: m,
          count: groupByMonth[i] || 0,
        }));

        setFilteredData(monthlyData);

        // -------------------------
        // AGRUPAR POR ANIMAL
        // -------------------------
        const animalCounts = all.reduce((acc, report) => {
          const animal = report.animal_nombre;
          acc[animal] = (acc[animal] || 0) + 1;
          return acc;
        }, {});

        const animalDataset = ANIMAL_OPTIONS.map(({ animal }) => ({
          animal,
          count: animalCounts[animal] || 0,
        }));

        setAnimalData(animalDataset);

        // -------------------------
        // APROBADOS VS RECHAZADOS
        // -------------------------
        const estadosCounts = (estado) =>
          all.reduce((acc, report) => {
            if (report.estado === estado) {
              const m = new Date(report.fecha_creacion).getMonth();
              acc[m] = (acc[m] || 0) + 1;
            }
            return acc;
          }, {});

        const aprob = estadosCounts("aprobado");
        const rech = estadosCounts("rechazado");

        setAprobadoData(Array.from({ length: 12 }, (_, i) => aprob[i] || 0));
        setRechazadoData(Array.from({ length: 12 }, (_, i) => rech[i] || 0));

        // -------------------------
        // TABLA → ÚLTIMOS REPORTES
        // -------------------------
        setLatestReports(all.slice(-10).reverse());

      } catch (err) {
        console.error("Error al obtener reportes:", err);
      }
    };

    fetchReports();
  }, []);

  // ------------------------- HANDLERS -------------------------
  const handleYearChange = (newDate) => {
    setYear(new Date(newDate).getFullYear());
  };

  const handleChartX = (event) => {
    setChartX(event.target.value);
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
      </Box>

      {/* ------------------ GRÁFICOS ------------------ */}
      <Box style={{ width: "100%" }}>
        {chartX === 'date' && (
          <BarChart
            dataset={filteredData}
            xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
            series={[{ dataKey: 'count', label: 'Reportes por Mes' }]}
            height={500}
          />
        )}

        {chartX === 'animal' && (
          <BarChart
            dataset={animalData}
            yAxis={[{ scaleType: 'band', dataKey: 'animal' }]}
            series={[{ dataKey: 'count', label: 'Reportes por Animal' }]}
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
              },
            ]}
            series={[
              { data: aprobadoData, label: 'Aprobados' },
              { data: rechazadoData, label: 'Rechazados' },
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
