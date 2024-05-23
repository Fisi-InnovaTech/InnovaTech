import './App.css';
import React from "react";
import ResponsiveAppBar from './components/AppBar/AppBar';
import Home from "./pages/Home";
import RealizarAlerta from "./pages/RealizarAlerta";
import VerAlerta from "./pages/VerAlerta";
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import InicioSesion from './components/Login/InicioSesion';
import Registrar from './components/Login/Registrar'

function App() {
  return (
    <Router>
      <div>
        <ResponsiveAppBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realizar-alerta" element={<RealizarAlerta />} />
          <Route path='/ver-alerta' element={<VerAlerta/>} />
          <Route path='/iniciar-sesion' element={<InicioSesion/>}/>
          <Route path='/registrar' element={<Registrar/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
