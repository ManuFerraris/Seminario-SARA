import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

// Definimos la estructura de los botones
interface MenuItem {
  label: string;
  path: string;
  allowedRoles: string[]; // Qué roles pueden ver este botón
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'REGISTRAR RESCATE ANIMAL', path: '/registro-rescate', allowedRoles: ['Colaborador'] },
  { label: 'REGISTRAR REVISION MEDICA', path: '/registrar-revision', allowedRoles: ['Veterinario'] },
  { label: 'REGISTRAR COLOCACION DE VACUNAS', path: '/colocacion-vacunas', allowedRoles: ['Veterinario'] },
  { label: 'REGISTRAR ALTA ANIMAL', path: '/alta-animal', allowedRoles: ['Colaborador'] },
  
  { label: 'REGISTRAR ALTA DE ENTREVISTA', path: '/registrar-entrevista', allowedRoles: ['Colaborador'] },
  //{ label: 'REGISTRAR ADOPCION', path: '/registrar-adopcion', allowedRoles: ['Colaborador'] },
  { label: 'REGISTRAR SEGUIMIENTO', path: '/registrar-seguimiento', allowedRoles: ['Colaborador'] },
  { label: 'REGISTAR RETIRO POR MALTRATO', path: '/retiro-maltrato', allowedRoles: ['Colaborador'] },
  // Baja animal podría ser ejecutada por ambos roles
  { label: 'REGISTRAR FALLECIMIENTO DE ANIMAL', path: '/baja-animal', allowedRoles: ['Colaborador', 'Veterinario'] },
  { label: 'REGISTRAR DONACIONES', path: '/registrar-donacion', allowedRoles: ['Colaborador'] },
  { label: 'GESTION DE PERSONAL', path: '/gestion-personal', allowedRoles: ['Colaborador'] },
];

export default function MenuPrincipal() {
  const navigate = useNavigate();
  const [userRoles, setUserRoles] = useState<string[]>([]);

  useEffect(() => {
    // Al montar el componente, leemos los roles del localStorage
    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      try {
        const parsedRoles = JSON.parse(storedRoles);
        setUserRoles(parsedRoles);
      } catch (error) {
        console.error('Error al leer los roles del localStorage', error);
      }
    } else {
      // Si por algún motivo llega al menú sin roles (ej. borró el localstorage), lo devolvemos al login
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    // Limpiamos los tokens y variables de sesión
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    console.log('Cerrando sesión...');
    navigate('/login');
  };

  // Filtramos los botones. 
  // Un botón se muestra SI ALGUNO (some) de los roles del usuario está incluido (includes) en los roles permitidos del botón.
  const botonesPermitidos = MENU_ITEMS.filter((item) =>
    item.allowedRoles.some((role) => userRoles.includes(role))
  );

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Menu Principal</h1>
        <p style={styles.subtitle}>
          Perfil activo: {userRoles.join(' y ')}
        </p>
      </div>

      <div style={styles.gridContainer}>
        {/* Renderizamos dinámicamente solo los botones permitidos */}
        {botonesPermitidos.map((item, index) => (
          <button 
            key={index} 
            style={styles.actionButton} 
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

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