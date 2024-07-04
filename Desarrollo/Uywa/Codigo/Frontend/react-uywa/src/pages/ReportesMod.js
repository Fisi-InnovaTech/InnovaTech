// src/pages/Reportes.jsx
import React, { useState, useEffect } from "react";
import { 
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button,
  TextField,
  Pagination,
  Collapse
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import VisibilitySharpIcon from '@mui/icons-material/VisibilitySharp';
import { styles } from '../components/Reportes/ReportesStyle';

const mockReports = [
  { 
    id: 1,
    animal_nombre: "Animal",
    evidencia_imagen: "image.jpg",
    descripcion: "Found a stray animal",
    estado: "pendiente",
    usuario: {
      nombre: "user"
    } 
  },
];

const Reportes = () => {
  const [reports, setReports] = useState(mockReports);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReport, setExpandedReport] = useState(null);
  const [goToPage, setGoToPage] = useState("");
  const [filteredReports, setFilteredReports] = useState(mockReports);

  const reportsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const cargarMarcadores = async () => {
      try {
        const reportes = await fetch('https://innovatech-0rui.onrender.com/alertas/allalerts');
        if (reportes.ok) {
          const data = await reportes.json();
          setReports(data);
          setFilteredReports(data);
        } else {
          console.log("Error al buscar back, status: ", reportes.status);
        }
      } catch (error) {
        console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
      }
    };

    cargarMarcadores();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeState(report) {
    try {
      const reportes = await fetch('https://innovatech-0rui.onrender.com/alertas/changingState',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: report.id, estado: report.estado })
      });
      if (!reportes.ok) {
        console.log("Error al buscar back, no se pudo cambiar el estado: ", reportes.status);
      }
    } catch (error) {
      console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
  };

  const handleGoToPageChange = (event) => {
    setGoToPage(event.target.value);
  };

  const handleGoToPageClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= Math.ceil(filteredReports.length / reportsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };
  const handleClick = () => {
  const filteredReports = reports.filter(report =>
    report.usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.animal_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredReports(filteredReports);
  setCurrentPage(1);
  }

  const paginatedReports = filteredReports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage);

  const toggleReport = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  const handleState = (reportId, newEstado) => {
    const updatedReports = reports.map((report) => {
      if (report.id === reportId) {
        const newReport = { ...report, estado: newEstado };
        changeState(newReport)
        return newReport;
      }
      return report;
    
    });
    setFilteredReports(updatedReports);
  };
  
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'aprobado':
        return '#3AB795';
      case 'rechazado':
        return '#E52F60';
      case 'pendiente':
        return '#F9C22E';
      default:
        return '#DDE2E5';
    }
  };

  const pageCount = Math.ceil(filteredReports.length / reportsPerPage);

  return (
    <Container maxWidth="lg" sx={styles.container}>
      <Box sx={styles.searchBox}>
        <TextField
          label="Buscar"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={styles.searchField}
        />
        <Button
          variant="contained"
          className="send-button" 
          sx={styles.searchIcon}
          onClick={handleClick}
        >
          <SearchIcon/>
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>

          <TableHead>
            <TableRow>
              <TableCell sx={{textAlign: "center"}}>ID</TableCell>
              <TableCell sx={{textAlign: "center"}}>Usuario</TableCell>
              <TableCell sx={{textAlign: "center"}}>Animal</TableCell>
              <TableCell sx={{textAlign: "center"}}>Estado</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedReports.map((report) => (
              <React.Fragment key={report.id}>
                <TableRow>
                  <TableCell sx={{textAlign: "center"}}>{report.id}</TableCell>
                  <TableCell sx={{textAlign: "center"}}>{report.usuario.nombre}</TableCell>
                  <TableCell sx={{textAlign: "center"}}>{report.animal_nombre}</TableCell>
                  <TableCell sx={{textAlign: "center"}}><Typography variant="small" sx={{backgroundColor: getEstadoColor(report.estado), borderRadius:"15px", paddingY:"5px", paddingX:"15px", display: "inline-block", width:"80px", color:"white"}}>{report.estado}</Typography></TableCell>
                  <TableCell sx={{textAlign: "right"}}>
                    <Button sx={styles.visibilityIcon} onClick={() => toggleReport(report.id)}>
                      <VisibilitySharpIcon sx={{ color: 'white' }}/>
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedReport === report.id && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Collapse in={expandedReport === report.id}>
                        <Container sx={styles.expandedContent}>
                          <Box sx={styles.expandedBox}>
                            <Typography sx={styles.description_report}>{report.descripcion}</Typography>
                            <img src={report.evidencia_imagen} alt={report.animal_nombre} style={styles.image} />
                          </Box>
                          <Box sx={{display:"flex", gap:"20px"}}>
                            <Button variant="contained" sx={styles.actionButton} onClick={() => handleState(report.id, "aprobado")}>Aceptar</Button>
                            <Button variant="contained" sx={styles.actionButton} onClick={() => handleState(report.id, "rechazado")}>Rechazar</Button>
                          </Box>
                        </Container>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={styles.paginationBox}>
        <Box sx={{display: "flex", alignItems:"center", gap:"10px"}}>
          <Typography variant="body2">
            Ir a la página:
          </Typography>
          <TextField value={goToPage} onChange={handleGoToPageChange} sx={styles.goToPageField} />
          <Button variant="contained" onClick={handleGoToPageClick} >
            Ir
          </Button>
        </Box>
        <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} />
      </Box>
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }} 
        onClick={() => navigate('/moderador')}
      >
        Volver
      </Button>
    </Container>

  );
};

export default Reportes;
