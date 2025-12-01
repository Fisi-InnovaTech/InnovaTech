import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Modal,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthStore } from "../auth/store/authStore";

const backendURL = "http://localhost:3000/eventos";

const categorias = [
  "conservacion",
  "educacion",
  "investigacion",
  "turismo",
  "gastronomia",
  "cultura",
  "deporte",
  "tecnologia",
  "otro"
];

// Función para obtener el ID del usuario autenticado desde localStorage
const getAuthenticatedUserId = async () => {
  try {
    // Obtener token del localStorage
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) throw new Error('No hay sesión activa');
    
    const parsed = JSON.parse(authStorage);
    const token = parsed?.state?.token;
    
    if (!token) throw new Error('Token no disponible');
    
    // Verificar token para obtener el ID
    const response = await fetch(`http://localhost:3000/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Token inválido');
    }
    
    const data = await response.json();
    if (data.valid && data.user?.id) {
      return data.user.id;
    } else {
      throw new Error('Usuario no válido');
    }
  } catch (error) {
    console.error('Error obteniendo ID de usuario:', error);
    throw error;
  }
};

export default function Blog() {
  const { user, getUserRole } = useAuthStore();
  const userRole = getUserRole();
  const hasAdminPermissions = userRole === "moderador" || userRole === "admin";

  const [eventos, setEventos] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID del usuario

  // Snackbar
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: "", 
    severity: "success" 
  });

  // Modales
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    categoria: "",
    lugar: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [eventToDelete, setEventToDelete] = useState("");
  const [eventToUpdate, setEventToUpdate] = useState("");

  // ================================
  // SNACKBAR
  // ================================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ================================
  // FETCH EVENTOS
  // ================================
  const fetchEventos = async () => {
    try {
      setLoading(true);
      const response = await fetch(backendURL);

      if (!response.ok) {
        throw new Error("Error al obtener los eventos");
      }

      const json = await response.json();
      setEventos(json.data);
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // OBTENER ID DEL USUARIO
  // ================================
  const fetchUserId = async () => {
    try {
      const id = await getAuthenticatedUserId();
      setUserId(id);
    } catch (error) {
      console.warn("No se pudo obtener el ID del usuario:", error.message);
      // Si no se puede obtener el ID, intentamos usar el del store
      if (user?.id) {
        setUserId(user.id);
      }
    }
  };

  useEffect(() => {
    fetchEventos();
    if (hasAdminPermissions) {
      fetchUserId();
    }
  }, []);

  // Actualizar userId cuando cambia el usuario
  useEffect(() => {
    if (hasAdminPermissions && user?.id) {
      setUserId(user.id);
    }
  }, [user, hasAdminPermissions]);

  // ================================
  // MANEJO DE IMAGEN
  // ================================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setForm({
      titulo: "",
      descripcion: "",
      fecha: "",
      categoria: "",
      lugar: ""
    });
    setImageFile(null);
    setImagePreview(null);
  };

  // ================================
  // AGREGAR EVENTO
  // ================================
  const guardarEvento = async () => {
    try {
      if (!form.titulo || !form.descripcion || !form.fecha || !form.categoria || !form.lugar) {
        showSnackbar("Por favor completa todos los campos", "warning");
        return;
      }

      // Obtener el ID del usuario si no está disponible
      let finalUserId = userId;
      if (!finalUserId) {
        try {
          finalUserId = await getAuthenticatedUserId();
        } catch (error) {
          showSnackbar("No se pudo identificar al usuario. Por favor, inicia sesión nuevamente.", "error");
          return;
        }
      }

      if (!finalUserId) {
        showSnackbar("Usuario no identificado. Inicia sesión nuevamente.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("descripcion", form.descripcion);
      formData.append("fecha", form.fecha);
      formData.append("categoria", form.categoria);
      formData.append("lugar", form.lugar);
      formData.append("usuarioId", finalUserId.toString());

      if (imageFile) {
        formData.append("imagen_url", imageFile);
      }

      // DEBUG: Mostrar datos que se envían
      console.log("Enviando datos al backend:");
      console.log("usuarioId:", finalUserId);
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, typeof value === 'object' ? `[File: ${value.name}]` : value);
      }

      const response = await fetch(backendURL, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al crear el evento: ${response.status} ${response.statusText}`);
      }

      showSnackbar("Evento creado exitosamente", "success");
      setOpenAdd(false);
      resetForm();
      await fetchEventos();

    } catch (error) {
      console.error("Error completo:", error);
      showSnackbar(error.message, "error");
    }
  };

  // ================================
  // ELIMINAR EVENTO
  // ================================
  const confirmarEliminar = async () => {
    try {
      const response = await fetch(`${backendURL}/${eventToDelete}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el evento");
      }

      showSnackbar("Evento eliminado exitosamente", "success");
      setOpenDelete(false);
      setEventToDelete("");
      await fetchEventos();

    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  // ================================
  // ACTUALIZAR EVENTO
  // ================================
  const cargarEventoActualizar = (id) => {
    const ev = eventos.find((e) => e.id === Number(id));
    if (ev) {
      setForm({
        titulo: ev.titulo,
        descripcion: ev.descripcion,
        fecha: ev.fecha.split('T')[0],
        categoria: ev.categoria,
        lugar: ev.lugar
      });
      setImagePreview(ev.imagen_url);
    }
  };

  const guardarActualizacion = async () => {
    try {
      if (!form.titulo || !form.descripcion || !form.fecha || !form.categoria || !form.lugar) {
        showSnackbar("Por favor completa todos los campos", "warning");
        return;
      }

      const formData = new FormData();
      formData.append("titulo", form.titulo);
      formData.append("description", form.descripcion);
      formData.append("fecha", form.fecha);
      formData.append("categoria", form.categoria);
      formData.append("lugar", form.lugar);

      if (imageFile) {
        formData.append("imagen_url", imageFile);
      }

      // DEBUG: Mostrar datos que se envían
      console.log("Actualizando evento - datos enviados:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, typeof value === 'object' ? `[File: ${value.name}]` : value);
      }

      const response = await fetch(`${backendURL}/${eventToUpdate}`, {
        method: "PATCH",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al actualizar el evento: ${response.status} ${response.statusText}`);
      }

      showSnackbar("Evento actualizado exitosamente", "success");
      setOpenUpdate(false);
      setEventToUpdate("");
      resetForm();
      await fetchEventos();

    } catch (error) {
      console.error("Error completo:", error);
      showSnackbar(error.message, "error");
    }
  };

  // ================================
  // BUSCADOR
  // ================================
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventos;

    return eventos.filter((ev) =>
      `${ev.titulo} ${ev.descripcion} ${ev.categoria} ${ev.lugar}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, eventos]);

  const handleOpen = (ev) => setSelectedEvent(ev);
  const handleClose = () => setSelectedEvent(null);

  return (
    <Box sx={{ pt: "95px", pb: 6, px: { xs: 2, sm: 4, md: 6 } }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "700", color: "#3AB795", textAlign: "center", mb: 3 }}
      >
        Blog de Eventos
      </Typography>

      {/* BUSCADOR */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar eventos..."
          variant="outlined"
          size="small"
          sx={{
            width: { xs: "100%", sm: "520px" },
            background: "#fff",
            borderRadius: "12px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#3AB795" }} />
              </InputAdornment>
            )
          }}
        />
      </Box>

      {/* BOTONES - Solo visible para moderadores y admins */}
      {hasAdminPermissions && (
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button
            onClick={() => setOpenAdd(true)}
            variant="contained"
            sx={{ background: "#3AB795", borderRadius: "12px", fontWeight: 600 }}
          >
            Agregar
          </Button>

          <Button
            onClick={() => setOpenDelete(true)}
            variant="outlined"
            sx={{
              borderColor: "#d9534f",
              color: "#d9534f",
              borderRadius: "12px",
              fontWeight: 600
            }}
          >
            Eliminar
          </Button>

          <Button
            onClick={() => setOpenUpdate(true)}
            variant="outlined"
            sx={{
              borderColor: "#3A6FB7",
              color: "#3A6FB7",
              borderRadius: "12px",
              fontWeight: 600
            }}
          >
            Actualizar
          </Button>
        </Box>
      )}

      {/* GRID */}
      {loading ? (
        <Typography sx={{ textAlign: "center", mt: 4 }}>Cargando eventos...</Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {filtered.map((ev) => (
            <Grid item xs={12} sm={6} md={4} key={ev.id}>
              <Card
                onClick={() => handleOpen(ev)}
                sx={{
                  cursor: "pointer",
                  borderRadius: "14px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                  transition: "transform .18s",
                  "&:hover": { transform: "translateY(-6px)" },
                  height: "300px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <CardMedia
                  component="img"
                  image={ev.imagen_url}
                  sx={{ height: "160px", objectFit: "cover" }}
                />
                <CardContent
                  sx={{ flex: 1, display: "flex", alignItems: "center" }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      fontWeight: 600,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}
                  >
                    {ev.titulo}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL DETALLE */}
      <Modal open={Boolean(selectedEvent)} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", sm: "500px" },
            bgcolor: "white",
            p: 3,
            borderRadius: "16px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>

          {selectedEvent && (
            <>
              <CardMedia
                component="img"
                image={selectedEvent.imagen_url}
                sx={{ borderRadius: "12px", height: 220, mb: 2 }}
              />

              <Typography variant="h5" sx={{ fontWeight: 700, color: "#3AB795" }}>
                {selectedEvent.titulo}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Descripción:</strong> {selectedEvent.descripcion}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Fecha:</strong> {new Date(selectedEvent.fecha).toLocaleDateString()}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Lugar:</strong> {selectedEvent.lugar}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Categoría:</strong> {selectedEvent.categoria}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Creado por:</strong> {selectedEvent.usuario?.nombres} {selectedEvent.usuario?.apellidos}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* MODAL AGREGAR */}
      {hasAdminPermissions && (
        <>
          <Modal open={openAdd} onClose={() => { setOpenAdd(false); resetForm(); }}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "92%", sm: "480px" },
                bgcolor: "white",
                p: 3,
                borderRadius: "16px",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Agregar Evento
              </Typography>

              <TextField
                label="Título"
                fullWidth
                sx={{ mb: 2 }}
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />

              <TextField
                label="Descripción"
                fullWidth
                multiline
                rows={3}
                sx={{ mb: 2 }}
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              />

              <TextField
                label="Fecha"
                type="date"
                fullWidth
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                value={form.fecha}
                onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={form.categoria}
                  label="Categoría"
                  onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                >
                  {categorias.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Lugar"
                fullWidth
                sx={{ mb: 2 }}
                value={form.lugar}
                onChange={(e) => setForm({ ...form, lugar: e.target.value })}
              />

              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ mb: 2 }}
              >
                Subir Imagen
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>

              {imagePreview && (
                <Box sx={{ mb: 2, textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                  />
                </Box>
              )}

              <Button
                fullWidth
                variant="contained"
                sx={{ background: "#3AB795" }}
                onClick={guardarEvento}
              >
                Guardar
              </Button>
            </Box>
          </Modal>

          {/* MODAL ELIMINAR */}
          <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "92%", sm: "420px" },
                bgcolor: "white",
                p: 3,
                borderRadius: "16px"
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Eliminar Evento
              </Typography>

              <TextField
                select
                label="Seleccionar evento"
                fullWidth
                sx={{ mb: 3 }}
                value={eventToDelete}
                onChange={(e) => setEventToDelete(e.target.value)}
              >
                {eventos.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.titulo}
                  </MenuItem>
                ))}
              </TextField>

              <Button
                fullWidth
                variant="contained"
                sx={{ background: "#d9534f" }}
                onClick={confirmarEliminar}
                disabled={!eventToDelete}
              >
                Eliminar
              </Button>
            </Box>
          </Modal>

          {/* MODAL ACTUALIZAR */}
          <Modal open={openUpdate} onClose={() => { setOpenUpdate(false); resetForm(); setEventToUpdate(""); }}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: { xs: "92%", sm: "480px" },
                bgcolor: "white",
                p: 3,
                borderRadius: "16px",
                maxHeight: "90vh",
                overflowY: "auto"
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
                Actualizar Evento
              </Typography>

              <TextField
                select
                label="Seleccionar evento"
                fullWidth
                sx={{ mb: 3 }}
                value={eventToUpdate}
                onChange={(e) => {
                  setEventToUpdate(e.target.value);
                  cargarEventoActualizar(e.target.value);
                }}
              >
                {eventos.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>
                    {ev.titulo}
                  </MenuItem>
                ))}
              </TextField>

              {eventToUpdate && (
                <>
                  <TextField
                    label="Título"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.titulo}
                    onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                  />

                  <TextField
                    label="Descripción"
                    fullWidth
                    multiline
                    rows={3}
                    sx={{ mb: 2 }}
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  />

                  <TextField
                    label="Fecha"
                    type="date"
                    fullWidth
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                    value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Categoría</InputLabel>
                    <Select
                      value={form.categoria}
                      label="Categoría"
                      onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                    >
                      {categorias.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="Lugar"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.lugar}
                    onChange={(e) => setForm({ ...form, lugar: e.target.value })}
                  />

                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    Cambiar Imagen
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </Button>

                  {imagePreview && (
                    <Box sx={{ mb: 2, textAlign: "center" }}>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                      />
                    </Box>
                  )}

                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ background: "#3A6FB7" }}
                    onClick={guardarActualizacion}
                  >
                    Guardar Cambios
                  </Button>
                </>
              )}
            </Box>
          </Modal>
        </>
      )}

      {/* SNACKBAR */}
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
    </Box>
  );
}