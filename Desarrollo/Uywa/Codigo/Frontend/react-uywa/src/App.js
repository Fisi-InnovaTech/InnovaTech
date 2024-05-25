import './App.css';
import React from "react";
import ResponsiveAppBar from './components/Navigation/NavBar';
import Home from "./pages/Home";
import RealizarAlerta from "./pages/RealizarAlerta";
import VerAlerta from "./pages/VerAlerta";
import InicioSesion from './components/Login/InicioSesion';
import Registrar from './components/Login/Registrar'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import { Outlet } from "react-router-dom";
function App() {
  return (
    <Router>
      <div>
        
        <Routes>
          <Route path='/iniciar-sesion' element={<InicioSesion/>}/>
          <Route path='/registrar' element={<Registrar/>}/>
          <Route element={
            <>
            <ResponsiveAppBar />
            <Outlet />
            </>
          }>
          <Route path="/" element={<Home />} />
          <Route path="/realizar-alerta" element={<RealizarAlerta />} />
          <Route path='/ver-alerta' element={<VerAlerta/>} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
