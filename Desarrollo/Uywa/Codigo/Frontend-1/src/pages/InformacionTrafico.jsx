import React, { useState, useMemo } from "react";
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
  MenuItem
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

// ---------------------------------
// DATA — EVENTOS (FALSA, PERO COMPLETA)
// ---------------------------------
const initialEvents = [
  {
    id: 1,
    titulo: "Festival Gastronómico del Sur",
    descripcion:
      "Evento culinario con participación de chefs reconocidos y comida típica del sur del Perú.",
    fecha: "2025-02-18",
    imagen_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    user_id: 21,
    categoria: "Gastronomía",
    lugar: "Arequipa",
    usuario: "Carlos Mendoza",
    fecha_creacion: "2025-01-10"
  },
  {
    id: 2,
    titulo: "Concierto Sinfónico Andino",
    descripcion:
      "Una presentación musical que mezcla instrumentos clásicos con sonidos andinos tradicionales.",
    fecha: "2025-03-02",
    imagen_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    user_id: 12,
    categoria: "Música",
    lugar: "Cusco",
    usuario: "María Torres",
    fecha_creacion: "2025-01-15"
  },
  {
    id: 3,
    titulo: "Expo Innovación Tecnológica 2025",
    descripcion:
      "Exposición que reúne startups y empresas para mostrar avances en tecnología e IA.",
    fecha: "2025-04-10",
    imagen_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    user_id: 33,
    categoria: "Tecnología",
    lugar: "Lima",
    usuario: "Ana Rodríguez",
    fecha_creacion: "2025-01-20"
  },
  {
    id: 4,
    titulo: "Maratón Costa Verde",
    descripcion:
      "Competencia deportiva anual abierta al público con circuitos de 10K, 21K y 42K.",
    fecha: "2025-05-05",
    imagen_url:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    user_id: 18,
    categoria: "Deporte",
    lugar: "Lima",
    usuario: "Jorge Silva",
    fecha_creacion: "2025-01-25"
  }
];

