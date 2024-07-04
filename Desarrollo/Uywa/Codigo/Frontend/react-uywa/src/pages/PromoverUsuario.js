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
  Pagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { styles } from '../components/Promover/StylesPromover';

const MisLogros = [
  { logro: 'Bienvenido a Uywa' },
  { logro: 'Primeros Pasos' },
  { logro: 'Amante de los animales' },
  { logro: 'Guardián de la naturaleza' },
  { logro: 'Protector de la biósfera' },
];

const Reportes = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [filteredReports, setFilteredReports] = useState([]);

  const reportsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const cargarMarcadores = async () => {
      try {
        const reportes = await fetch('https://innovatech-0rui.onrender.com/auth/allusers');
        if (reportes.ok) {
          const datas = await reportes.json();
          const filteredData = datas.filter(report => Number(report.insignia) < 5);
          setReports(filteredData);
          setFilteredReports(filteredData);
        } else {
          console.log("Error al buscar back, status: ", reportes.status);
        }
      } catch (error) {
        console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
      }
    };

    cargarMarcadores();
  }, []);

  async function upgradeModerator(userId) {
    try {
      const response = await fetch(`https://innovatech-0rui.onrender.com/auth/promoverUser/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        console.log("Error al buscar back, no se pudo cambiar el estado: ", response.status);
      } else {
        const updatedReports = reports.filter(report => report.id !== userId);
        setReports(updatedReports);
        setFilteredReports(updatedReports);
      }
    } catch (error) {
      console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
    }
  }

  async function changeInsignia(userId) {
    try {
      const response = await fetch(`https://innovatech-0rui.onrender.com/auth/promover/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        console.log("Error al buscar back, no se pudo cambiar el estado: ", response.status);
      } else {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log("Error al conectarse con el back: ", error.message || "Error desconocido");
    }
  }

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
      report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.insignia.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReports(filteredReports);
    setCurrentPage(1);
  }

  const handleState = async (reportId) => {
    try {
      const updatedReports = await Promise.all(reports.map(async (report) => {
        if (report.id === reportId) {
          if (Number(report.insignia) === 4) {
            await upgradeModerator(reportId);
            return null;
          }
          await changeInsignia(reportId);
          const newInsignia = Number(report.insignia) + 1;
          return { ...report, insignia: newInsignia.toString() };
        }
        return report;
      }));

      const filteredUpdatedReports = updatedReports.filter(report => report !== null);

      setReports(filteredUpdatedReports);
      setFilteredReports(filteredUpdatedReports);
    } catch (error) {
      console.log("Error al actualizar estado:", error.message);
    }
  };

  const paginatedReports = filteredReports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage);

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
              <TableCell sx={{textAlign: "center"}}>Correo</TableCell>
              <TableCell sx={{textAlign: "center"}}>Insignia</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedReports.map((report) => (
              <React.Fragment key={report.id}>
                <TableRow>
                  <TableCell sx={{textAlign: "center"}}>{report.id}</TableCell>
                  <TableCell sx={{textAlign: "center"}}>{report.nombre}</TableCell>
                  <TableCell sx={{textAlign: "center"}}>{report.correo}</TableCell>
                  <TableCell sx={{textAlign: "center"}}>
                    <Typography variant="small" sx={{backgroundColor: '#3AB795', borderRadius:"15px", paddingY:"5px", paddingX:"15px", display: "inline-block", width:"100px", color:"white"}}>
                      {MisLogros[Number(report.insignia)-1].logro}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{textAlign: "right"}}>
                    <Button sx={styles.visibilityIcon} onClick={() => handleState(report.id)}>
                      Promover
                    </Button>
                  </TableCell>
                </TableRow>
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
