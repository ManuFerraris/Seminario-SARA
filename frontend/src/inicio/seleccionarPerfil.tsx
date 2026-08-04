import { useNavigate } from 'react-router-dom';

export default function SeleccionarPerfil() {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#F8F9F9',
      padding: '20px',
      fontFamily: 'sans-serif'
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      padding: '40px',
      maxWidth: '450px',
      width: '100%',
      textAlign: 'center' as const
    },
    title: {
      color: '#2C3E50',
      marginBottom: '10px'
    },
    subtitle: {
      color: '#7F8C8D',
      marginBottom: '30px',
      fontSize: '16px'
    },
    btnStaff: {
      display: 'block',
      width: '100%',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#2C3E50',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    btnAdoptante: {
      display: 'block',
      width: '100%',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#3498DB',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s'
    },
    btnLogin: {
      display: 'block',
      width: '100%',
      padding: '15px',
      marginBottom: '15px',
      backgroundColor: '#e47022',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background 0.3s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>¡Hola de nuevo!</h1>
        <p style={styles.subtitle}>
          Vemos que eres parte de nuestro equipo, pero también estás registrado como adoptante. ¿Cómo deseas ingresar hoy?
        </p>

        <button 
          style={styles.btnStaff} 
          onClick={() => navigate('/menu')}
        >
          ⚙️ Ingresar al Menú de Gestión
        </button>

        <button 
          style={styles.btnAdoptante} 
          onClick={() => navigate('/alta-entrevista')}
        >
          🐾 Ver animales en adopción
        </button>

        <button
          style={styles.btnLogin}
          onClick={() => navigate('/login')}
        >
          ← Regresar
        </button>
      </div>
    </div>
  );
}