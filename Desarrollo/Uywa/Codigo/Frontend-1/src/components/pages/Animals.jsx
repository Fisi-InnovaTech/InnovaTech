import React, { useState, useMemo, useEffect, useCallback } from "react";
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
  Alert,
  Autocomplete,
  CircularProgress,
  Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useAuthStore } from "../../auth/store/authStore";

const API_BASE_URL = "https://backend-uywa.onrender.com";
const backendURL = `${API_BASE_URL}/animal`;

const estados = [
  "preocupacion_menor",
  "casi_amenazado",
  "vulnerable",
  "en_peligro",
  "en_peligro_critico",
  "extinto"
];

// Componente personalizado para el Paper del Autocomplete
const CustomPaper = (props) => {
  return <Paper elevation={3} {...props} />;
};

export default function Animals() {
  const { getUserRole } = useAuthStore();
  const userRole = getUserRole();
  const hasAdminPermissions = userRole === "moderador" || userRole === "admin";

  const [allAnimals, setAllAnimals] = useState([]); // Todos los animales (fuente de verdad)
  const [displayedAnimals, setDisplayedAnimals] = useState([]); // Animales que se muestran (filtrados)
  const [query, setQuery] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

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
    nombre: "",
    descripcion: "",
    habitad: "",
    estado: "",
    video_url: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [animalToDelete, setAnimalToDelete] = useState(null);
  const [animalToUpdate, setAnimalToUpdate] = useState(null);
  const [searchUpdateQuery, setSearchUpdateQuery] = useState("");

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
  // FETCH ANIMALES (todos, solo una vez al inicio)
  // ================================
  const fetchAllAnimals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(backendURL);

      if (!response.ok) {
        throw new Error("Error al obtener los animales");
      }

      const json = await response.json();
      const animalsData = json.data || [];
      setAllAnimals(animalsData);
      setDisplayedAnimals(animalsData); // Inicialmente mostrar todos
    } catch (error) {
      showSnackbar(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    fetchAllAnimals();
  }, [fetchAllAnimals]);

  // ================================
  // BÚSQUEDA LOCAL (usa el array allAnimals)
  // ================================
  const performLocalSearch = useCallback((searchTerm) => {
    setLoadingSearch(true);
    
    if (!searchTerm.trim()) {
      // Si está vacío, mostrar todos
      setDisplayedAnimals(allAnimals);
      setLoadingSearch(false);
      return;
    }

    const term = searchTerm.toLowerCase().trim();
    
    // Usamos setTimeout para simular carga y dar mejor UX
    setTimeout(() => {
      const filtered = allAnimals.filter(animal => 
        animal.nombre.toLowerCase().includes(term) ||
        (animal.descripcion && animal.descripcion.toLowerCase().includes(term)) ||
        (animal.habitad && animal.habitad.toLowerCase().includes(term))
      );
      
      setDisplayedAnimals(filtered);
      setLoadingSearch(false);
    }, 100); // Pequeño delay para mejor UX
  }, [allAnimals]);

  // ================================
  // MANEJO DE BÚSQUEDA EN INPUT
  // ================================
  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    performLocalSearch(value);
  };

  // ================================
  // BÚSQUEDA PARA ACTUALIZAR (también usa allAnimals)
  // ================================
  const handleSearchUpdate = (searchTerm) => {
    setSearchUpdateQuery(searchTerm);
  };

  // Filtrar animales para el dropdown de actualizar
  const filteredAnimalsForUpdate = useMemo(() => {
    if (!searchUpdateQuery.trim()) {
      return allAnimals.slice(0, 10);
    }
    
    const query = searchUpdateQuery.toLowerCase();
    return allAnimals.filter(animal => 
      animal.nombre.toLowerCase().includes(query) ||
      (animal.descripcion && animal.descripcion.toLowerCase().includes(query)) ||
      (animal.habitad && animal.habitad.toLowerCase().includes(query))
    ).slice(0, 10);
  }, [searchUpdateQuery, allAnimals]);

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
      nombre: "",
      descripcion: "",
      habitad: "",
      estado: "",
      video_url: ""
    });
    setImageFile(null);
    setImagePreview(null);
  };

  // ================================
  // AGREGAR ANIMAL
  // ================================
  const guardarAnimal = async () => {
    try {
      if (!form.nombre || !form.descripcion || !form.habitad || !form.estado) {
        showSnackbar("Por favor completa todos los campos requeridos", "warning");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("habitad", form.habitad);
      formData.append("estado", form.estado);

      if (form.video_url) {
        formData.append("video_url", form.video_url);
      }

      if (imageFile) {
        formData.append("imagen_url", imageFile);
      }

      const response = await fetch(backendURL, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al crear el animal: ${response.status} ${response.statusText}`);
      }

      const newAnimal = await response.json();
      
      // Actualizar el array local con el nuevo animal
      setAllAnimals(prev => {
        const updated = [...prev, newAnimal.data];
        // También actualizar displayedAnimals si coincide con la búsqueda actual
        if (query.trim() === "" || 
            newAnimal.data.nombre.toLowerCase().includes(query.toLowerCase()) ||
            newAnimal.data.descripcion?.toLowerCase().includes(query.toLowerCase()) ||
            newAnimal.data.habitad?.toLowerCase().includes(query.toLowerCase())) {
          setDisplayedAnimals(prevDisplayed => [...prevDisplayed, newAnimal.data]);
        }
        return updated;
      });

      showSnackbar("Animal creado exitosamente", "success");
      setOpenAdd(false);
      resetForm();

    } catch (error) {
      console.error("Error completo:", error);
      showSnackbar(error.message, "error");
    }
  };

  // ================================
  // ELIMINAR ANIMAL
  // ================================
  const confirmarEliminar = async () => {
    if (!animalToDelete) return;
    
    try {
      const response = await fetch(`${backendURL}/${animalToDelete.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el animal");
      }

      // Actualizar arrays locales
      setAllAnimals(prev => prev.filter(animal => animal.id !== animalToDelete.id));
      setDisplayedAnimals(prev => prev.filter(animal => animal.id !== animalToDelete.id));

      showSnackbar("Animal eliminado exitosamente", "success");
      setOpenDelete(false);
      setAnimalToDelete(null);

    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  // ================================
  // ACTUALIZAR ANIMAL
  // ================================
  const cargarAnimalActualizar = async (animal) => {
    if (!animal) return;
    
    try {
      const response = await fetch(`${backendURL}/${animal.id}`);
      
      if (!response.ok) {
        throw new Error("Error al cargar el animal");
      }

      const json = await response.json();
      const animalData = json.data;
      
      if (animalData) {
        setForm({
          nombre: animalData.nombre || "",
          descripcion: animalData.descripcion || "",
          habitad: animalData.habitad || "",
          estado: animalData.estado || "",
          video_url: animalData.video_url || ""
        });
        if (animalData.imagen_url) {
          setImagePreview(animalData.imagen_url);
        }
        setAnimalToUpdate(animalData);
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const guardarActualizacion = async () => {
    if (!animalToUpdate) return;
    
    try {
      if (!form.nombre || !form.descripcion || !form.habitad || !form.estado) {
        showSnackbar("Por favor completa todos los campos requeridos", "warning");
        return;
      }

      const formData = new FormData();
      formData.append("nombre", form.nombre);
      formData.append("descripcion", form.descripcion);
      formData.append("habitad", form.habitad);
      formData.append("estado", form.estado);
      
      if (form.video_url) {
        formData.append("video_url", form.video_url);
      }

      if (imageFile) {
        formData.append("imagen_url", imageFile);
      }

      const response = await fetch(`${backendURL}/${animalToUpdate.id}`, {
        method: "PATCH",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error del servidor:", errorText);
        throw new Error(`Error al actualizar el animal: ${response.status} ${response.statusText}`);
      }

      const updatedAnimal = await response.json();
      
      // Actualizar arrays locales
      setAllAnimals(prev => 
        prev.map(animal => 
          animal.id === animalToUpdate.id ? updatedAnimal.data : animal
        )
      );
      
      // Actualizar displayedAnimals manteniendo el filtro actual
      setDisplayedAnimals(prev => 
        prev.map(animal => 
          animal.id === animalToUpdate.id ? updatedAnimal.data : animal
        )
      );

      showSnackbar("Animal actualizado exitosamente", "success");
      setOpenUpdate(false);
      setAnimalToUpdate(null);
      setSearchUpdateQuery("");
      resetForm();

    } catch (error) {
      console.error("Error completo:", error);
      showSnackbar(error.message, "error");
    }
  };

  const handleOpen = (animal) => setSelectedAnimal(animal);
  const handleClose = () => setSelectedAnimal(null);

  // Función para traducir estado a español
  const traducirEstado = (estado) => {
    const traducciones = {
      "preocupacion_menor": "Preocupación Menor",
      "casi_amenazado": "Casi Amenazado",
      "vulnerable": "Vulnerable",
      "en_peligro": "En Peligro",
      "en_peligro_critico": "En Peligro Crítico",
      "extinto": "Extinto"
    };
    return traducciones[estado] || estado;
  };

  // Función para limpiar búsqueda
  const clearSearch = () => {
    setQuery("");
    setDisplayedAnimals(allAnimals);
  };

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

      {/* BUSCADOR PRINCIPAL - Búsqueda local */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <TextField
          value={query}
          onChange={handleSearchInputChange}
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
            ),
            endAdornment: loadingSearch ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : query ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  sx={{ mr: -1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null
          }}
        />
      </Box>

      {/* BOTONES - Solo visible para moderadores y admins */}
      {hasAdminPermissions && (
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
      )}

      {/* GRID DE ANIMALES */}
      {loading && displayedAnimals.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : displayedAnimals.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4, color: "#666" }}>
          {query ? "No se encontraron animales que coincidan con la búsqueda" : "No hay animales registrados"}
        </Typography>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {displayedAnimals.map((animal) => (
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
                  image={animal.imagen_url || "https://via.placeholder.com/300x200?text=Sin+Imagen"}
                  sx={{ height: "160px", objectFit: "cover" }}
                />
                <CardContent sx={{ flex: 1, display: "flex", alignItems: "center", flexDirection: "column", justifyContent: "center" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      textAlign: "center",
                      fontWeight: 600,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      mb: 1
                    }}
                  >
                    {animal.nombre}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      textAlign: "center",
                      color: "#d9534f",
                      fontWeight: 600
                    }}
                  >
                    {traducirEstado(animal.estado)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

          {selectedAnimal && (
            <>
              <CardMedia
                component="img"
                image={selectedAnimal.imagen_url || "https://via.placeholder.com/500x300?text=Sin+Imagen"}
                sx={{ borderRadius: "12px", height: 220, mb: 2, objectFit: "cover" }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, color: "#3AB795" }}>
                {selectedAnimal.nombre}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Descripción:</strong> {selectedAnimal.descripcion}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Hábitat:</strong> {selectedAnimal.habitad}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                <strong>Estado:</strong>{" "}
                <span style={{ color: "#d9534f", fontWeight: "700" }}>
                  {traducirEstado(selectedAnimal.estado)}
                </span>
              </Typography>

              {selectedAnimal.video_url && (
                <Typography sx={{ mt: 1 }}>
                  <strong>Video:</strong>{" "}
                  <a href={selectedAnimal.video_url} target="_blank" rel="noopener noreferrer">
                    Ver video
                  </a>
                </Typography>
              )}
            </>
          )}
        </Box>
      </Modal>

      {/* -------- MODAL AGREGAR -------- */}
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
                Agregar Animal
              </Typography>

              <TextField
                label="Nombre"
                fullWidth
                sx={{ mb: 2 }}
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                label="Hábitat"
                fullWidth
                sx={{ mb: 2 }}
                value={form.habitad}
                onChange={(e) => setForm({ ...form, habitad: e.target.value })}
              />
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Estado de Conservación</InputLabel>
                <Select
                  value={form.estado}
                  label="Estado de Conservación"
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  {estados.map((estado) => (
                    <MenuItem key={estado} value={estado}>
                      {traducirEstado(estado)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="URL de Video (opcional)"
                fullWidth
                sx={{ mb: 2 }}
                value={form.video_url}
                onChange={(e) => setForm({ ...form, video_url: e.target.value })}
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
                onClick={guardarAnimal}
              >
                Guardar
              </Button>
            </Box>
          </Modal>

          {/* -------- MODAL ELIMINAR -------- */}
          <Modal open={openDelete} onClose={() => { setOpenDelete(false); setAnimalToDelete(null); }}>
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

              <Autocomplete
                options={allAnimals}
                getOptionLabel={(option) => option.nombre}
                value={animalToDelete}
                onChange={(event, newValue) => {
                  setAnimalToDelete(newValue);
                }}
                onInputChange={(event, newInputValue) => {
                  handleSearchUpdate(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar animal"
                    fullWidth
                    sx={{ mb: 3 }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#3AB795" }} />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">{option.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.habitad} • {traducirEstado(option.estado)}
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
                PaperComponent={CustomPaper}
                noOptionsText="No se encontraron animales"
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ background: "#d9534f" }}
                onClick={confirmarEliminar}
                disabled={!animalToDelete}
              >
                Eliminar
              </Button>
            </Box>
          </Modal>

          {/* -------- MODAL ACTUALIZAR -------- */}
          <Modal open={openUpdate} onClose={() => { 
            setOpenUpdate(false); 
            setAnimalToUpdate(null); 
            setSearchUpdateQuery(""); 
            resetForm(); 
          }}>
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
                Actualizar Animal
              </Typography>

              <Autocomplete
                options={filteredAnimalsForUpdate}
                getOptionLabel={(option) => option.nombre}
                value={animalToUpdate}
                onChange={(event, newValue) => {
                  if (newValue) {
                    cargarAnimalActualizar(newValue);
                  } else {
                    setAnimalToUpdate(null);
                    resetForm();
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  handleSearchUpdate(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Buscar animal para actualizar"
                    fullWidth
                    sx={{ mb: 3 }}
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: "#3AB795" }} />
                        </InputAdornment>
                      )
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <MenuItem {...props} key={option.id}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">{option.nombre}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {option.habitad} • {traducirEstado(option.estado)}
                      </Typography>
                    </Box>
                  </MenuItem>
                )}
                PaperComponent={CustomPaper}
                noOptionsText="No se encontraron animales"
              />

              {animalToUpdate && (
                <>
                  <TextField
                    label="Nombre"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
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
                    label="Hábitat"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.habitad}
                    onChange={(e) => setForm({ ...form, habitad: e.target.value })}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Estado de Conservación</InputLabel>
                    <Select
                      value={form.estado}
                      label="Estado de Conservación"
                      onChange={(e) => setForm({ ...form, estado: e.target.value })}
                    >
                      {estados.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                          {traducirEstado(estado)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    label="URL de Video (opcional)"
                    fullWidth
                    sx={{ mb: 2 }}
                    value={form.video_url}
                    onChange={(e) => setForm({ ...form, video_url: e.target.value })}
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
                      <Typography variant="caption" color="text.secondary">
                        {animalToUpdate.imagen_url ? "Imagen actual (se reemplazará si subes una nueva)" : "No hay imagen actual"}
                      </Typography>
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