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
  InputAdornment
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";

const animalsData = [
  {
    id: 1,
    name: "Oso nnnnde Anteojos",
    image:
      "./Captura de pantalla_2025-04-14_20-55-50.png",
    description:
      "Mamífero sudamericano conocido por las manchas claras alrededor de sus ojos.",
    habitat: "Bosques andinos húmedos",
    danger: "Vulnerable"
  },
  {
    id: 2,
    name: "Cóndor Andino",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Condor_andino_%28Vultur_gryphus%29%2C_parque_nacional_Torres_del_Paine%2C_Chile%2C_2020-02-08%2C_DD_25.jpg/800px-Condor_andino_%28Vultur_gryphus%29%2C_parque_nacional_Torres_del_Paine%2C_Chile%2C_2020-02-08%2C_DD_25.jpg",
    description:
      "Una de las aves voladoras más grandes del mundo, símbolo de los Andes.",
    habitat: "Cordillera de los Andes",
    danger: "Casi amenazado"
  },
  {
    id: 3,
    name: "Rana del Titicaca",
    image: "https://upload.wikimedia.org/wikipedia/commons/3/31/Titicaca_Frog.jpg",
    description:
      "Anfibio endémico del Lago Titicaca con piel arrugada característica.",
    habitat: "Lago Titicaca",
    danger: "En peligro crítico"
  },
  {
    id: 4,
    name: "Gallito de las Rocas",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/2/24/Rupicola_peruvianus_-Haute_Matoury%2C_Georges-Gabriel_Gu%C3%A9rin_Reserve%2C_French_Guiana-8.jpg",
    description: "Ave nacional del Perú, vistoso y de pecho anaranjado.",
    habitat: "Selva alta y bosques húmedos",
    danger: "Preocupación menor"
  }
];

export default function Animals() {
  const [query, setQuery] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const handleOpen = (animal) => setSelectedAnimal(animal);
  const handleClose = () => setSelectedAnimal(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return animalsData;
    return animalsData.filter((a) => {
      return (
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q) ||
        a.habitat.toLowerCase().includes(q)
      );
    });
  }, [query]);

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

      {/* SEARCH */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
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

      <Grid container spacing={4} justifyContent="center">
        {filtered.map((animal) => (
          <Grid item xs={12} sm={6} md={4} key={animal.id}>
            <Card
              onClick={() => handleOpen(animal)}
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
                image={animal.image}
                alt={animal.name}
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
                  {animal.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {filtered.length === 0 && (
          <Grid item xs={12}>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography sx={{ color: "#666" }}>
                No se encontraron animales para tu búsqueda.
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>

      <Modal open={Boolean(selectedAnimal)} onClose={handleClose}>
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

          {selectedAnimal && (
            <>
              <CardMedia
                component="img"
                image={selectedAnimal.image}
                alt={selectedAnimal.name}
                sx={{
                  borderRadius: "12px",
                  height: 220,
                  objectFit: "cover",
                  mb: 2
                }}
              />

              <Typography variant="h5" sx={{ fontWeight: 700, color: "#3AB795", mb: 1 }}>
                {selectedAnimal.name}
              </Typography>

              <Typography sx={{ mb: 1, color: "#333" }}>
                <strong>Descripción:</strong> {selectedAnimal.description}
              </Typography>

              <Typography sx={{ mb: 1, color: "#333" }}>
                <strong>Hábitat:</strong> {selectedAnimal.habitat}
              </Typography>

              <Typography sx={{ color: "#333" }}>
                <strong>Peligro de extinción:</strong>{" "}
                <span style={{ color: "#d9534f", fontWeight: 700 }}>
                  {selectedAnimal.danger}
                </span>
              </Typography>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
