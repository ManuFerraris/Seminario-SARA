import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Definimos una interfaz para los datos del animal encontrado
interface AnimalData {
  especie: string;
  edad: string;
  raza: string;
  estado: string;
}

export default function AltaAnimal() {
  const navigate = useNavigate();
  
  // Estados para manejar la lógica de la vista
  const [numeroBusqueda, setNumeroBusqueda] = useState('');
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [nuevoEstado, setNuevoEstado] = useState('Disponible');
  const [isSuccess, setIsSuccess] = useState(false); // Controla qué pantalla se muestra

  const handleBuscar = () => {
    // SIMULACIÓN: Solo el animal 156 existe en la base de datos para este ejemplo
    if (numeroBusqueda === '156') {
      setAnimalData({
        especie: 'PERRO',
        edad: '3',
        raza: 'DOGO ARGENTINO',
        estado: 'NO APTO',
      });
    } else {
      setAnimalData(null);
      // Alerta de error si no se encuentra
      Swal.fire({
        icon: 'warning',
        title: 'Atencion',
        text: `No se encontro el animal con el numero ${numeroBusqueda} para dar de alta en el catalogo`,
        confirmButtonColor: '#E67E22',
      });
    }
  };

  const handleDarDeAlta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!animalData) return;

    // Aquí conectarías con tu backend (TypeScript/Mikro-ORM) para actualizar el estado a "Disponible"
    console.log(`Guardando animal ${numeroBusqueda} con estado: ${nuevoEstado}`);
    
    // Cambiamos a la "Pantalla 2" de éxito
    setIsSuccess(true);
  };

  const handleAltaOtro = () => {
    // Reseteamos todos los estados para volver a la Pantalla 1 limpia
    setIsSuccess(false);
    setNumeroBusqueda('');
    setAnimalData(null);
    setNuevoEstado('Disponible');
  };

  const handleVolverMenu = () => {
    navigate(-1); // O navigate('/') dependiendo de tu ruteo
  };

  // ==========================================
  // PANTALLA 2: VISTA DE ÉXITO
  // ==========================================
  if (isSuccess) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.checkIcon}>✅</div>
          <h1 style={styles.successTitle}>Animal publicado con exito</h1>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Nro. del Animal:</span>
            <span style={styles.infoValue}>{numeroBusqueda}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Estado del animal:</span>
            <span style={styles.infoValue}>{nuevoEstado}</span>
          </div>

          <div style={styles.successButtonsContainer}>
            <button style={styles.buttonSubmit} onClick={handleAltaOtro}>
              Dar de alta otro animal
            </button>
            <button style={styles.buttonBack} onClick={handleVolverMenu}>
              Regresar al menu principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANTALLA 1: FORMULARIO DE ALTA
  // ==========================================
  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Alta de animal para adopcion</h1>
      </div>

      <div style={styles.formContainer}>
        <label style={styles.label}>Ingrese el numero del animal</label>
        
        <div style={styles.searchGroup}>
          <input
            style={{ ...styles.input, marginBottom: 0, flex: 1 }}
            type="text"
            placeholder="Ej: 156"
            value={numeroBusqueda}
            onChange={(e) => setNumeroBusqueda(e.target.value.replace(/\D/g, ''))}
          />
          <button type="button" style={styles.searchButton} onClick={handleBuscar}>
            🔍 Buscar
          </button>
        </div>

        {/* Solo se muestran estos campos si el animal fue encontrado */}
        {animalData && (
          <form onSubmit={handleDarDeAlta} style={styles.animalDataForm}>
            <label style={styles.label}>ESPECIE</label>
            <input style={styles.inputReadOnly} type="text" value={animalData.especie} readOnly />

            <label style={styles.label}>EDAD ESTIMADA</label>
            <input style={styles.inputReadOnly} type="text" value={animalData.edad} readOnly />

            <label style={styles.label}>RAZA</label>
            <input style={styles.inputReadOnly} type="text" value={animalData.raza} readOnly />

            <label style={styles.label}>ESTADO</label>
            <div style={styles.estadoGroup}>
              <span style={styles.estadoOriginal}>{animalData.estado}</span>
              <span style={styles.arrow}> ➔ </span>
              <select 
                style={styles.select} 
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
              >
                <option value="Disponible">Disponible</option>
              </select>
            </div>

            <button type="submit" style={styles.buttonSubmit}>
              Dar de Alta
            </button>
          </form>
        )}

        <button type="button" style={styles.buttonBack} onClick={handleVolverMenu}>
          Volver
        </button>
      </div>
    </div>
  );
}

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px 20px',
    backgroundColor: '#F8F9FA',
    fontFamily: 'Arial, sans-serif',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  title: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#2C3E50',
    margin: '0',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '450px',
    backgroundColor: '#FFFFFF',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  searchGroup: {
    display: 'flex',
    gap: '10px',
    marginBottom: '25px',
  },
  searchButton: {
    backgroundColor: '#3498DB',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    padding: '0 15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  animalDataForm: {
    display: 'flex',
    flexDirection: 'column',
    borderTop: '1px solid #ECF0F1',
    paddingTop: '20px',
  },
  label: {
    fontSize: '13px',
    color: '#7F8C8D',
    marginBottom: '6px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #BDC3C7',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#2C3E50',
    outline: 'none',
  },
  inputReadOnly: {
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#95A5A6',
    backgroundColor: '#F9F9F9',
    outline: 'none',
  },
  estadoGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '25px',
    gap: '15px',
  },
  estadoOriginal: {
    fontSize: '15px',
    color: '#E74C3C',
    fontWeight: 'bold',
    textDecoration: 'line-through',
  },
  arrow: {
    color: '#7F8C8D',
    fontWeight: 'bold',
  },
  select: {
    flex: 1,
    padding: '12px',
    border: '1px solid #27AE60',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#27AE60',
    fontWeight: 'bold',
    backgroundColor: '#EAFAF1',
    outline: 'none',
  },
  buttonSubmit: {
    backgroundColor: '#27AE60',
    color: '#FFFFFF',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  buttonBack: {
    backgroundColor: '#95A5A6',
    color: '#FFFFFF',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  
  // Estilos de la Pantalla 2 (Éxito)
  successCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    maxWidth: '450px',
    backgroundColor: '#FFFFFF',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  checkIcon: {
    fontSize: '50px',
    marginBottom: '15px',
  },
  successTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: '30px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 0',
    borderBottom: '1px solid #ECF0F1',
    marginBottom: '10px',
  },
  infoLabel: {
    fontWeight: 'bold',
    color: '#34495E',
  },
  infoValue: {
    color: '#27AE60',
    fontWeight: 'bold',
  },
  successButtonsContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginTop: '20px',
    gap: '10px',
  }
};