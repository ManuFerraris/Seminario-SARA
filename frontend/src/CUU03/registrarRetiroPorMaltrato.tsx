import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig';

type ViewState = 'SEARCH_ADOPTION' | 'REGISTER_WITHDRAWAL' | 'SUCCESS';

interface AdopcionData {
  nombreAdoptante: string;
  apellidoAdoptante: string;
  numeroAnimal: string;
  especieAnimal: string;
  razaAnimal: string;
  fechaAdopcion: string;
  estadoAdoptante?: string;
  estadoAnimal?: string;
}

export default function RetiroMaltrato() {
  const navigate = useNavigate();

  // Control de vistas
  const [currentView, setCurrentView] = useState<ViewState>('SEARCH_ADOPTION');

  // Estados - Vista de Búsqueda
  const [numeroAdopcion, setNumeroAdopcion] = useState('');
  const [adopcionData, setAdopcionData] = useState<AdopcionData | null>(null);

  // Estados - Vista de Registro de Retiro
  const [motivosRetiro, setMotivosRetiro] = useState('');
  const [evidenciaMaltrato, setEvidenciaMaltrato] = useState('');
  const [fechaRetiro, setFechaRetiro] = useState('');
  const [estadoAdoptante, setEstadoAdoptante] = useState('');
  const [estadoAnimal, setEstadoAnimal] = useState('');
  
  // ESTADO: Para guardar los archivos seleccionados
  const [archivosEvidencia, setArchivosEvidencia] = useState<File[]>([]);

  // -------------------------------------------------------------------------
  // MÉTODOS DE ACCIÓN
  // -------------------------------------------------------------------------

  const handleBuscarAdopcion = async () => {
    if (!numeroAdopcion.trim()) return;

    try {
      const response = await api.get(`/adopcion/${numeroAdopcion}`);
      const adopcion = response.data.data;
      console.log('Datos de adopción obtenidos:', adopcion);

      setAdopcionData({
        nombreAdoptante: adopcion.adoptante?.persona?.nombre || 'N/A',
        apellidoAdoptante: adopcion.adoptante?.persona?.apellido || 'N/A',
        numeroAnimal: adopcion.animal?.nro_animal?.toString() || 'N/A',
        especieAnimal: adopcion.animal?.especie || 'N/A',
        razaAnimal: adopcion.animal?.raza || 'N/A',
        fechaAdopcion: new Date(adopcion.fecha_adopcion).toLocaleDateString('es-AR')
      });

    } catch (error: any) {
      setAdopcionData(null);
      Swal.fire({
        icon: 'error',
        title: 'Error de búsqueda',
        html: `<b>Adopción no encontrada</b><br/>Número de adopción no encontrado`,
        confirmButtonColor: '#E74C3C',
      });
    }
  };

  const handleRealizarRetiro = () => {
    if (adopcionData) {
      setCurrentView('REGISTER_WITHDRAWAL');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setArchivosEvidencia(Array.from(e.target.files));
    }
  };

  const handleConfirmarRetiro = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      
      formData.append('nro_adopcion', numeroAdopcion);
      formData.append('motivos', motivosRetiro);
      formData.append('descripcion_evidencia', evidenciaMaltrato);
      formData.append('fecha_retiro', fechaRetiro);
      
      archivosEvidencia.forEach((archivo) => {
        formData.append('archivos', archivo); 
      });

      const response = await api.post('/retiro/registrar', formData);
      console.log('Retiro registrado con éxito:', response);
      const data = response.data.data;
      setEstadoAdoptante(data.estado_adoptante);
      setEstadoAnimal(data.estado_animal);

      setCurrentView('SUCCESS');

    } catch (error: any) {
      const backendMessages = error.response?.data?.messages || error.response?.data?.message;
      let textoError = 'Error al procesar el retiro.';
      
      if (backendMessages && Array.isArray(backendMessages) && backendMessages.length > 0) {
          textoError = backendMessages.join('\n');
      } else if (typeof backendMessages === 'string') {
          textoError = backendMessages;
      }

      Swal.fire({
        icon: 'error',
        title: 'Atención',
        text: textoError,
        confirmButtonColor: '#E74C3C'
      });
    }
  };

  const handleRegresar = () => {
    if (currentView === 'REGISTER_WITHDRAWAL') {
      setCurrentView('SEARCH_ADOPTION');
    } else if (currentView === 'SUCCESS') {
      setNumeroAdopcion('');
      setAdopcionData(null);
      setMotivosRetiro('');
      setEvidenciaMaltrato('');
      setFechaRetiro('');
      setArchivosEvidencia([]);
      setCurrentView('SEARCH_ADOPTION');
    } else {
      navigate(-1);
    }
  };

  // -------------------------------------------------------------------------
  // VISTA 3: ÉXITO (4-FS-retiro_completado)
  // -------------------------------------------------------------------------
  if (currentView === 'SUCCESS') {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.checkIcon}>✅</div>
          <h2 style={styles.successTitle}>Retiro registrado con éxito</h2>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Nro. de adopción:</span>
            <span style={styles.infoValue}>{numeroAdopcion}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Estado adoptante</span>
            <span style={styles.infoValueDanger}>{estadoAdoptante}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Estado animal</span>
            <span style={styles.infoValueWarning}>{estadoAnimal}</span>
          </div>

          <button style={styles.buttonBackLarge} onClick={handleRegresar}>
            Regresar
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 2: REGISTRAR RETIRO (3-FE-registro_retiro)
  // -------------------------------------------------------------------------
  if (currentView === 'REGISTER_WITHDRAWAL') {
    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Registrar retiro</h1>
          <button style={styles.volverHeaderBtn} onClick={handleRegresar}>Volver</button>
        </div>

        <form style={styles.formContainer} onSubmit={handleConfirmarRetiro}>
          {/* AQUÍ ESTÁN LOS CAMPOS RESTAURADOS */}
          <label style={styles.labelCentered}>Motivos de retiro</label>
          <input 
            style={styles.input} 
            type="text" 
            value={motivosRetiro} 
            onChange={e => setMotivosRetiro(e.target.value)} 
            required 
          />

          <label style={styles.labelCentered}>Evidencia de maltrato</label>
          <input 
            style={styles.input} 
            type="text" 
            value={evidenciaMaltrato} 
            onChange={e => setEvidenciaMaltrato(e.target.value)} 
            required 
          />

          <label style={styles.labelCentered}>Fecha de retiro</label>
          <input 
            style={styles.dateInput} 
            type="date" 
            value={fechaRetiro} 
            onChange={e => setFechaRetiro(e.target.value)} 
            required 
          />

          <label style={styles.labelCentered}>Ingresar fotografía/s y video/s</label>
          <input 
            style={{...styles.input, padding: '10px'}} 
            type="file" 
            multiple 
            accept="image/*,video/*"
            onChange={handleFileChange} 
          />

          <button type="submit" style={styles.buttonSubmit}>
            Confirmar retiro
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 1: BUSCAR ADOPCION (1-FE-ingreso_adopcion / 2-FS-datos_adopcion)
  // -------------------------------------------------------------------------
  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Buscar adopción</h1>
        <button style={styles.volverHeaderBtn} onClick={handleRegresar}>Volver</button>
      </div>

      <div style={styles.formContainer}>
        <label style={styles.labelCentered}>Ingrese el número de adopción</label>
        
        <div style={{ display: 'flex', width: '100%', marginBottom: '25px' }}>
          <input 
            style={{
              flex: 1,
              padding: '12px',
              border: '2px solid #3498DB',
              borderRight: 'none',
              borderRadius: '5px 0 0 5px',
              fontSize: '14px',
              textAlign: 'center',
              color: '#2C3E50',
              outline: 'none',
              backgroundColor: '#FFFFFF'
            }}
            type="text" 
            placeholder="Ej: 57" 
            value={numeroAdopcion} 
            onChange={e => setNumeroAdopcion(e.target.value.replace(/\D/g, ''))} 
          />
          <button 
            type="button" 
            style={{
              backgroundColor: '#FFFFFF',
              color: '#3498DB',
              border: '2px solid #3498DB',
              borderLeft: 'none',
              borderRadius: '0 5px 5px 0',
              padding: '0 20px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }} 
            onClick={handleBuscarAdopcion}
          >
            🔍
          </button>
        </div>

        {adopcionData && (
          <div style={styles.dataContainer}>
            <label style={styles.labelCentered}>Nombre del Adoptante</label>
            <input style={styles.inputReadOnly} type="text" value={adopcionData.nombreAdoptante} readOnly />

            <label style={styles.labelCentered}>Apellido del adoptante</label>
            <input style={styles.inputReadOnly} type="text" value={adopcionData.apellidoAdoptante} readOnly />

            <label style={styles.labelCentered}>Número del animal</label>
            <input style={styles.inputReadOnly} type="text" value={adopcionData.numeroAnimal} readOnly />

            <label style={styles.labelCentered}>Especie del animal</label>
            <input style={styles.inputReadOnly} type="text" value={adopcionData.especieAnimal} readOnly />

            <label style={styles.labelCentered}>Raza del animal</label>
            <input style={styles.inputReadOnly} type="text" value={adopcionData.razaAnimal} readOnly />

            <label style={styles.labelCentered}>Fecha de Adopción</label>
            <input style={styles.inputReadOnly} type="text" value={adopcionData.fechaAdopcion} readOnly />

            <button type="button" style={styles.buttonSubmit} onClick={handleRealizarRetiro}>
              Realizar retiro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

  // -------------------------------------------------------------------------
  // ESTILOS
  // -------------------------------------------------------------------------
  const styles: { [key: string]: React.CSSProperties } = {
    dateInput: {
      backgroundColor: '#FFFFFF',
      border: '1px solid #BDC3C7',
      borderRadius: '5px',
      padding: '12px',
      marginBottom: '20px',
      fontSize: '14px',
      textAlign: 'center',
      color: '#000000', // Asegura que el texto y las barras del calendario sean oscuras
      outline: 'none',
      width: '95%',
      colorScheme: 'light', // MAGIA: Le dice al navegador que el calendario renderizado debe ser la versión clara, evitando iconos blancos invisibles.
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Arial, sans-serif',
        padding: '40px 20px',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '500px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        marginBottom: '30px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#000',
        margin: 0,
        flex: 1,
        textAlign: 'center',
    },
    volverHeaderBtn: {
        backgroundColor: '#7F8C8D',
        color: '#FFF',
        border: 'none',
        borderRadius: '15px',
        padding: '6px 16px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '450px',
    },
    dataContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        marginTop: '10px',
    },
    labelCentered: {
        fontSize: '13px',
        color: '#000',
        marginBottom: '6px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#ECF0F1',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '15px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#2C3E50',
        outline: 'none',
    },
    inputReadOnly: {
        backgroundColor: '#F2F3F4',
        border: 'none',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#7F8C8D',
        outline: 'none',
    },
    buttonSubmit: {
        backgroundColor: '#689F38', // Verde claro similar al bosquejo
        color: '#FFFFFF',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    buttonBackLarge: {
        backgroundColor: '#95A5A6',
        color: '#FFFFFF',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '30px',
        width: '100%',
    },
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
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '30px',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '12px 0',
        borderBottom: '1px solid #ECF0F1',
    },
    infoLabel: {
        fontWeight: 'bold',
        color: '#34495E',
    },
    infoValue: {
        color: '#2C3E50',
        fontWeight: 'bold',
    },
    infoValueDanger: {
        color: '#E74C3C', // Rojo para "No apto"
        fontWeight: 'bold',
    },
    infoValueWarning: {
        color: '#F39C12', // Naranja para "No disponible"
        fontWeight: 'bold',
    }
    };