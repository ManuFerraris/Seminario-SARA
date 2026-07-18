import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './inicio/home'; 
import Login from './inicio/login';
import Registro from './inicio/signup';
import MenuPrincipal from './inicio/menu';
import BajaAnimal from './CUS01/bajaAnimal';
import AltaAnimal from './CUU01/altaAnimal';
import RegistroRescate from './CUU02/registroRescate';
import RetiroMaltrato from './CUU03/registrarRetiroPorMaltrato';
import ColocacionVacunas from './CUU04/registrarColocacionVacunas';
import AltaEntrevista from './CUU05/altaEntrevista';
import RegistrarSeguimiento from './CUU06/registarSeguimiento';
import RegistrarAdopcion from './CUU07/registrarAdopcion';
import RegistrarRevision from './CUU08/registrarRevision';
import RegistrarEntrevista from './CUU09/registrarEntrevista';
import RegistrarDonacion from './CUU10/registrarDonacion';
import './App.css'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

        <Route path="/home" element={<Home />} />
        <Route path="/menu" element={<MenuPrincipal />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registro />} />
        <Route path="/baja-animal" element={<BajaAnimal />} />
        <Route path="/alta-animal" element={<AltaAnimal />} />
        <Route path="/registro-rescate" element={<RegistroRescate />} />
        <Route path="/retiro-maltrato" element={<RetiroMaltrato />} />
        <Route path="/colocacion-vacunas" element={<ColocacionVacunas />} />
        <Route path="/alta-entrevista" element={<AltaEntrevista />} />
        <Route path="/registrar-seguimiento" element={<RegistrarSeguimiento />} />
        <Route path="/registrar-adopcion" element={<RegistrarAdopcion />} />
        <Route path="/registrar-revision" element={<RegistrarRevision />} />
        <Route path="/registrar-entrevista" element={<RegistrarEntrevista />} />
        <Route path="/registrar-donacion" element={<RegistrarDonacion />} />
        
        <Route path="/animales" element={<div style={{ textAlign: 'center', marginTop: '50px' }}><h1>Próximamente: Listado de animales para adoptar 🐾</h1></div>} />
        
        {/* Ruta vacía para cuando hagan clic en "Crear una cuenta" */}
        <Route path="/registro" element={<div style={{ textAlign: 'center', marginTop: '50px' }}><h1>Página de Registro</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;