export default function Blog() {
  const [eventos, setEventos] = useState(initialEvents);
  const [query, setQuery] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ------------------------
  // MODALES
  // ------------------------
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    imagen_url: "",
    user_id: "",
    categoria: "",
    lugar: "",
    usuario: "",
    fecha_creacion: ""
  });

  const [eventToDelete, setEventToDelete] = useState("");

  const handleOpen = (ev) => setSelectedEvent(ev);
  const handleClose = () => setSelectedEvent(null);

  // ------------------------
  // GUARDAR NUEVO EVENTO
  // ------------------------
  const guardarEvento = () => {
    const nuevo = {
      id: eventos.length + 1,
      ...form
    };

    setEventos([...eventos, nuevo]);

    setOpenAdd(false);
    setForm({
      titulo: "",
      descripcion: "",
      fecha: "",
      imagen_url: "",
      user_id: "",
      categoria: "",
      lugar: "",
      usuario: "",
      fecha_creacion: ""
    });
  };

  // ------------------------
  // ELIMINAR EVENTO
  // ------------------------
  const confirmarEliminar = () => {
    setEventos(eventos.filter((e) => e.id !== Number(eventToDelete)));
    setOpenDelete(false);
    setEventToDelete("");
  };

  // ------------------------
  // BUSCADOR
  // ------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventos;

    return eventos.filter((e) => {
      return (
        e.titulo.toLowerCase().includes(q) ||
        e.descripcion.toLowerCase().includes(q) ||
        e.categoria.toLowerCase().includes(q) ||
        e.lugar.toLowerCase().includes(q)
      );
    });
  }, [query, eventos]);

  return (
    <Box
      sx={{
        pt: "95px",
        pb: 6,
        px: { xs: 2, sm: 4, md: 6 },
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "700",
          color: "#3AB795",
          textAlign: "center",
          mb: 3
        }}
      >
        Eventos del Perú
      </Typography>

      {/* BUSCADOR */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, descripción, categoría o lugar..."
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

      {/* BOTONES */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 2,
          mb: 4
        }}
      >
        <Button
          onClick={() => setOpenAdd(true)}
          variant="contained"
          sx={{
            background: "#3AB795",
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
            ":hover": { background: "#34a786" }
          }}
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
            textTransform: "none",
            fontWeight: 600,
            ":hover": {
              borderColor: "#b43c39",
              color: "#b43c39"
            }
          }}
        >
          Eliminar
        </Button>
      </Box>

      {/* GRID */}
      <Grid container spacing={4} justifyContent="center">
        {filtered.map((ev) => (
          <Grid item xs={12} sm={6} md={4} key={ev.id}>
            <Card
              onClick={() => handleOpen(ev)}
              sx={{
                cursor: "pointer",
                borderRadius: "14px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                transition: "transform .18s ease, box-shadow .18s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)"
                },

                height: "300px",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden"
              }}
            >
              <CardMedia
                component="img"
                image={ev.imagen_url}
                alt={ev.titulo}
                sx={{
                  height: "160px",
                  objectFit: "cover"
                }}
              />

              <CardContent
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: "#212429",
                    textAlign: "center",
                    lineHeight: "1.25",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    wordBreak: "break-word"
                  }}
                >
                  {ev.titulo}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography sx={{ color: "#666" }}>
                No se encontraron eventos para tu búsqueda.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      {/* MODAL DETALLE */}
      <Modal open={Boolean(selectedEvent)} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", sm: "500px" },
            bgcolor: "background.paper",
            borderRadius: "16px",
            boxShadow: 24,
            p: 3
          }}
        >
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8, color: "#666" }}
          >
            <CloseIcon />
          </IconButton>

          {selectedEvent && (
            <>
              <CardMedia
                component="img"
                image={selectedEvent.imagen_url}
                alt={selectedEvent.titulo}
                sx={{
                  borderRadius: "12px",
                  height: 220,
                  objectFit: "cover",
                  mb: 2
                }}
              />

              <Typography variant="h5" sx={{ fontWeight: 700, color: "#3AB795", mb: 1 }}>
                {selectedEvent.titulo}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Descripción:</strong> {selectedEvent.descripcion}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Categoría:</strong> {selectedEvent.categoria}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Lugar:</strong> {selectedEvent.lugar}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Fecha:</strong> {selectedEvent.fecha}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Publicado por:</strong> {selectedEvent.usuario}
              </Typography>

              <Typography sx={{ mb: 1 }}>
                <strong>Fecha de creación:</strong> {selectedEvent.fecha_creacion}
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* MODAL AGREGAR */}
      <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
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
            boxShadow: 24
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
            sx={{ mb: 2 }}
            value={form.descripcion}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <TextField
            label="Fecha"
            fullWidth
            sx={{ mb: 2 }}
            value={form.fecha}
            onChange={(e) => setForm({ ...form, fecha: e.target.value })}
          />

          <TextField
            label="URL de Imagen"
            fullWidth
            sx={{ mb: 2 }}
            value={form.imagen_url}
            onChange={(e) => setForm({ ...form, imagen_url: e.target.value })}
          />

          <TextField
            label="Categoría"
            fullWidth
            sx={{ mb: 2 }}
            value={form.categoria}
            onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          />

          <TextField
            label="Lugar"
            fullWidth
            sx={{ mb: 2 }}
            value={form.lugar}
            onChange={(e) => setForm({ ...form, lugar: e.target.value })}
          />

          <TextField
            label="Usuario"
            fullWidth
            sx={{ mb: 2 }}
            value={form.usuario}
            onChange={(e) => setForm({ ...form, usuario: e.target.value })}
          />

          <TextField
            label="User ID"
            fullWidth
            sx={{ mb: 2 }}
            value={form.user_id}
            onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          />

          <TextField
            label="Fecha de Creación"
            fullWidth
            sx={{ mb: 3 }}
            value={form.fecha_creacion}
            onChange={(e) =>
              setForm({ ...form, fecha_creacion: e.target.value })
            }
          />

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
            borderRadius: "16px",
            boxShadow: 24
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Eliminar Evento
          </Typography>

          <TextField
            select
            label="Seleccionar evento"
            fullWidth
            value={eventToDelete}
            sx={{ mb: 3 }}
            onChange={(e) => setEventToDelete(e.target.value)}
          >
            {eventos.map((e) => (
              <MenuItem key={e.id} value={e.id}>
                {e.titulo}
              </MenuItem>
            ))}
          </TextField>

          <Button
            fullWidth
            variant="contained"
            sx={{ background: "#d9534f" }}
            onClick={confirmarEliminar}
          >
            Eliminar
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
