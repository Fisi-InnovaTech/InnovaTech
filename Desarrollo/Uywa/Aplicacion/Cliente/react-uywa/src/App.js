import './App.css';
import React from "react";
import Box from '@mui/material/Box';
import ResponsiveAppBar from "./components/AppBar/AppBar";
import Carrusel from "./components/Carrusel/Carousel";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ResponsiveAppBar/>
      </header>
      <Box>
        <Carrusel/>
      </Box>
    </div>
  );
}

export default App;
