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
  const [openUpdate, setOpenUpdate] = useState(false);

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
  const [eventToUpdate, setEventToUpdate] = useState("");

  const handleOpen = (ev) => setSelectedEvent(ev);
  const handleClose = () => setSelectedEvent(null);

  // ------------------------
  // AGREGAR
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
  // ELIMINAR
  // ------------------------
  const confirmarEliminar = () => {
    setEventos(eventos.filter((ev) => ev.id !== Number(eventToDelete)));
    setOpenDelete(false);
    setEventToDelete("");
  };

  // ------------------------
  // ACTUALIZAR (NUEVO)
  // ------------------------
  const cargarEventoActualizar = (id) => {
    const ev = eventos.find((e) => e.id === Number(id));
    if (ev) {
      setForm({ ...ev });
    }
  };

  const guardarActualizacion = () => {
    setEventos(
      eventos.map((ev) =>
        ev.id === Number(eventToUpdate) ? { ...form, id: ev.id } : ev
      )
    );

    setOpenUpdate(false);
    setEventToUpdate("");

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
  // BUSCADOR
  // ------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return eventos;

    return eventos.filter((ev) =>
      `${ev.titulo} ${ev.descripcion} ${ev.categoria} ${ev.lugar}`
        .toLowerCase()
        .includes(q)
    );
  }, [query, eventos]);

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

      {/* BOTONES */}
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
            borderRadius: "16px"
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
                <strong>Fecha:</strong> {selectedEvent.fecha}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Lugar:</strong> {selectedEvent.lugar}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Categoría:</strong> {selectedEvent.categoria}
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
            borderRadius: "16px"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Agregar Evento
          </Typography>

          {[
            ["titulo", "Título"],
            ["descripcion", "Descripción"],
            ["fecha", "Fecha"],
            ["imagen_url", "URL Imagen"],
            ["user_id", "User ID"],
            ["categoria", "Categoría"],
            ["lugar", "Lugar"],
            ["usuario", "Usuario"],
            ["fecha_creacion", "Fecha Creación"]
          ].map(([key, label]) => (
            <TextField
              key={key}
              label={label}
              fullWidth
              sx={{ mb: 2 }}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            />
          ))}

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
          >
            Eliminar
          </Button>
        </Box>
      </Modal>

      {/* MODAL ACTUALIZAR — COMPLETO */}
      <Modal open={openUpdate} onClose={() => setOpenUpdate(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", sm: "480px" },
            bgcolor: "white",
            p: 3,
            borderRadius: "16px"
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
            Actualizar Evento
          </Typography>

          {/* Selector de evento */}
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

          {/* Formulario si hay evento elegido */}
          {eventToUpdate && (
            <>
              {[
                ["titulo", "Título"],
                ["descripcion", "Descripción"],
                ["fecha", "Fecha"],
                ["imagen_url", "URL Imagen"],
                ["user_id", "User ID"],
                ["categoria", "Categoría"],
                ["lugar", "Lugar"],
                ["usuario", "Usuario"],
                ["fecha_creacion", "Fecha Creación"]
              ].map(([key, label]) => (
                <TextField
                  key={key}
                  label={label}
                  fullWidth
                  sx={{ mb: 2 }}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              ))}

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
    </Box>
  );
}
