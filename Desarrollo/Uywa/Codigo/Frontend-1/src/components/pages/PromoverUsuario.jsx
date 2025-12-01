import { useState, useEffect } from "react";
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
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { styles } from '../../components/pages/PromoverUsuario';

const backendURL = "https://backend-uywa.onrender.com";

const PromoverUsuario = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [goToPage, setGoToPage] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  // Estados para el modal de confirmación de eliminación
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const usersPerPage = 10;

  // ========================= FETCH USERS =========================
  const fetchUsers = async () => {
    try {
      const res = await fetch(backendURL);
      if (!res.ok) throw new Error("Error al obtener los usuarios");

      const json = await res.json();
      const data = json.data || json; // el backend puede enviar "data" o array directo

      setUsers(data);
      setFilteredUsers(data);

    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ========================= SNACKBAR =========================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ========================= ELIMINAR USUARIO =========================
  const handleOpenDeleteDialog = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeleting(true);
      const res = await fetch(`${backendURL}/${userToDelete.id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error al eliminar el usuario: ${res.status} ${res.statusText}`);
      }

      showSnackbar("Usuario eliminado correctamente", "success");
      
      // Actualizar la lista de usuarios
      await fetchUsers();
      
      // Cerrar el diálogo
      handleCloseDeleteDialog();

    } catch (err) {
      showSnackbar(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  // ========================= PATCH ROL =========================
  const updateRole = async (id, newRoleId) => {
    try {
      const res = await fetch(
        `${backendURL}/rol/${id}?rolId=${newRoleId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" }
        }
      );

      if (!res.ok) throw new Error("No se pudo actualizar el rol");

      showSnackbar("Rol actualizado correctamente", "success");
      await fetchUsers(); // actualizar tabla

    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  // ========================= BUSQUEDA =========================
  useEffect(() => {
    const term = searchTerm.toLowerCase();

    const filtered = users.filter(u =>
      u.nombres?.toLowerCase().includes(term) ||
      u.apellidos?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );

    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  // ========================= PAGINACIÓN =========================
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers =
    filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const handleGoToPageClick = () => {
    const pageNumber = parseInt(goToPage, 10);
    if (pageNumber > 0 && pageNumber <= pageCount) {
      setCurrentPage(pageNumber);
    } else {
      showSnackbar("Número de página inválido", "error");
    }
  };

  // ========================= ROLES =========================
  const getRoleName = (rolId) => {
    switch (Number(rolId)) {
      case 1: return "Usuario";
      case 2: return "Moderador";
      case 3: return "Administrador";
      default: return "Desconocido";
    }
  };

  const getRoleColor = (rolId) => {
    switch (Number(rolId)) {
      case 1: return "#3AB795"; // user
      case 2: return "#F9C22E"; // mod
      case 3: return "#E52F60"; // admin
      default: return "#DDE2E5";
    }
  };

  return (
    <Container maxWidth="lg" sx={styles.container}>

      {/* ========================= SEARCH ========================= */}
      <Box sx={styles.searchBox}>

        <TextField
          label="Buscar usuario"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={styles.searchField}
          placeholder="Buscar por nombre o correo"
        />

        <Button 
          variant="contained"
          sx={styles.searchIcon}
          startIcon={<SearchIcon />}
        >
          Buscar
        </Button>

      </Box>

      {/* ========================= TABLA ========================= */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">ID</TableCell>
              <TableCell align="center">Usuario</TableCell>
              <TableCell align="center">Correo</TableCell>
              <TableCell align="center">Rol</TableCell>
              <TableCell align="center">Cambiar Rol</TableCell>
              <TableCell align="center">Eliminar</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedUsers.map(user => (
              <TableRow key={user.id}>
                
                <TableCell align="center">{user.id}</TableCell>

                <TableCell align="center">
                  {user.nombres} {user.apellidos}
                </TableCell>

                <TableCell align="center">{user.email}</TableCell>

                {/* ROL */}
                <TableCell align="center">
                  <Typography sx={{
                    backgroundColor: getRoleColor(user.rolId),
                    borderRadius: "15px",
                    padding: "5px 15px",
                    color: "white",
                    display: "inline-block",
                    width: "140px",
                    textAlign: "center"
                  }}>
                    {getRoleName(user.rolId)}
                  </Typography>
                </TableCell>

                {/* SELECT PARA CAMBIAR ROL */}
                <TableCell align="center">
                  <FormControl size="small" sx={{ minWidth: 140 }}>
                    <Select
                      value={user.rolId}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                    >
                      <MenuItem value={1}>Usuario</MenuItem>
                      <MenuItem value={2}>Moderador</MenuItem>
                      <MenuItem value={3}>Administrador</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>

                {/* BOTÓN ELIMINAR */}
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleOpenDeleteDialog(user)}
                    title="Eliminar usuario"
                    disabled={user.rolId === 3} // Opcional: deshabilitar si es admin
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      {/* ========================= PAGINACIÓN ========================= */}
      <Box sx={styles.paginationBox}>
        
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Typography variant="body2">Ir a la página:</Typography>

          <TextField
            value={goToPage}
            onChange={(e) => setGoToPage(e.target.value)}
            type="number"
            sx={styles.goToPageField}
          />

          <Button variant="contained" onClick={handleGoToPageClick}>
            Ir
          </Button>
        </Box>

        <Pagination
          count={pageCount}
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* ========================= BOTÓN VOLVER ========================= */}
      <Button 
        variant="contained" 
        color="primary" 
        sx={{ mt: 3 }} 
        onClick={() => navigate('/moderador')}
      >
        Volver
      </Button>

      {/* ========================= MODAL DE CONFIRMACIÓN PARA ELIMINAR ========================= */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirmar Eliminación
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete?.nombres} {userToDelete?.apellidos}</strong> ({userToDelete?.email})?
            <br />
            <br />
            <strong>Esta acción no se puede deshacer.</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseDeleteDialog} 
            disabled={deleting}
            color="primary"
          >
            Cancelar
          </Button>
          <Button 
            onClick={deleteUser} 
            disabled={deleting}
            color="error"
            variant="contained"
            autoFocus
            startIcon={<DeleteIcon />}
          >
            {deleting ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================= SNACKBAR ========================= */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default PromoverUsuario;