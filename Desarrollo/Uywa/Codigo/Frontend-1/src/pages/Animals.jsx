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
// DATA
// ---------------------------------
const initialAnimals = [
  {
    id: 1,
    name: "Oso de Anteojos",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    description:
      "Mamífero sudamericano conocido por las manchas claras alrededor de sus ojos.",
    habitat: "Bosques andinos húmedos",
    danger: "Vulnerable"
  },
  {
    id: 2,
    name: "Cóndor Andino",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    description:
      "Una de las aves voladoras más grandes del mundo, símbolo de los Andes.",
    habitat: "Cordillera de los Andes",
    danger: "Casi amenazado"
  },
  {
    id: 3,
    name: "Rana del Titicaca",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    description:
      "Anfibio endémico del Lago Titicaca con piel arrugada característica.",
    habitat: "Lago Titicaca",
    danger: "En peligro crítico"
  },
  {
    id: 4,
    name: "Gallito de las Rocas",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Fronalpstock_big.jpg",
    description: "Ave nacional del Perú, vistoso y de pecho anaranjado.",
    habitat: "Selva alta y bosques húmedos",
    danger: "Preocupación menor"
  }
];

export default function Animals() {
  const [animals, setAnimals] = useState(initialAnimals);
  const [query, setQuery] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // ------------------------
  // MODALES
  // ------------------------
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    habitat: "",
    danger: ""
  });

  const [animalToDelete, setAnimalToDelete] = useState("");
  const [animalToUpdate, setAnimalToUpdate] = useState("");

  const handleOpen = (animal) => setSelectedAnimal(animal);
  const handleClose = () => setSelectedAnimal(null);

  // ------------------------
  // AGREGAR
  // ------------------------
  const guardarAnimal = () => {
    const nuevo = {
      id: animals.length + 1,
      ...form
    };

    setAnimals([...animals, nuevo]);
    setOpenAdd(false);

    setForm({
      name: "",
      image: "",
      description: "",
      habitat: "",
      danger: ""
    });
  };

  // ------------------------
  // ELIMINAR
  // ------------------------
  const confirmarEliminar = () => {
    setAnimals(animals.filter((a) => a.id !== Number(animalToDelete)));
    setOpenDelete(false);
    setAnimalToDelete("");
  };

  // ------------------------
  // ACTUALIZAR
  // ------------------------
  const cargarAnimalActualizar = (id) => {
    const animal = animals.find((a) => a.id === Number(id));
    if (animal) {
      setForm({ ...animal });
    }
  };

  const guardarActualizacion = () => {
    setAnimals(
      animals.map((a) =>
        a.id === Number(animalToUpdate) ? { ...form, id: a.id } : a
      )
    );

    setOpenUpdate(false);
    setAnimalToUpdate("");

    setForm({
      name: "",
      image: "",
      description: "",
      habitat: "",
      danger: ""
    });
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return animals;
    return animals.filter((a) => {
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.habitat.toLowerCase().includes(q)
      );
    });
  }, [query, animals]);

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
        Animales del Perú
      </Typography>

      {/* BUSCADOR */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nombre, descripción o hábitat..."
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
            fontWeight: 600
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
            textTransform: "none",
            fontWeight: 600
          }}
        >
          Actualizar
        </Button>
      </Box>

      {/* GRID DE ANIMALES */}
      <Grid container spacing={4} justifyContent="center">
        {filtered.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.id}>
            <Card
              onClick={() => handleOpen(animal)}
              sx={{
                cursor: "pointer",
                borderRadius: "14px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                transition: "transform .18s ease",
                "&:hover": {
                  transform: "translateY(-6px)"
                },
                height: "300px",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <CardMedia
                component="img"
                image={animal.image}
                sx={{ height: "160px", objectFit: "cover" }}
              />
              <CardContent sx={{ flex: 1, display: "flex", alignItems: "center" }}>
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
                  {animal.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* -------- MODAL DETALLE -------- */}
      <Modal open={Boolean(selectedAnimal)} onClose={handleClose}>
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

          {selectedAnimal && (
            <>
              <CardMedia
                component="img"
                image={selectedAnimal.image}
                sx={{ borderRadius: "12px", height: 220, mb: 2 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#3AB795" }}>
                {selectedAnimal.name}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Descripción:</strong> {selectedAnimal.description}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Hábitat:</strong> {selectedAnimal.habitat}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Peligro:</strong>{" "}
                <span style={{ color: "#d9534f", fontWeight: "700" }}>
                  {selectedAnimal.danger}
                </span>
              </Typography>
            </>
          )}
        </Box>
      </Modal>

      {/* -------- MODAL AGREGAR -------- */}
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
            Agregar Animal
          </Typography>

          <TextField
            label="Nombre"
            fullWidth
            sx={{ mb: 2 }}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="URL de Imagen"
            fullWidth
            sx={{ mb: 2 }}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <TextField
            label="Descripción"
            fullWidth
            multiline
            sx={{ mb: 2 }}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <TextField
            label="Hábitat"
            fullWidth
            sx={{ mb: 2 }}
            value={form.habitat}
            onChange={(e) => setForm({ ...form, habitat: e.target.value })}
          />
          <TextField
            label="Peligro"
            fullWidth
            sx={{ mb: 2 }}
            value={form.danger}
            onChange={(e) => setForm({ ...form, danger: e.target.value })}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ background: "#3AB795" }}
            onClick={guardarAnimal}
          >
            Guardar
          </Button>
        </Box>
      </Modal>

      {/* -------- MODAL ELIMINAR -------- */}
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
            Eliminar Animal
          </Typography>

          <TextField
            select
            label="Seleccionar animal"
            fullWidth
            sx={{ mb: 3 }}
            value={animalToDelete}
            onChange={(e) => setAnimalToDelete(e.target.value)}
          >
            {animals.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.name}
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

      {/* -------- MODAL ACTUALIZAR -------- */}
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
            Actualizar Animal
          </Typography>

          <TextField
            select
            label="Seleccionar animal"
            fullWidth
            sx={{ mb: 3 }}
            value={animalToUpdate}
            onChange={(e) => {
              setAnimalToUpdate(e.target.value);
              cargarAnimalActualizar(e.target.value);
            }}
          >
            {animals.map((a) => (
              <MenuItem key={a.id} value={a.id}>
                {a.name}
              </MenuItem>
            ))}
          </TextField>

          {animalToUpdate && (
            <>
              <TextField
                label="Nombre"
                fullWidth
                sx={{ mb: 2 }}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <TextField
                label="URL de Imagen"
                fullWidth
                sx={{ mb: 2 }}
                value={form.image}
                onChange={(e) =>
                  setForm({ ...form, image: e.target.value })
                }
              />

              <TextField
                label="Descripción"
                fullWidth
                multiline
                sx={{ mb: 2 }}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />

              <TextField
                label="Hábitat"
                fullWidth
                sx={{ mb: 2 }}
                value={form.habitat}
                onChange={(e) =>
                  setForm({ ...form, habitat: e.target.value })
                }
              />

              <TextField
                label="Peligro"
                fullWidth
                sx={{ mb: 2 }}
                value={form.danger}
                onChange={(e) =>
                  setForm({ ...form, danger: e.target.value })
                }
              />

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
