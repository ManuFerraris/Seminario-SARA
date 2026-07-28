import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig';

type ViewState = 'LANDING' | 'ANIMAL_LIST' | 'DATE_TIME_SELECT' | 'SUCCESS';

interface Animal {
  id: number;
  especie: string;
  edad: string;
  fechaIngreso: string;
  estado: string;
}

// Interfaz para guardar los datos de la respuesta exitosa
interface EntrevistaExitosa {
  nro_animal: number;
  fecha: string;
  hora: string;
  dni_adoptante: string;
  estado_entrevista: string;
  estado_animal: string;
}

export default function AltaEntrevista() {
  const navigate = useNavigate();

  // Control de vistas
  const [currentView, setCurrentView] = useState<ViewState>('LANDING');

  // Estados del flujo
  const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
  const [fechaEntrevista, setFechaEntrevista] = useState('');
  const [horaEntrevista, setHoraEntrevista] = useState('');

  // Estados de datos conectados
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [cargandoAnimales, setCargandoAnimales] = useState(false);
  const [datosExito, setDatosExito] = useState<EntrevistaExitosa | null>(null);

  const obtenerDniDelToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      // Agarramos la segunda parte del token (el payload)
      const payloadBase64 = token.split('.')[1];
      
      // Lo decodificamos de Base64 a texto normal
      const payloadDecodificado = atob(payloadBase64);
      
      // Lo convertimos a un objeto JSON de JavaScript
      const payloadJson = JSON.parse(payloadDecodificado);
      
      // Retornamos el DNI
      return payloadJson.dni;
    } catch (error) {
      console.error("Error leyendo el token:", error);
      return null;
    }
  };

  // -------------------------------------------------------------------------
  // MÉTODOS DE ACCIÓN
  // -------------------------------------------------------------------------

  const handleQuieroAdoptar = async () => {
    setCurrentView('ANIMAL_LIST');
    setCargandoAnimales(true);

    try {
      // 1. Buscamos solo los animales disponibles
      const response = await api.get('/animal/estado-disponible');
      console.log('Animales disponibles:', response.data.data);
      // Mapeamos los datos del backend a tu interfaz Animal
      const animalesMapeados = response.data.data.map((a: any) => ({
        id: a.nro_animal,
        especie: a.especie,
        edad: a.edad_estimada,
        fechaIngreso: new Date(a.fecha_ingreso).toLocaleDateString('es-AR'),
        estado: a.estado,
      }));
      
      setAnimales(animalesMapeados);
      console.log('Animales mapeados:', animalesMapeados);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudieron cargar los animales.' });
    } finally {
      setCargandoAnimales(false);
    }
  };

  const handleAdoptarClic = (animalId: number) => {
    // Ya no hacemos el chequeo hardcodeado acá. 
    // Avanzamos a la selección de fecha y validamos todo en el submit final.
    setSelectedAnimalId(animalId);
    setCurrentView('DATE_TIME_SELECT');
  };

  const handleConfirmarFechaHora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaEntrevista || !horaEntrevista) {
      Swal.fire({ 
        icon: 'info', 
        title: 'Atención', 
        text: 'Debe seleccionar fecha y hora.' 
      });
      return;
    }

    const dni_adoptante = obtenerDniDelToken();
    if (!dni_adoptante) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Error de sesión', 
        text: 'No se pudo identificar al usuario. Por favor, vuelva a iniciar sesión.' 
      });
      return;
    }

    try {
      // 3. Unificamos la fecha y hora para que el backend de Node lo entienda como Date
      const fechaHoraCombinada = `${fechaEntrevista}T${horaEntrevista}:00`;

      // 4. Armamos el payload con los nombres exactos que espera el controlador
      const payload = {
        nro_animal: selectedAnimalId,
        fecha_hora: fechaHoraCombinada,
        dni_adoptante: dni_adoptante // ¡Ahora sí enviamos el real!
      };

      const response = await api.post('/entrevista/registrar', payload);
      
      // Guardamos los datos que devuelve el backend
      setDatosExito({
        nro_animal: response.data.data.nro_animal,
        fecha: fechaEntrevista,
        hora: horaEntrevista,
        dni_adoptante: response.data.data.dni_adoptante, 
        estado_entrevista: 'Activa',
        estado_animal: 'No disponible'
      });

      setCurrentView('SUCCESS');

    } catch (error: any) {
      const status = error.response?.status;
      const mensajeBack = error.response?.data?.messages?.[0];

      if (status === 403 || status === 409) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          html: `<b>Inhabilitado para adoptar</b><br/><br/>${mensajeBack || 'Si considera que es un error, comuníquese con nosotros'}`,
          confirmButtonColor: '#F39C12',
          background: '#F1C40F',
          color: '#FFFFFF'
        });
      } else {
        Swal.fire({ icon: 'error', title: 'Error', text: 'Ocurrió un problema al agendar la entrevista.' });
      }
    }
  };

  const handleVolver = () => {
    if (currentView === 'SUCCESS') {
      setSelectedAnimalId(null);
      setFechaEntrevista('');
      setHoraEntrevista('');
      setDatosExito(null);
      handleQuieroAdoptar(); // Recargamos la lista por si el animal ya no está disponible
    } else if (currentView === 'DATE_TIME_SELECT') {
      setCurrentView('ANIMAL_LIST');
    } else if (currentView === 'ANIMAL_LIST') {
      setCurrentView('LANDING');
    } else {
      navigate(-1);
    }
  };

  // -------------------------------------------------------------------------
  // VISTA 4: ÉXITO (3-FS-entevista_confirmada)
  // -------------------------------------------------------------------------
  if (currentView === 'SUCCESS' && datosExito) {
    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Entrevista registrada con éxito</h1>
          <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.successCard}>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Estado animal:</span>
            <span style={styles.infoValueWarning}>{datosExito.estado_animal}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Estado entrevista:</span>
            <span style={styles.infoValueSuccess}>{datosExito.estado_entrevista}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>DNI adoptante:</span>
            <span style={styles.infoValue}>{datosExito.dni_adoptante}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Nro. animal:</span>
            <span style={styles.infoValue}>{datosExito.nro_animal}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Fecha:</span>
            <span style={styles.infoValue}>{datosExito.fecha}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Hora:</span>
            <span style={styles.infoValue}>{datosExito.hora}</span>
          </div>
          
          <div style={{...styles.infoRow, flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none'}}>
            <span style={styles.infoLabel}>Descripción:</span>
            <textarea style={styles.textAreaReadOnly} readOnly value="Entrevista programada para evaluación de adopción." />
          </div>

          <button style={styles.buttonRegresar} onClick={handleVolver}>
            Regresar
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 3: DEFINIR FECHA (2-FE-listado_fecha_hora)
  // -------------------------------------------------------------------------
  if (currentView === 'DATE_TIME_SELECT') {
    // Igual que tu código original... (lo omito para no alargar la respuesta, 
    // pero funciona exactamente igual usando tus estados)
    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Definir fecha</h1>
          <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <form style={styles.formContainer} onSubmit={handleConfirmarFechaHora}>
          <label style={styles.labelCentered}>Seleccionar una fecha</label>
          <input 
            style={styles.input} 
            type="date" 
            value={fechaEntrevista} 
            onChange={e => setFechaEntrevista(e.target.value)} 
            required 
          />

          <label style={styles.labelCentered}>Seleccionar el horario</label>
          <input 
            style={styles.input} 
            type="time" 
            value={horaEntrevista} 
            onChange={e => setHoraEntrevista(e.target.value)} 
            required 
          />

          <button type="submit" style={styles.buttonSubmit}>
            Confirmar fecha y hora
          </button>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 2: GRILLA DE ANIMALES (1-FS-datos_ficha)
  // -------------------------------------------------------------------------
  if (currentView === 'ANIMAL_LIST') {
    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Animales listos para ser adoptados</h1>
          <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.scrollableWrapper}>
          {cargandoAnimales ? (
            <p style={{ textAlign: 'center', marginTop: '20px' }}>Cargando animales...</p>
          ) : (
            <div style={styles.gridContainer}>
              {animales.length === 0 ? (
                <p style={{ textAlign: 'center', width: '100%' }}>No hay animales disponibles en este momento.</p>
              ) : (
                animales.map(animal => (
                  <div key={animal.id} style={styles.animalCard}>
                    <div style={styles.iconPlaceholder}>
                      <span style={styles.iconBracket}>{`{ }`}</span>
                    </div>
                    <div style={styles.animalDetails}>
                      <p style={styles.animalText}>Especie: {animal.especie}</p>
                      <p style={styles.animalText}>Edad: {animal.edad}</p>
                      <p style={styles.animalText}>Fecha Ingreso: {animal.fechaIngreso}</p>
                      <p style={styles.animalText}>Estado: {animal.estado}</p>
                    </div>
                    <button style={styles.btnAdoptar} onClick={() => handleAdoptarClic(animal.id)}>
                      Adoptar
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 1: LANDING PAGE (1-FE-seleccion_ficha)
  // -------------------------------------------------------------------------
  return (
    // Queda exactamente igual a tu código original...
    <div style={styles.container}>
      <div style={styles.headerRowLanding}>
        <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
      </div>
      
      <h1 style={styles.landingTitle}>SARA Protectora</h1>

      <div style={styles.scrollableWrapper}>
        <div style={styles.landingContent}>
          <h2 style={styles.sectionTitle}>Quienes somos ?</h2>
          <p style={styles.paragraphText}>Lorem ipsum...</p>
          <button style={styles.btnQuieroAdoptar} onClick={handleQuieroAdoptar}>
            Quiero adoptar!
          </button>
        </div>
      </div>
    </div>
  );
}


    // -------------------------------------------------------------------------
    // ESTILOS
    // -------------------------------------------------------------------------
    const styles: { [key: string]: React.CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '900px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        marginBottom: '20px',
    },
    headerRowLanding: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        maxWidth: '900px',
        marginBottom: '10px',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#000',
        margin: 0,
        textDecoration: 'underline',
        flex: 1,
        textAlign: 'center',
    },
    landingTitle: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '30px',
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
    scrollableWrapper: {
        width: '100%',
        maxWidth: '900px',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        maxHeight: '85vh',
        paddingRight: '10px',
    },
    // Estilos Landing
    landingContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '700px',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#34495E',
        alignSelf: 'flex-start',
        marginBottom: '10px',
        marginTop: '20px',
    },
    paragraphText: {
        fontSize: '14px',
        color: '#7F8C8D',
        lineHeight: '1.6',
        textAlign: 'justify',
        marginBottom: '10px',
    },
    btnQuieroAdoptar: {
        backgroundColor: '#2980B9',
        color: '#FFFFFF',
        padding: '15px 40px',
        border: 'none',
        borderRadius: '30px',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '40px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    },
    // Estilos Grilla Animales
    gridContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '30px',
        width: '100%',
        padding: '20px 0',
    },
    animalCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px',
    },
    iconPlaceholder: {
        width: '100px',
        height: '100px',
        border: '4px solid #3498DB',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '15px',
    },
    iconBracket: {
        fontSize: '40px',
        color: '#3498DB',
        fontWeight: 'bold',
    },
    animalDetails: {
        width: '100%',
        marginBottom: '15px',
    },
    animalText: {
        margin: '2px 0',
        fontSize: '13px',
        color: '#2C3E50',
    },
    btnAdoptar: {
        backgroundColor: '#008000',
        color: '#FFFFFF',
        padding: '8px 25px',
        border: 'none',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    // Estilos Formularios
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '450px',
        marginTop: '30px',
    },
    labelCentered: {
        fontSize: '14px',
        color: '#000',
        marginBottom: '10px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#ECF0F1',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '25px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#2C3E50',
        outline: 'none',
    },
    buttonSubmit: {
        backgroundColor: '#008000',
        color: '#FFFFFF',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '20px',
    },
    // Estilos Éxito
    successCard: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        marginTop: '20px',
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
        marginBottom: '5px',
    },
    infoValue: {
        color: '#2C3E50',
        fontWeight: 'bold',
    },
    infoValueWarning: {
        color: '#F39C12',
        fontWeight: 'bold',
    },
    infoValueSuccess: {
        color: '#27AE60',
        fontWeight: 'bold',
    },
    textAreaReadOnly: {
        width: '100%',
        backgroundColor: '#F2F3F4',
        border: 'none',
        borderRadius: '5px',
        padding: '12px',
        marginTop: '10px',
        fontSize: '14px',
        color: '#7F8C8D',
        outline: 'none',
        resize: 'none',
        minHeight: '60px',
    },
    buttonRegresar: {
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
};