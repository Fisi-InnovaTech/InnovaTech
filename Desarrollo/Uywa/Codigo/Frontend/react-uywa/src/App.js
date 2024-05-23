import './App.css';
import React from "react";
import ResponsiveAppBar from './components/AppBar/AppBar';
import Home from "./pages/Home";
import RealizarAlerta from "./pages/RealizarAlerta";
import VerAlerta from "./pages/VerAlerta";
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import SignInSide from './components/Login/login';
import SignUp from './components/Login/register';

function App() {
  return (
    <Router>
      <div>
        <ResponsiveAppBar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realizar-alerta" element={<RealizarAlerta />} />
          <Route path='/ver-alerta' element={<VerAlerta/>} />
          <Route path='/iniciar-sesion' element={<SignInSide/>}/>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
