import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig'; // <-- Ajusta esta ruta a donde esté tu instancia de axios

type ViewState = 'MAIN_FORM' | 'SUCCESS';

export default function GestionPersonal() {
  const navigate = useNavigate();

  // Control de vistas
  const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

  // Búsqueda
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [personaExistente, setPersonaExistente] = useState(false);

  // Datos de la Persona
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');

  // Roles y Datos Específicos
  const [isVeterinario, setIsVeterinario] = useState(false);
  const [isColaborador, setIsColaborador] = useState(false);
  
  const [matricula, setMatricula] = useState('');
  const [experiencia, setExperiencia] = useState('');
  
  // ID de colaborador
  const [idColaborador, setIdColaborador] = useState('-'); 

  // -------------------------------------------------------------------------
  // MÉTODOS DE ACCIÓN
  // -------------------------------------------------------------------------

  const validarContrasenia = () => {
    if (contrasenia !== confirmarContrasenia) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return false;
    }
    return true;
  };

  const handleBuscarPersona = async () => {
    if (!dniBusqueda) {
        Swal.fire({
            icon: 'info',
            title: 'Atención',
            text: 'Por favor, ingrese un DNI para buscar.',
        });
        return;
    }
    
    try {
      // Buscar el DNI
      const response = await api.get(`/persona/${dniBusqueda}`);
      console.log('Respuesta del backend:', response);

      // Si responde 200 OK, la persona existe
      const data = response.data.data;
      setPersonaExistente(true);
      setNombre(data.nombre || '');
      setApellido(data.apellido || '');
      setEmail(data.email || '');
      setTelefono(data.telefono || '');
      setDomicilio(data.domicilio || '');
      setContrasenia('*********');
      setConfirmarContrasenia('*********');

      // Limpiamos los checkboxes por defecto para el nuevo registro
      setIsVeterinario(false);
      setMatricula('');
      setExperiencia('');
      if(data.veterinario) {
        setIsVeterinario(true);
        setMatricula(data.veterinario.matricula || '');
        setExperiencia(data.veterinario.anios_experiencia || '');
      }

      setIsColaborador(false);
      if(data.colaborador) {
        setIsColaborador(true);
        setIdColaborador(data.colaborador.id_colaborador || '-');
      }

      setHasSearched(true);

    } catch (error: any) {
      // Si el backend devuelve un 404, significa que es una persona nueva
      if (error.response && error.response.status === 404) {
        setPersonaExistente(false);
        setNombre('');
        setApellido('');
        setEmail('');
        setTelefono('');
        setDomicilio('');
        setIsVeterinario(false);
        setIsColaborador(false);
        setMatricula('');
        setExperiencia('');
        setContrasenia('');
        setConfirmarContrasenia('');
        setIdColaborador('-');
        
        setHasSearched(true);
      } else {
        // Para cualquier otro error (500, red caída, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Error de conexión',
          text: 'No se pudo verificar el DNI en el servidor.',
        });
      }
    }
  };

  const handleDarDeAlta = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validaciones del Frontend
    if (!nombre || !apellido || !email || !telefono || !domicilio) {
      Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete los datos básicos de la persona.' });
      return;
    }

    if (!isVeterinario && !isColaborador) {
      Swal.fire({ icon: 'info', title: 'Atención', text: 'Debe seleccionar al menos un rol (Veterinario o Colaborador).' });
      return;
    }

    if (isVeterinario && (!matricula || !experiencia)) {
      Swal.fire({
        icon: 'warning',
        title: 'Atencion',
        text: 'Debe ingresar los datos del veterinario',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#F39C12',
      });
      return;
    }

    if (!validarContrasenia()) {
      return;
    }

    // 2. Armado del Payload
    const payload = {
      dni: dniBusqueda,
      nombre,
      apellido,
      email,
      telefono,
      domicilio,
      isVeterinario,
      isColaborador,
      contrasenia: contrasenia,
      confirmarContrasenia: confirmarContrasenia,
      // Solo enviamos matrícula y experiencia si se seleccionó veterinario
      matricula: isVeterinario ? matricula : null,
      anios_experiencia: isVeterinario ? Number(experiencia) : null
    };

    // 3. Petición al Backend
    try {
      // Ajusta '/personal' a la ruta exacta donde manejas este registro
      const response = await api.post('/persona/gestion-personal', payload);
      console.log('Respuesta del backend:', response);
      setIdColaborador(response.data?.data?.colaborador?.id_colaborador || '-');
      setCurrentView('SUCCESS');

      Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: response.data.message || 'Personal registrado correctamente.', 
      });

    } catch (error: any) {
      console.error('Error capturado por Axios:', error.response);

      // Verificamos si el error proviene de una respuesta formal del backend
      if (error.response && error.response.data) {
        
        // Extraemos el mensaje del arreglo 'messages' que envía tu back
        const backendMessages = error.response.data.message;
        const textoError = (backendMessages && backendMessages.length > 0) 
                           ? backendMessages[0] 
                           : 'Hubo un problema al registrar el personal.';

        // Si es 400 (Bad Request) o 409 (Conflict), mostramos la alerta de atención
        if (error.response.status === 400 || error.response.status === 409) {
          Swal.fire({
            icon: 'warning',
            title: 'Atención',
            text: textoError,
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#F39C12',
          });
        } else {
          // Para otros errores del servidor (500, etc.)
          Swal.fire({
            icon: 'error',
            title: `Error ${error.response.status}`,
            text: textoError,
          });
        }
      } else {
        // Fallback por si el servidor está caído (CORS, no hay internet, etc.)
        Swal.fire({
          icon: 'error',
          title: 'Error de red',
          text: 'No se pudo conectar con el servidor para registrar el personal.',
        });
      }
    }
  };

  const handleOtroRegistro = () => {
    setDniBusqueda('');
    setHasSearched(false);
    setPersonaExistente(false);
    setNombre('');
    setApellido('');
    setEmail('');
    setTelefono('');
    setDomicilio('');
    setIsVeterinario(false);
    setIsColaborador(false);
    setMatricula('');
    setExperiencia('');
    setIdColaborador('-');
    setContrasenia('');
    setConfirmarContrasenia('');
    setCurrentView('MAIN_FORM');
  };

  const handleVolver = () => {
    if (currentView === 'SUCCESS') {
      handleOtroRegistro();
    } else {
      navigate(-1);
    }
  };

  // -------------------------------------------------------------------------
  // RENDERIZADO DE VISTAS
  // -------------------------------------------------------------------------

  if (currentView === 'SUCCESS') {
    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Gestion de Personal</h1>
          <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.successCard}>
          <h2 style={styles.successTitle}>Colaborador/Veterinario registrado</h2>
          
          <div style={styles.infoRow}><span style={styles.infoLabel}>DNI:</span><span style={styles.infoValue}>{dniBusqueda}</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>Nombre:</span><span style={styles.infoValue}>{nombre}</span></div>
          <div style={styles.infoRow}><span style={styles.infoLabel}>Apellido:</span><span style={styles.infoValue}>{apellido}</span></div>
          
          {isVeterinario && (
            <>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Matricula:</span><span style={styles.infoValue}>{matricula}</span></div>
              <div style={styles.infoRow}><span style={styles.infoLabel}>Años de experiencia:</span><span style={styles.infoValue}>{experiencia}</span></div>
            </>
          )}
          {isColaborador && (
            <div style={styles.infoRow}><span style={styles.infoLabel}>ID Colaborador:</span><span style={styles.infoValue}>{idColaborador}</span></div>
          )}

          <button style={styles.buttonBackLarge} onClick={handleOtroRegistro}>
            Realizar otro registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Gestion de Personal</h1>
        <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
      </div>

      <div style={styles.scrollableFormWrapper}>
        <div style={styles.formContainer}>
          <label style={styles.labelCentered}>Ingrese el DNI de la persona</label>
          
          <div style={{ display: 'flex', width: '100%', marginBottom: '25px' }}>
            <input 
              style={{
                flex: 1, padding: '12px', border: '2px solid #3498DB', borderRight: 'none',
                borderRadius: '5px 0 0 5px', fontSize: '14px', textAlign: 'center',
                color: '#2C3E50', outline: 'none', backgroundColor: '#ECF0F1'
              }}
              type="text" 
              placeholder="Ej: 45569821" 
              value={dniBusqueda} 
              onChange={e => {
                setDniBusqueda(e.target.value.replace(/\D/g, ''));
                if (hasSearched) setHasSearched(false);
              }} 
            />
            <button 
              type="button" 
              style={{...styles.searchButton}} onClick={handleBuscarPersona}
            >
              🔍 Buscar
            </button>
          </div>

          {hasSearched && (
            <form onSubmit={handleDarDeAlta} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <div style={styles.grid2Cols}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelCentered}>Nombre</label>
                  <input 
                    style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                    type="text" value={nombre} onChange={e => setNombre(e.target.value)} 
                    placeholder="Ej: Mauricio" readOnly={personaExistente} required 
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.labelCentered}>Apellido</label>
                  <input 
                    style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                    type="text" value={apellido} onChange={e => setApellido(e.target.value)} 
                    placeholder="Ej: Roquencio" readOnly={personaExistente} required 
                  />
                </div>
              </div>

              <div style={styles.grid2Cols}>
                <div style={styles.inputGroup}>
                  <label style={styles.labelCentered}>Email</label>
                  <input 
                    style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                    type="email" value={email} onChange={e => setEmail(e.target.value)} 
                    placeholder="Ej: roquenmauri@gmail.com" readOnly={personaExistente} required 
                  />
                </div>
                <div style={styles.inputGroup}>
                  <label style={styles.labelCentered}>Telefono</label>
                  <input 
                    style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                    type="tel" value={telefono} onChange={e => setTelefono(e.target.value.replace(/\D/g, ''))} 
                    placeholder="Ej: 3412635214" readOnly={personaExistente} required 
                  />
                </div>
              </div>

              <label style={styles.labelCentered}>Domicilio</label>
              <input 
                style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                type="text" value={domicilio} onChange={e => setDomicilio(e.target.value)} 
                placeholder="Ej: Caferatta al 1564 piso 5 'c'" readOnly={personaExistente} required 
              />

              <label style={styles.labelCentered}>Contraseña</label>
              <input 
                style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                type="password" value={contrasenia} onChange={e => setContrasenia(e.target.value)} 
                placeholder="Ej: Ab123456" readOnly={personaExistente} required 
              />

              <label style={styles.labelCentered}>Confirmar Contraseña</label>
              <input 
                style={personaExistente ? styles.inputReadOnly : styles.inputEditable} 
                type="password" value={confirmarContrasenia} onChange={e => setConfirmarContrasenia(e.target.value)} 
                placeholder="Ej: Ab123456" readOnly={personaExistente} required 
              />

              <div style={styles.divider}></div>

              <label style={styles.labelCentered}>Seleccione una opcion</label>
              
              <div style={styles.roleContainer}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" checked={isVeterinario} onChange={(e) => setIsVeterinario(e.target.checked)} style={styles.checkbox} />
                  Veterinario
                </label>
                
                {isVeterinario && (
                  <div style={styles.subGrid2Cols}>
                    <div style={styles.inputGroup}>
                      <label style={styles.labelCentered}>Matricula</label>
                      <input style={styles.inputEditable} type="text" value={matricula} onChange={e => setMatricula(e.target.value)} placeholder="Ej: 42534" />
                    </div>
                    <div style={styles.inputGroup}>
                      <label style={styles.labelCentered}>Años de experiencia</label>
                      <input style={styles.inputEditable} type="number" min="0" value={experiencia} onChange={e => setExperiencia(e.target.value)} placeholder="Ej: 5" />
                    </div>
                  </div>
                )}
              </div>

              <div style={styles.roleContainer}>
                <label style={styles.checkboxLabel}>
                  <input type="checkbox" checked={isColaborador} onChange={(e) => setIsColaborador(e.target.checked)} style={styles.checkbox} />
                  Colaborador
                </label>
                
                {isColaborador && (
                  <div style={{ marginTop: '10px' }}>
                     <label style={styles.labelCentered}>ID colaborador</label>
                     <input style={styles.inputReadOnly} type="number" min="0" value={idColaborador} readOnly />
                  </div>
                )}
              </div>

              <button type="submit" style={styles.buttonSubmit}>
                Dar de Alta
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------
// ESTILOS
// -------------------------------------------------------------------------
const styles: { [key: string]: React.CSSProperties } = {
  searchButton: {
    backgroundColor: '#3498DB',
    color: '#FFF',
    border: 'none',
    borderRadius: '8px',
    padding: '0 15px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', backgroundColor: '#FFFFFF', fontFamily: 'Arial, sans-serif', padding: '40px 20px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: '650px', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '30px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#000', margin: 0, textDecoration: 'underline', flex: 1, textAlign: 'center' },
  volverHeaderBtn: { backgroundColor: '#7F8C8D', color: '#FFF', border: 'none', borderRadius: '15px', padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold' },
  scrollableFormWrapper: { width: '100%', display: 'flex', justifyContent: 'center', overflowY: 'auto', maxHeight: '85vh', paddingRight: '5px' },
  formContainer: { display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '500px' },
  labelCentered: { fontSize: '13px', color: '#000', marginBottom: '6px', textAlign: 'center', fontWeight: 'bold' },
  grid2Cols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' },
  subGrid2Cols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%', marginTop: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', width: '100%' },
  inputReadOnly: { backgroundColor: '#F2F3F4', border: '1px solid #BDC3C7', borderRadius: '5px', padding: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', color: '#7F8C8D', outline: 'none' },
  inputEditable: { backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px', padding: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center', color: '#2C3E50', outline: 'none' },
  divider: { width: '100%', height: '2px', backgroundColor: '#ECF0F1', margin: '10px 0 25px 0' },
  roleContainer: { backgroundColor: '#ECF0F1', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #BDC3C7' },
  checkboxLabel: { display: 'flex', alignItems: 'center', fontSize: '15px', fontWeight: 'bold', color: '#2C3E50', cursor: 'pointer', justifyContent: 'center' },
  checkbox: { marginRight: '10px', transform: 'scale(1.2)' },
  buttonSubmit: { backgroundColor: '#689F38', color: '#FFFFFF', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '10px' },
  successCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '500px', backgroundColor: '#FFFFFF', padding: '20px' },
  successTitle: { fontSize: '20px', fontWeight: 'bold', color: '#2C3E50', marginBottom: '30px', textAlign: 'center' },
  infoRow: { display: 'flex', justifyContent: 'space-between', width: '100%', padding: '15px 0', borderBottom: '1px solid #ECF0F1' },
  infoLabel: { fontWeight: 'bold', color: '#34495E' },
  infoValue: { color: '#2C3E50', fontWeight: 'bold' },
  buttonBackLarge: { backgroundColor: '#95A5A6', color: '#FFFFFF', padding: '15px', border: 'none', borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginTop: '40px', width: '100%' },
};