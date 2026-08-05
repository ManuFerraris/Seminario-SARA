import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig'; // ¡Importante!

type ViewState = 'SEARCH_ADOPCION' | 'REGISTER_SEGUIMIENTO' | 'SUCCESS';

interface AdopcionData {
    nombreAdoptante: string;
    apellidoAdoptante: string;
    especieAnimal: string;
    numeroAnimal: number;
}

// Agregamos esta interfaz para guardar lo que responde el backend al final
interface SeguimientoExitoso {
    nro_seguimiento: number;
    fecha: string;
    entorno: string;
    estado_animal: string;
    numeroAnimal: number;
}

// Reutilizamos la función para sacar el DNI de quien está logueado (el Colaborador)
const obtenerDniDelToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = atob(payloadBase64);
        return JSON.parse(payloadDecodificado).dni;
    } catch (error) {
        return null;
    }
};

export default function RegistrarSeguimiento() {
    const navigate = useNavigate();

    const [currentView, setCurrentView] = useState<ViewState>('SEARCH_ADOPCION');
    const [nroAdopcion, setNroAdopcion] = useState('');
    const [adopcionData, setAdopcionData] = useState<AdopcionData | null>(null);
    
    // NUEVO ESTADO LÓGICO: Guardamos el ID del seguimiento vacío que vamos a actualizar
    const [idSeguimientoPendiente, setIdSeguimientoPendiente] = useState<number | null>(null);

    const [fecha, setFecha] = useState('');
    const [descripcionEntorno, setDescripcionEntorno] = useState('');
    const [estadoAnimal, setEstadoAnimal] = useState('');
    const [numeroAnimal, setNumeroAnimal] = useState<number | null>(null);
    const [datosExito, setDatosExito] = useState<SeguimientoExitoso | null>(null);

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleBuscarAdopcion = async () => {
        if (!nroAdopcion) return;

        try {
            const response = await api.get(`/adopcion/${nroAdopcion}`);
            const datosAdopcion = response.data.data;
            console.log('Datos de adopción recibidos del backend:', datosAdopcion);

            // 1. Verificamos que la adopción traiga un seguimiento pendiente
            if (!datosAdopcion.seguimiento_pendiente_id) {
                Swal.fire({
                    icon: 'info',
                    title: 'Sin seguimientos',
                    text: 'Esta adopción no tiene seguimientos pendientes programados.',
                    confirmButtonColor: '#3498DB',
                });
                return;
            }

            // 2. Buscamos el objeto de seguimiento específico dentro del array
            const seguimientoPendiente = datosAdopcion.seguimientos.find(
                (seg: any) => seg.id_seguimiento === datosAdopcion.seguimiento_pendiente_id
            );

            // 3. Si lo encontramos, seteamos la fecha. Si por alguna razón falla, evitamos que la app crashee.
            if (seguimientoPendiente) {
                setFecha(seguimientoPendiente.fecha_seguimiento);
            }

            // 4. Guardamos el ID para el PUT posterior
            setIdSeguimientoPendiente(datosAdopcion.seguimiento_pendiente_id);

            // 5. Seteamos los datos visuales
            setAdopcionData({
                nombreAdoptante: datosAdopcion.adoptante.persona.nombre,
                apellidoAdoptante: datosAdopcion.adoptante.persona.apellido,
                numeroAnimal: datosAdopcion.animal.nro_animal,
                especieAnimal: datosAdopcion.animal.especie,
            });
            
        }catch (error: any) {
            setAdopcionData(null);
            setIdSeguimientoPendiente(null);
            
            const backendMessages = error.response?.data?.messages || error.response?.data?.message;
            let textoError = 'Número de adopción no encontrado o no existe.';
            if (backendMessages && Array.isArray(backendMessages) && backendMessages.length > 0) {
                textoError = backendMessages.join('\n');
            } else if (typeof backendMessages === 'string') {
                textoError = backendMessages;
            }

            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: textoError,
                confirmButtonColor: '#F39C12',
            });
        }
    };

    const handleConfirmarSeguimiento = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!fecha || !descripcionEntorno || !estadoAnimal) {
            Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete todos los campos requeridos.' });
            return;
        }

        if (!idSeguimientoPendiente) {
            Swal.fire({ icon: 'error', title: 'Error interno', text: 'Falta el ID del seguimiento a actualizar.' });
            return;
        }

        const dni_colaborador = obtenerDniDelToken();
        if (!dni_colaborador) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Sesión inválida. Vuelva a iniciar sesión.' });
            return;
        }

        try {
            const payload = {
                fecha_seguimiento: fecha, 
                entorno: descripcionEntorno,
                estado_animal: estadoAnimal,
                dni_colaborador: dni_colaborador
            };

            const nro_seguimiento = idSeguimientoPendiente;
            const response = await api.put(`/seguimiento/${nro_seguimiento}/completar`, payload);
            console.log('Respuesta del backend al completar seguimiento:', response.data);
            
            // Accedemos correctamente a los datos basándonos en la estructura de tu console.log
            setDatosExito({
                nro_seguimiento: response.data.data.id_seguimiento, 
                fecha: response.data.data.fecha_seguimiento,        
                entorno: response.data.data.entorno,                
                estado_animal: response.data.data.estado_animal,
                
                // CORRECCIÓN: El animal está dentro de 'adopcion' y es directamente un número
                numeroAnimal: response.data.data.adopcion.animal 
            });

            setCurrentView('SUCCESS');
            
        } catch (error: any) {
            // Te agrego este log. Es vital para cazar este tipo de errores "invisibles" de JavaScript.
            console.error('Error detallado:', error); 

            const backendMessages = error.response?.data?.messages || error.response?.data?.message;
            let textoError = 'Ocurrió un problema al registrar el seguimiento.';
            if (backendMessages && Array.isArray(backendMessages) && backendMessages.length > 0) {
                textoError = backendMessages.join('\n');
            } else if (typeof backendMessages === 'string') {
                textoError = backendMessages;
            }

            Swal.fire({ icon: 'error', title: 'Error', text: textoError, confirmButtonColor: '#E74C3C' });
        }
    };

    const handleIrARegistro = () => {
        if (adopcionData) {
        setCurrentView('REGISTER_SEGUIMIENTO');
        }
    };

    const handleOtroSeguimiento = () => {
        // Reseteamos el estado al inicial
        setNroAdopcion('');
        setAdopcionData(null);
        setFecha('');
        setDescripcionEntorno('');
        setEstadoAnimal('');
        setCurrentView('SEARCH_ADOPCION');
    };

    const handleVolver = () => {
        if (currentView === 'REGISTER_SEGUIMIENTO') {
            setCurrentView('SEARCH_ADOPCION');
        } else {
            navigate(-1);
        }
    };

    // -------------------------------------------------------------------------
    // VISTA 3: ÉXITO (3-FS-seguimiento-registrado)
    // -------------------------------------------------------------------------
    if (currentView === 'SUCCESS' && datosExito) {
        return (
            <div style={styles.container}>
                {/* Agregamos el header estándar con tu botón de Volver */}
                <div style={styles.headerRow}>
                    <h1 style={styles.title}>Detalle del seguimiento</h1>
                    <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
                </div>

                <div style={styles.successCard}>
                    <h2 style={styles.successTitle}>Seguimiento registrado con éxito</h2>
                    
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Nro. Seguimiento</span>
                        {/* Renderizamos el número real de la BD */}
                        <span style={styles.infoValue}>{datosExito.nro_seguimiento}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Fecha realizado</span>
                        <span style={styles.infoValue}>{datosExito.fecha.split('-').reverse().join('/')}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Entorno</span>
                        <span style={styles.infoValue}>{datosExito.entorno}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Estado animal</span>
                        <span style={datosExito.estado_animal === 'No apto' ? styles.infoValueWarning : styles.infoValueSuccess}>
                            {datosExito.estado_animal}
                        </span>
                    </div>

                    <button style={styles.buttonBackLarge} onClick={handleOtroSeguimiento}>
                        Realizar otro seguimiento
                    </button>
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------------------
    // VISTA 2: DATOS DEL SEGUIMIENTO (2-FE-datos_seguimiento)
    // -------------------------------------------------------------------------
if (currentView === 'REGISTER_SEGUIMIENTO') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Buscar adopcion</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <form style={styles.formContainer} onSubmit={handleConfirmarSeguimiento}>
            
            {/* CAMBIOS AQUÍ: Etiqueta, readOnly y estilos */}
            <label style={styles.labelCentered}>Fecha programada</label>
            <input 
                style={styles.inputReadOnly} // Usamos tu estilo para inputs bloqueados
                type="date" 
                value={fecha} 
                readOnly // Bloquea la edición del usuario
                // Eliminamos el onChange porque el usuario ya no puede tipear aquí
            />

            <label style={styles.labelCentered}>Ingrese una descripcion del entorno</label>
            <textarea 
                style={styles.textArea} 
                value={descripcionEntorno} 
                onChange={e => setDescripcionEntorno(e.target.value)}
                placeholder="Ej: Patio cerrado, buena alimentación..." 
                required 
            />

            <label style={styles.labelCentered}>Seleccione el estado del animal</label>
            <select 
                style={styles.selectInput} 
                value={estadoAnimal} 
                onChange={e => setEstadoAnimal(e.target.value)} 
                required
            >
                <option value="" disabled>Seleccionar...</option>
                <option value="Apto">Apto</option>
                <option value="No apto">No apto</option>
            </select>

            <button type="submit" style={styles.buttonSubmit}>
                Confirmar seguimiento
            </button>
            </form>
        </div>
        );
    }

    // -------------------------------------------------------------------------
    // VISTA 1: BUSCAR ADOPCION (1-FE-ingreso_adopcion / 1-FS-datos_adopcion)
    // -------------------------------------------------------------------------
    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Buscar adopcion</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.formContainer}>
            <label style={styles.labelCentered}>Ingrese el numero de adopcion</label>
            
            {/* BUSCADOR GARANTIZADO */}
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
                backgroundColor: '#ECF0F1'
                }}
                type="text" 
                placeholder="Ej: 84" 
                value={nroAdopcion} 
                onChange={e => setNroAdopcion(e.target.value.replace(/\D/g, ''))} 
            />
            <button 
                type="button" 
                style={{
                backgroundColor: '#ECF0F1',
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

            {/* DATOS DE LA ADOPCIÓN */}
            {adopcionData && (
            <div style={styles.dataContainer}>
                <label style={styles.labelCentered}>Nombre del adoptante</label>
                <input style={styles.inputReadOnly} type="text" value={adopcionData.nombreAdoptante} readOnly />

                <label style={styles.labelCentered}>Apellido del adoptante</label>
                <input style={styles.inputReadOnly} type="text" value={adopcionData.apellidoAdoptante} readOnly />

                <label style={styles.labelCentered}>Especie del animal</label>
                <input style={styles.inputReadOnly} type="text" value={adopcionData.especieAnimal} readOnly />

                <button type="button" style={styles.buttonSubmit} onClick={handleIrARegistro}>
                Registrar seguimiento
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
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',       // Centra el contenido horizontalmente
        minHeight: '100vh',         // CLAVE: Obliga al contenedor a ocupar el 100% del alto de la pantalla
        width: '100%',              // Obliga a ocupar el 100% del ancho
        backgroundColor: '#FFFFFF', // CLAVE: Fuerza el fondo blanco para tapar cualquier fondo negro del body
        padding: '20px',
        boxSizing: 'border-box' as const,
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        marginBottom: '30px',
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
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#2C3E50',
        outline: 'none',
    },
    textArea: {
        backgroundColor: '#ECF0F1',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#2C3E50',
        outline: 'none',
        minHeight: '80px',
        resize: 'none',
    },
    selectInput: {
        backgroundColor: '#ECF0F1',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#2C3E50',
        outline: 'none',
        cursor: 'pointer',
        textAlign: 'center',
    },
    inputReadOnly: {
        backgroundColor: '#E0E0E0',
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
        backgroundColor: '#689F38', // Verde claro para registro y confirmación
        color: '#FFFFFF',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    successCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        border: '1px solid #E0E0E0', // Un bordecito sutil
        borderRadius: '10px',
        padding: '40px',
        marginTop: '10vh',          // Lo empuja un poco hacia abajo para que quede en el centro óptico de la pantalla
        boxShadow: '0px 5px 15px rgba(0,0,0,0.1)', // Sombra para que la tarjeta resalte sobre el fondo blanco
        width: '100%',
        maxWidth: '500px',          // Evita que la tarjeta se estire infinitamente en monitores grandes
    },
    successTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '30px',
        textAlign: 'center',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '15px 0',
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
    infoValueWarning: {
        color: '#E74C3C', // Rojo para no apto
        fontWeight: 'bold',
    },
    infoValueSuccess: {
        color: '#27AE60', // Verde para apto
        fontWeight: 'bold',
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
        marginTop: '40px',
        width: '100%',
    },
};