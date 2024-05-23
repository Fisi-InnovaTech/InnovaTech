import './App.css';
import React from "react";
import Home from "./pages/Home"
import RealizarAlerta from "./pages/RealizarAlerta"
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/realizar-alerta" element={<RealizarAlerta />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
