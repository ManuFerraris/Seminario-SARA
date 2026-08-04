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
  fotoUrl?: string;
}

interface EntrevistaExitosa {
  id_entrevista: number;
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
      const payloadBase64 = token.split('.')[1];
      const payloadDecodificado = atob(payloadBase64);
      const payloadJson = JSON.parse(payloadDecodificado);
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
      const response = await api.get('/animal/estado-disponible');
      console.log('Respuesta del backend:', response);

      const animalesMapeados = response.data.data.map((a: any) => {
        const urlMaterial = a.audiovisuales && a.audiovisuales.length > 0 
          ? a.audiovisuales[0].url_material 
          : null;

        return {
          id: a.nro_animal,
          especie: a.especie,
          edad: a.edad_estimada,
          fechaIngreso: new Date(a.fecha_ingreso).toLocaleDateString('es-AR'),
          estado: a.estado,
          fotoUrl: urlMaterial
        };
      });
      
      setAnimales(animalesMapeados);
    } catch (error : any) {
      Swal.fire({ 
        icon: 'error', 
        title: 'Error', 
        text: error.message || 'No se pudieron cargar los animales.' });
    } finally {
      setCargandoAnimales(false);
    }
  };

  const handleAdoptarClic = (animalId: number) => {
    setSelectedAnimalId(animalId);
    setCurrentView('DATE_TIME_SELECT');
  };

  const handleConfirmarFechaHora = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaEntrevista || !horaEntrevista) {
      Swal.fire({ icon: 'info', title: 'Atención', text: 'Debe seleccionar fecha y hora.' });
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
      const fechaHoraCombinada = `${fechaEntrevista}T${horaEntrevista}:00`;

      const payload = {
        nro_animal: selectedAnimalId,
        fecha_hora: fechaHoraCombinada,
        dni_adoptante: dni_adoptante
      };

      const response = await api.post('/entrevista/registrar', payload);
      console.log('Respuesta del backend:', response);

      setDatosExito({
        id_entrevista: response.data.data.id_entrevista,
        nro_animal: response.data.data.nro_animal,
        fecha: fechaEntrevista,
        hora: horaEntrevista,
        dni_adoptante: response.data.data.dni_adoptante, 
        estado_entrevista: 'Activa',
        estado_animal: 'No disponible'
      });

      setCurrentView('SUCCESS');

    } catch (error: any) {
      console.error('Error capturado por Axios:', error.response);
      
      const status = error.response?.status;
      const backendMessages = error.response?.data?.messages || error.response?.data?.message;

      // 1. Extraemos los mensajes reales del backend.
      // ATENCIÓN: Aquí usamos <br/> en lugar de \n porque lo inyectaremos en la propiedad 'html'
      let mensajesFormateados = 'Ocurrió un problema al agendar la entrevista.';
      
      if (backendMessages && Array.isArray(backendMessages) && backendMessages.length > 0) {
          mensajesFormateados = backendMessages.join('<br/>');
      } else if (typeof backendMessages === 'string') {
          mensajesFormateados = backendMessages;
      }

      // 2. Evaluamos el status para mostrar la alerta correspondiente
      if (status === 403 || status === 409) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          // Inyectamos todos los errores extraídos usando interpolación
          html: `<b>Inhabilitado para adoptar</b><br/><br/>${mensajesFormateados}`,
          confirmButtonColor: '#F39C12',
          background: '#F1C40F',
          color: '#FFFFFF'
        });
      } else {
        // Para errores 400, 500 u otros, mostramos también los mensajes formateados
        Swal.fire({ 
          icon: 'error', 
          title: 'Error', 
          html: mensajesFormateados, // Usamos html aquí también para mantener la consistencia
          confirmButtonColor: '#E74C3C'
        });
      }
    }
  };

  const handleVolver = () => {
    if (currentView === 'SUCCESS') {
      setSelectedAnimalId(null);
      setFechaEntrevista('');
      setHoraEntrevista('');
      setDatosExito(null);
      handleQuieroAdoptar();
    } else if (currentView === 'DATE_TIME_SELECT') {
      setCurrentView('ANIMAL_LIST');
    } else if (currentView === 'ANIMAL_LIST') {
      setCurrentView('LANDING');
    } else {
      navigate(-1);
    }
  };

  // -------------------------------------------------------------------------
  // VISTA 4: ÉXITO (3-FS-entrevista_confirmada)
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
            <span style={styles.infoLabel}>ID entrevista:</span>
            <span style={styles.infoValue}>{datosExito.id_entrevista}</span>
          </div>
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
                    <div style={{
                      ...styles.iconPlaceholder, 
                      padding: 0, 
                      overflow: 'hidden', 
                      backgroundColor: '#f5f5f5' // Un fondo gris claro por si no hay foto
                    }}>
                      {animal.fotoUrl ? (
                        <img 
                          // Como src hace un GET directo, concatenamos la URL de tu backend
                          src={`http://localhost:3000${animal.fotoUrl}`} 
                          alt={`Foto de ${animal.especie}`} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover' // Evita que la foto se estire o deforme
                          }}
                        />
                      ) : (
                        // Nuestro Fallback en caso de que el animal no tenga foto subida
                        <span style={styles.iconBracket}>{`{ }`}</span>
                      )}
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
    <div style={styles.container}>
      <div style={styles.headerRowLanding}>
        <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
      </div>
      
      <h1 style={styles.landingTitle}>SARA Protectora</h1>

      <div style={styles.scrollableWrapper}>
        <div style={styles.landingContent}>
          
          {/* FOTO DEL PERRITO */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <img 
              src="/perrito.jpg" // <-- PONÉ TU FOTO EN LA CARPETA PUBLIC O CAMBIÁ POR LA IMPORTACIÓN
              alt="Perrito rescatado en adopción" 
              style={{
                width: '100%',
                maxWidth: '450px',
                height: '280px',
                objectFit: 'cover',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                border: '3px solid #3498DB'
              }}
            />
          </div>

          {/* QUIÉNES SOMOS */}
          <h2 style={styles.sectionTitle}>¿Quiénes somos?</h2>
          <p style={styles.paragraphText}>
            En <strong>Protectora SARA</strong> somos una organización sin fines de lucro dedicada al rescate, 
            rehabilitación y reubicación de animales en situación de abandono o vulnerabilidad. Nacimos con el sueño 
            de darles una segunda oportunidad, conectando a cada uno de nuestros rescatados con familias 
            responsables y llenas de amor a través de un sistema transparente y ágil.
          </p>

          {/* NUESTRA MISIÓN */}
          <h2 style={styles.sectionTitle}>Nuestra Misión</h2>
          <p style={styles.paragraphText}>
            Garantizar el bienestar integral de los animales rescatados brindándoles atención médica veterinaria, 
            socialización y refugio temporal, mientras gestionamos procesos de adopción conscientes que aseguren 
            hogares seguros y definitivos para toda su vida.
          </p>

          {/* NUESTROS VALORES */}
          <h2 style={styles.sectionTitle}>Nuestros Valores</h2>
          <ul style={{ 
            textAlign: 'left', 
            color: '#34495E', 
            fontSize: '16px', 
            lineHeight: '1.6', 
            marginBottom: '30px',
            paddingLeft: '20px' 
          }}>
            <li><b>Compromiso por la vida:</b> Velamos por cada animal desde su ingreso hasta su adaptación en un nuevo hogar.</li>
            <li><b>Transparencia:</b> Trazabilidad completa en revisiones médicas, entrevistas y gestión de donaciones.</li>
            <li><b>Adopción responsable:</b> Evaluamos a cada adoptante para lograr la compatibilidad ideal entre familia y mascota.</li>
            <li><b>Empatía:</b> Respetamos los tiempos de recuperación física y emocional de cada animal.</li>
          </ul>

          {/* BOTÓN CTA */}
          <button style={styles.btnQuieroAdoptar} onClick={handleQuieroAdoptar}>
            ¡Quiero adoptar!
          </button>
        </div>
      </div>
    </div>
  );
}

// ... (Acá pegás tus styles abajo)


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
        color: '#2C3E50', // Asegura que el texto y las barras del calendario sean oscuras
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
        backgroundColor: '#070a0a',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '25px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#f9f9f9',
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