import { useNavigate } from 'react-router-dom';

export default function MenuPrincipal() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes limpiar tokens de sesión o estado del usuario antes de salir
    console.log('Cerrando sesión...');
    navigate('/login');
  };

  const handleAction = (accion: string) => {
    // TODO: Conectar estas acciones con los endpoints de la API TypeScript 
    // para persistir los eventos en la base de datos MySQL (Aiven) mediante Mikro-ORM.
    console.log(`Navegando a la acción: ${accion}`);
    // navigate(`/${accion.toLowerCase().replace(/ /g, '-')}`);
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Menu Principal</h1>
      </div>

      {/* Panel de botones principal usando CSS Grid */}
      <div style={styles.gridContainer}>
        <button style={styles.actionButton} onClick={() => navigate('/registro-rescate')}>
          REGISTRAR RESCATE ANIMAL
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/alta-animal')}>
          REGISTRAR ALTA ANIMAL
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/colocacion-vacunas')}>
          REGISTRAR COLOCACION DE VACUNAS
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/registrar-revision')}>
          REGISTRAR REVISION MEDICA
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/registrar-entrevista')}>
          REGISTRAR ALTA DE ENTREVISTA
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/registrar-adopcion')}>
          REGISTRAR ADOPCION
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/registrar-seguimiento')}>
          REGISTRAR SEGUIMIENTO
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/retiro-maltrato')}>
          REGISTAR RETIRO POR MALTRATO
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/baja-animal')}>
          REGISTRAR FALLECIMIENTO DE ANIMAL
        </button>
        <button style={styles.actionButton} onClick={() => navigate('/registrar-donacion')}>
          REGISTRAR DONACIONES
        </button>
      </div>

      {/* Botón de Salir */}
      <div style={styles.footerContainer}>
        <button style={styles.exitButton} onClick={handleLogout}>
          SALIR
        </button>
      </div>
    </div>
  );
}

// Estilos adaptados para un panel de control Web
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
    minHeight: '100vh',
    backgroundColor: '#F8F9FA',
    fontFamily: 'Arial, sans-serif',
  },
  headerContainer: {
    marginBottom: '40px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2C3E50',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '900px', // Limita el ancho en pantallas muy grandes
    marginBottom: '50px',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    color: '#2C3E50',
    padding: '20px',
    border: '2px solid #BDC3C7',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textAlign: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease-in-out',
  },
  footerContainer: {
    marginTop: 'auto', // Empuja el botón hacia abajo si hay espacio
    width: '100%',
    maxWidth: '300px',
  },
  exitButton: {
    width: '100%',
    backgroundColor: '#E74C3C', // Rojo para la acción de salir/peligro
    color: '#FFFFFF',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }
};