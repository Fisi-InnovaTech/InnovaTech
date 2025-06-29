import './App.css';
import React from "react";
import ResponsiveAppBar from './components/Navigation/NavBar';
import Home from "./pages/Home";
import RealizarAlerta from "./pages/RealizarAlerta";
import VerAlerta from "./pages/VerAlertaGoogle";
import Blog from './pages/InformacionTrafico';
import InicioSesion from './components/Login/InicioSesion';
import Registrar from './components/Login/Registrar'
import Footer from './components/Footer/Footer';
import Reportes from './pages/ReportesMod';
import ModeradorPrincipal from './pages/Moderador';
import Profile from './pages/Profile';
import Report from './pages/EstadisticaAlertUI';
import Promover from './pages/PromoverUsuario';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/iniciar-sesion' element={<InicioSesion/>}/>
          <Route path='/registrar' element={<Registrar/>}/>
          <Route element={
            <>
            <ResponsiveAppBar />
            <Outlet />
            <Footer/>
            </>
          }>
          <Route path="/" element={<Home />} />
          <Route path="/realizar-alerta" element={<RealizarAlerta />} />
          <Route path='/ver-alerta' element={<VerAlerta/>} />
          <Route path='/moderador' element={<ModeradorPrincipal/>}/>
          <Route path="/moderador-reportes" element={<Reportes/>}/>
          <Route path="/informacion-trafico-animales" element={<Blog/>}/>
          <Route path="/perfil" element={<Profile/>}/>
          <Route path="/estadistica" element={<Report/>}/>
          <Route path="/promover-usuario" element={<Promover/>}/>
          </Route>
        </Routes>

      </div>
    </Router>
  );
}

export default App;