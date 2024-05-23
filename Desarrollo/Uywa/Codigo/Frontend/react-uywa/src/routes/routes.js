import { Routes, Route} from "react-router-dom";
import RealizarAlerta from "../pages/RealizarAlerta"

export default function Ruta() {
    return (
      <Routes>
        
        <Route path="/" component={RealizarAlerta} />
        <Route path="/realizar-alerta" component={RealizarAlerta} />
      </Routes>
    );
  }