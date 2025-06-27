import './App.css';
import React from "react";
import ResponsiveAppBar from './components/Navigation/NavBar';
import Home from "./pages/Home";
import RealizarAlerta from "./pages/RealizarAlerta";
import VerAlerta from "./pages/VerAlertaGoogle";
import Blog from './pages/InformacionTrafico';
import InicioSesion from './components/Login/InicioSesion';
import Registrar from './components/Login/Registrar';
import Footer from './components/Footer/Footer';
import Reportes from './pages/ReportesMod';
import ModeradorPrincipal from './pages/Moderador';
import Profile from './pages/Profile';
import Report from './pages/EstadisticaAlertUI';
import Promover from './pages/PromoverUsuario';
import { Outlet, Navigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const ModeratorRoute = ({ children }) => {
  const userSession = JSON.parse(localStorage.getItem('UW-mod-logged-session')) || {};
  
  if (!userSession.token || !userSession.isModerator) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return children;
};

// Componente para rutas generales autenticadas
const AuthenticatedRoute = ({ children }) => {
  const userSession = JSON.parse(localStorage.getItem('UW-logged-session')) || {};
  const modSession = JSON.parse(localStorage.getItem('UW-mod-logged-session')) || {};
  
  if (!userSession.token && !modSession.token) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route path='/iniciar-sesion' element={<InicioSesion/>}/>
          <Route path='/registrar' element={<Registrar/>}/>
          
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/ver-alerta" element={<VerAlerta/>} />
          <Route path="/informacion-trafico-animales" element={<Blog/>}/>
          
          {/* Rutas protegidas para usuarios autenticados */}
          <Route element={
            <>
              <ResponsiveAppBar />
              <AuthenticatedRoute>
                <Outlet />
              </AuthenticatedRoute>
              <Footer/>
            </>
          }>
            <Route path="/realizar-alerta" element={<RealizarAlerta />} />
            <Route path="/perfil" element={<Profile/>}/>
          </Route>
          
          {/* Rutas protegidas solo para moderadores */}
          <Route element={
            <>
              <ResponsiveAppBar />
              <ModeratorRoute>
                <Outlet />
              </ModeratorRoute>
              <Footer/>
            </>
          }>
            <Route path="/moderador" element={<ModeradorPrincipal/>}/>
            <Route path="/moderador-reportes" element={<Reportes/>}/>
            <Route path="/estadistica" element={<Report/>}/>
            <Route path="/promover-usuario" element={<Promover/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;