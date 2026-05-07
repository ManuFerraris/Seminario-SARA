import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importamos la vista que creamos antes. 
// (Asegurate de que la ruta coincida con la carpeta donde guardaste Home.tsx)
import { Home } from './inicio/home'; 

import './App.css'; // Mantenemos los estilos generales si los necesitas

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta principal: Cuando entres a localhost:5173, va a mostrar el componente Home */}
        <Route path="/" element={<Home />} />

        {/* Ruta secundaria: Acá irá el listado cuando el usuario toque el botón "Adoptar!" */}
        <Route path="/animales" element={<div style={{ textAlign: 'center', marginTop: '50px' }}><h1>Próximamente: Listado de animales para adoptar 🐾</h1></div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;