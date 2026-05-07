import { useNavigate } from 'react-router-dom';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();

  // Redirección al hacer clic en "Adoptar!"
  const irAListadoAnimales = () => {
    navigate('/animales'); 
  };

  return (
    <div className="home-container">
      {/* HEADER / NAVBAR */}
      <header className="home-header">
        <button className="menu-btn">☰</button>
        <h1>Equipo de trabajo</h1>
        <button className="profile-btn">👤</button>
      </header>

      {/* SECCIÓN DEL EQUIPO (CAROUSEL) */}
      <section className="team-section">
        <button className="arrow-btn">◀</button>
        <div className="team-members">
          <div className="member-card">
            <img src="https://via.placeholder.com/150" alt="Henry Cavill" />
            <p>Henry Cavill</p>
          </div>
          <div className="member-card">
            <img src="https://via.placeholder.com/150" alt="Maria Lucia Munne" />
            <p>Maria Lucia Munne</p>
          </div>
          <div className="member-card">
            <img src="https://via.placeholder.com/150" alt="Ben Affleck" />
            <p>Ben Affleck</p>
          </div>
        </div>
        <button className="arrow-btn">▶</button>
      </section>

      {/* SECCIÓN DE INFORMACIÓN */}
      <section className="info-section">
        <div className="info-column">
          <h3>Quienes somos</h3>
          <p>Somos una agrupación solidaria que se dedica al rescate, cuidado y gestión de adopción de animales en situación de calle...</p>
        </div>
        <div className="info-column">
          <h3>Donde estamos</h3>
          <p>Radicados en Funes, contamos con un complejo que da asilo a los animales y una sala veterinaria...</p>
        </div>
        <div className="info-column">
          <h3>Donaciones</h3>
          <p>Para la realización de las mismas contactarse con "Henry Cavill", encargado del sector. Contacto: 2477-365874</p>
        </div>
      </section>

      {/* SECCIÓN DE ACCIÓN (BOTONES) */}
      <section className="action-section">
        <div className="action-card">
          {/* Un guiño con un cachorrito de placeholder */}
          <img src="https://images.unsplash.com/photo-1589965716319-4a041b58fa8a?auto=format&fit=crop&w=300&q=80" alt="Cachorros" className="action-img" />
          <button className="btn-primary" onClick={irAListadoAnimales}>
            Adoptar!
          </button>
        </div>
        
        <div className="action-card">
          <img src="https://via.placeholder.com/300x200?text=Formulario" alt="Icono Formulario" className="action-img" />
          <button className="btn-secondary">
            Completar formulario de adopción
          </button>
        </div>
      </section>
    </div>
  );
};