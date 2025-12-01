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
import { AuthProvider } from './auth/providers/authProvider';
import { RouteGuard } from './auth/guards/authGuard';
import Animals from './pages/Animals';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className='App'>
          <Routes>
            {/* Rutas públicas SIN navbar - redirigen a home si ya están autenticados */}
            <Route path='/iniciar-sesion' element={
              <RouteGuard requireAuth={false}>
                <InicioSesion/>
              </RouteGuard>
            }/>
            <Route path='/registrar' element={
              <RouteGuard requireAuth={false}>
                <Registrar/>
              </RouteGuard>
            }/>
            
            {/* Layout con navbar y footer */}
            <Route element={
              <>
                <ResponsiveAppBar />
                <div style={{ minHeight: 'calc(100vh - 64px - 200px)' }}>
                  <Outlet />
                </div>
                <Footer/>
              </>
            }>
              {/* Rutas públicas CON navbar */}
              <Route path="/" element={<Home />} />
              <Route path="/realizar-alerta" element={<RealizarAlerta />} />
              <Route path="/informacion-trafico-animales" element={<Blog />} />
              <Route path="/ver-alerta" element={<VerAlerta />} />
              <Route path="/ver-animales" element={<Animals />} />

              {/* Rutas protegidas - requieren autenticación */}
              <Route path="/perfil" element={
                <RouteGuard requireAuth={true} requiredRoles={["usuario", "moderador", "admin"]}>
                  <Profile/>
                </RouteGuard>
              }/>
              
              {/* Rutas de moderador - requieren autenticación Y rol moderador */}

              <Route path='/moderador' element={
                <RouteGuard requireAuth={true} requiredRoles={['moderador']}>
                  <ModeradorPrincipal/>
                </RouteGuard>
              }/>
              
              <Route path="/moderador-reportes" element={
                <RouteGuard requireAuth={true} requiredRoles={['moderador']}>
                  <Reportes/>
                </RouteGuard>
              }/>
              
              <Route path="/estadistica" element={
                <RouteGuard requireAuth={true} requiredRoles={['moderador']}>
                  <Report/>
                </RouteGuard>
              }/>
              
              <Route path="/promover-usuario" element={
                <RouteGuard requireAuth={true} requiredRoles={['moderador']}>
                  <Promover/>
                </RouteGuard>
              }/>
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;