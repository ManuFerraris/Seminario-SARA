import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig';

type ViewState = 'MAIN_FORM' | 'ALTA_DONANTE' | 'SUCCESS';

interface DonacionExitosa {
    nro_donacion?: string | number;
    fecha_registro: string;
    tipo: string;
    cantidad: string;
    descripcion: string;
    fecha_vencimiento?: string;
    stock_actualizado?: number;
}

export default function RegistrarDonacion() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

    // Estados - Búsqueda Donante
    const [dni, setDni] = useState('');
    const [donorFound, setDonorFound] = useState(false);

    // Estados - Alta Donante
    const [nuevoNombre, setNuevoNombre] = useState('');
    const [nuevoApellido, setNuevoApellido] = useState('');
    const [nuevoTelefono, setNuevoTelefono] = useState('');
    const [nuevoEmail, setNuevoEmail] = useState('');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [nuevaDireccion, setNuevaDireccion] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    // Estados - Datos de Donación
    const [tipoDonacion, setTipoDonacion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaVto, setFechaVto] = useState('');

    // Estado - Datos de Éxito
    const [datosExito, setDatosExito] = useState<DonacionExitosa | null>(null);

    // -------------------------------------------------------------------------
    // FORMATEADOR
    // -------------------------------------------------------------------------
    const formatearFecha = (fechaString?: string) => {
        if (!fechaString) return '';
        const soloFecha = fechaString.split('T')[0];
        const [year, month, day] = soloFecha.split('-');
        return `${day}/${month}/${year}`;
    };

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleBuscarDonante = async () => {
        if (!dni.trim()) return;

        try {
            // Buscamos si el donante ya existe en la BD
            await api.get(`/persona/${dni}`);
            
            // Si el backend devuelve 200, significa que existe
            setDonorFound(true);
            
        } catch (error: any) {
            setDonorFound(false);
            
            // Si devuelve 404 (o el código que uses para no encontrado)
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: 'El donante no se encuentra registrado.',
                confirmButtonColor: '#F39C12',
            }).then(() => {
                setCurrentView('ALTA_DONANTE');
            });
        }
    };

    const handleAltaDonante = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!nuevoNombre || !nuevoApellido || !nuevoTelefono || !nuevaDireccion || !nuevoEmail || !nuevaContrasena || !confirmarContrasena) {
            Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete todos los campos del donante.' });
            return;
        }

        if (nuevaContrasena !== confirmarContrasena) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden.' });
            return;
        }
        
        try {
            const payload = {
                dni: dni,
                nombre: nuevoNombre,
                apellido: nuevoApellido,
                telefono: nuevoTelefono,
                email: nuevoEmail,
                domicilio: nuevaDireccion,
                contrasenia: nuevaContrasena
            };

            const response = await api.post('/persona/crear-persona', payload);
            const data = response.data.data;
            console.log('Respuesta del backend al registrar donante:', data);
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: response.data.message,
                timer: 2500,
                showConfirmButton: false
            });
            setDonorFound(true);
            setCurrentView('MAIN_FORM');
        } catch (error: any) {
            console.error('Error capturado por Axios:', error);

            // 1. Verificamos si el error viene con una respuesta HTTP del backend
            if (error.response) {
                const status = error.response.status;
                const backendMessages = error.response.data?.messages || error.response.data?.message;

                // Armamos el mensaje, soportando tanto arrays como strings simples
                let mensajesFormateados = 'Ocurrió un error al procesar la solicitud.';
                if (Array.isArray(backendMessages) && backendMessages.length > 0) {
                    mensajesFormateados = backendMessages.join('<br/>');
                } else if (typeof backendMessages === 'string') {
                    mensajesFormateados = backendMessages;
                }

                // 2. Disparamos alertas distintas según el código de estado (Status Code)
                if (status === 404) {
                    // Ideal para "Donante no encontrado" o "Animal no encontrado"
                    Swal.fire({ 
                        icon: 'warning', 
                        title: 'No encontrado', 
                        html: mensajesFormateados 
                    });
                } else if (status === 400) {
                    // Ideal para errores de validación (ej. falta un dato obligatorio)
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Datos inválidos', 
                        html: mensajesFormateados 
                    });
                } else {
                    // Errores 500 u otros
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Error del servidor', 
                        html: mensajesFormateados 
                    });
                }
            } 
            // 3. ¿Qué pasa si el servidor está apagado o no hay internet?
            else if (error.request) {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Error de conexión', 
                    text: 'No se pudo contactar con el servidor. Revisa tu conexión o intenta más tarde.' 
                });
            } 
            // 4. Cualquier otro error inesperado en el frontend
            else {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Error inesperado', 
                    text: error.message 
                });
            }
        }
    };

    const handleRegistrarDonacion = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!tipoDonacion || !cantidad || !descripcion) {
            Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete los datos obligatorios de la donación.' });
            return;
        }
        
        try {
            const payload = {
                dni_donante: dni,
                tipo: tipoDonacion,
                cantidad: Number(cantidad),
                descripcion: descripcion,
                fecha_vencimiento: fechaVto || undefined // Solo lo enviamos si tiene valor
            };

            const response = await api.post('/donacion/registrar', payload);
            console.log('Respuesta del backend al registrar donación:', response.data);
            const dataBack = response.data.data;

            // Guardamos los datos para la vista de éxito
            setDatosExito({
                nro_donacion: dataBack.nro_donacion || dataBack.id_donacion,
                fecha_registro: dataBack.fecha || new Date().toISOString(), // Fallback por si el back no la devuelve
                tipo: tipoDonacion,
                cantidad: cantidad,
                descripcion: descripcion,
                fecha_vencimiento: fechaVto,
                // Si tu backend devuelve el stock actualizado para las vacunas, lo guardamos
                stock_actualizado: dataBack.stock_actualizado
            });
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: response.data.message,
                timer: 1500,
                showConfirmButton: false
            });
            setCurrentView('SUCCESS');
        } catch (error: any) {
            console.error('Error capturado por Axios:', error);

            // 1. Verificamos si el error viene con una respuesta HTTP del backend
            if (error.response) {
                const status = error.response.status;
                const backendMessages = error.response.data?.messages || error.response.data?.message;

                // Armamos el mensaje, soportando tanto arrays como strings simples
                let mensajesFormateados = 'Ocurrió un error al procesar la solicitud.';
                if (Array.isArray(backendMessages) && backendMessages.length > 0) {
                    mensajesFormateados = backendMessages.join('<br/>');
                } else if (typeof backendMessages === 'string') {
                    mensajesFormateados = backendMessages;
                }

                // 2. Disparamos alertas distintas según el código de estado (Status Code)
                if (status === 404) {
                    // Ideal para "Donante no encontrado" o "Animal no encontrado"
                    Swal.fire({ 
                        icon: 'warning', 
                        title: 'No encontrado', 
                        html: mensajesFormateados 
                    });
                } else if (status === 400) {
                    // Ideal para errores de validación (ej. falta un dato obligatorio)
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Datos inválidos', 
                        html: mensajesFormateados 
                    });
                } else {
                    // Errores 500 u otros
                    Swal.fire({ 
                        icon: 'error', 
                        title: 'Error del servidor', 
                        html: mensajesFormateados 
                    });
                }
            } 
            // 3. ¿Qué pasa si el servidor está apagado o no hay internet?
            else if (error.request) {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Error de conexión', 
                    text: 'No se pudo contactar con el servidor. Revisa tu conexión o intenta más tarde.' 
                });
            } 
            // 4. Cualquier otro error inesperado en el frontend
            else {
                Swal.fire({ 
                    icon: 'error', 
                    title: 'Error inesperado', 
                    text: error.message 
                });
            }
        }
    };

    const handleReiniciarFlujo = () => {
        setDni('');
        setDonorFound(false);
        setTipoDonacion('');
        setCantidad('');
        setDescripcion('');
        setFechaVto('');
        
        setNuevoNombre('');
        setNuevoApellido('');
        setNuevoTelefono('');
        setNuevoEmail('');
        
        setDatosExito(null);
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'ALTA_DONANTE') {
            setCurrentView('MAIN_FORM');
        } else if (currentView === 'SUCCESS') {
            handleReiniciarFlujo();
        } else {
            navigate(-1);
        }
    };

    // -------------------------------------------------------------------------
    // RENDERIZADO DE VISTAS
    // -------------------------------------------------------------------------

    // VISTA 3: ÉXITO (3-FS-registro-donacion)
    if (currentView === 'SUCCESS' && datosExito) {
        const isVacuna = datosExito.tipo === 'Vacuna';
        
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <div style={{ flex: 1 }}></div>
                <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <div style={styles.successCard}>
            <h2 style={styles.successTitle}>Donación registrada!</h2>
            
            <div style={styles.infoRow}><span style={styles.infoLabel}>Tipo</span><span style={styles.infoValue}>{datosExito.tipo}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Cantidad</span><span style={styles.infoValue}>{datosExito.cantidad}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha de registro</span><span style={styles.infoValue}>{formatearFecha(datosExito.fecha_registro)}</span></div>
            
            {datosExito.nro_donacion && (
                <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. Donación</span><span style={styles.infoValue}>{datosExito.nro_donacion}</span></div>
            )}
            
            <div style={styles.infoColumn}>
                <span style={styles.infoLabel}>Descripción</span>
                <div style={styles.readOnlyTextAreaBox}>{datosExito.descripcion}</div>
            </div>

            {datosExito.fecha_vencimiento && (
                <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha de vencimiento</span><span style={styles.infoValue}>{formatearFecha(datosExito.fecha_vencimiento)}</span></div>
            )}

            {/* Solo mostramos el stock si es vacuna y el backend nos devolvió ese dato */}
            {isVacuna && datosExito.stock_actualizado !== undefined && (
                <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Stock actualizado de vacunas</span>
                <span style={styles.infoValueSuccess}>{datosExito.stock_actualizado}</span>
                </div>
            )}

            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>
                Registrar otra donación
            </button>
            </div>
        </div>
        );
    }

    // VISTA 2: ALTA DONANTE (1.a.2-FS-alta-donante)
    if (currentView === 'ALTA_DONANTE') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Alta donante</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <form style={styles.formContainer} onSubmit={handleAltaDonante}>
            <label style={styles.labelCentered}>Ingrese el DNI</label>
            <input style={styles.input} type="text" value={dni} onChange={e => setDni(e.target.value.replace(/\D/g, ''))} required />

            <label style={styles.labelCentered}>Ingrese el nombre</label>
            <input style={styles.input} type="text" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese el apellido</label>
            <input style={styles.input} type="text" value={nuevoApellido} onChange={e => setNuevoApellido(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese el teléfono</label>
            <input style={styles.input} type="tel" value={nuevoTelefono} onChange={e => setNuevoTelefono(e.target.value.replace(/\D/g, ''))} required />

            <label style={styles.labelCentered}>Ingrese la dirección</label>
            <input style={styles.input} type="text" value={nuevaDireccion} onChange={e => setNuevaDireccion(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese el email</label>
            <input style={styles.input} type="email" value={nuevoEmail} onChange={e => setNuevoEmail(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese su contraseña</label>
            <input style={styles.input} type="password" value={nuevaContrasena} onChange={e => setNuevaContrasena(e.target.value)} required />

            <label style={styles.labelCentered}>Confirme su contraseña</label>
            <input style={styles.input} type="password" value={confirmarContrasena} onChange={e => setConfirmarContrasena(e.target.value)} required />

            <button type="submit" style={styles.buttonSubmit}>
                Dar de alta
            </button>
            </form>
        </div>
        );
    }
    const VACUNAS_DISPONIBLES = [
        "Antirrábica",
        "Séxtuple Canina (DHPPi+L)",
        "Quíntuple Canina (DHPPi)",
        "Parvovirus Canino",
        "Moquillo Canino (Distemper)",
        "Tos de las Perreras (Bordetella)",
        "Triple Felina (FVRCP)",
        "Leucemia Felina (FeLV)"
    ];

    // VISTA 1: BÚSQUEDA Y REGISTRO DE DONACIÓN (1-FE-ingreso-donante / 2-FE-datos-donacion)
    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar donación</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.scrollableFormWrapper}>
            <div style={styles.formContainer}>
            <label style={styles.labelCentered}>Ingrese el número de DNI del donante</label>
            
            <div style={{ display: 'flex', width: '100%', marginBottom: '25px' }}>
                <input 
                style={{
                    flex: 1, padding: '12px', border: '2px solid #3498DB', borderRight: 'none',
                    borderRadius: '5px 0 0 5px', fontSize: '14px', textAlign: 'center',
                    color: '#2C3E50', outline: 'none', backgroundColor: '#ECF0F1'
                }}
                type="text" 
                placeholder="Ej: 1210000" 
                value={dni} 
                onChange={e => {
                    setDni(e.target.value.replace(/\D/g, ''));
                    if (donorFound) setDonorFound(false);
                }} 
                />
                <button 
                type="button" 
                style={{
                    backgroundColor: '#ECF0F1', color: '#3498DB', border: '2px solid #3498DB',
                    borderLeft: 'none', borderRadius: '0 5px 5px 0', padding: '0 20px',
                    cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center'
                }} 
                onClick={handleBuscarDonante}
                >
                🔍
                </button>
            </div>

            {/* CAMPOS DE DONACIÓN (Solo visibles si el donante fue encontrado/registrado) */}
            {donorFound && (
                <form onSubmit={handleRegistrarDonacion} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <div style={styles.divider}></div>

                <div style={styles.grid2Cols}>
                    <div style={styles.inputGroup}>
                        <label style={styles.labelCentered}>Tipo</label>
                        <select style={styles.selectInput} value={tipoDonacion} onChange={e => {
                            setTipoDonacion(e.target.value);
                            // Reseteamos la descripción si el usuario cambia el tipo, 
                            // para evitar que mande una vacuna en el texto de un "Alimento"
                            setDescripcion(""); 
                        }} required>
                            <option value="" disabled>Seleccionar...</option>
                            <option value="Alimento">Alimento</option>
                            <option value="Vacuna">Vacuna</option>
                            <option value="Medicamento">Medicamento</option>
                            <option value="Insumo general">Insumo general</option>
                        </select>
                    </div>
                    <div style={styles.inputGroup}>
                        <label style={styles.labelCentered}>Cantidad</label>
                        <input style={styles.inputForm} type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} required />
                    </div>
                </div>

                {/* RENDERIZADO CONDICIONAL PARA LA DESCRIPCIÓN */}
                <label style={styles.labelCentered}>
                    {tipoDonacion === 'Vacuna' ? 'Vacuna (Seleccione el tipo)' : 'Descripción'}
                </label>
                
                {tipoDonacion === 'Vacuna' ? (
                    <select 
                        style={styles.selectInput} 
                        value={descripcion} 
                        onChange={e => setDescripcion(e.target.value)} 
                        required
                    >
                        <option value="" disabled>Seleccionar vacuna...</option>
                        {VACUNAS_DISPONIBLES.map((vacuna, index) => (
                            <option key={index} value={vacuna}>{vacuna}</option>
                        ))}
                    </select>
                ) : (
                    <textarea 
                        style={styles.textArea} 
                        value={descripcion} 
                        onChange={e => setDescripcion(e.target.value)} 
                        placeholder="Ej: Bolsa de alimento para cachorro de 10kg..."
                        required 
                    />
                )}

                {/* FECHAS DE VENCIMIENTO */}
                {(tipoDonacion === 'Vacuna' || tipoDonacion === 'Medicamento') && (
                    <>
                        <label style={styles.labelCentered}>Fecha vto. (Obligatoria para {tipoDonacion})</label>
                        <input style={styles.dateInput} type="date" value={fechaVto} onChange={e => setFechaVto(e.target.value)} required />
                    </>
                )}
                
                {(tipoDonacion !== 'Vacuna' && tipoDonacion !== 'Medicamento') && (
                    <>
                        <label style={styles.labelCentered}>Fecha vto. (opcional)</label>
                        <input style={styles.dateInput} type="date" value={fechaVto} onChange={e => setFechaVto(e.target.value)} />
                    </>
                )}

                <button type="submit" style={styles.buttonSubmit}>
                    Registrar donación
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
    container: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh',
        backgroundColor: '#FFFFFF', fontFamily: 'Arial, sans-serif', padding: '40px 20px',
    },
    dateInput: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #151a1d',
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
    headerRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%',
        maxWidth: '550px', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '30px',
    },
    title: {
        fontSize: '24px', fontWeight: 'bold', color: '#000', margin: 0,
        textDecoration: 'underline', flex: 1, textAlign: 'center',
    },
    volverHeaderBtn: {
        backgroundColor: '#7F8C8D', color: '#FFF', border: 'none', borderRadius: '15px',
        padding: '6px 16px', cursor: 'pointer', fontWeight: 'bold',
    },
    scrollableFormWrapper: {
        width: '100%', display: 'flex', justifyContent: 'center', overflowY: 'auto',
        maxHeight: '85vh', paddingRight: '5px',
    },
    formContainer: {
        display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '450px',
    },
    labelCentered: {
        fontSize: '13px', color: '#000', marginBottom: '6px', textAlign: 'center', fontWeight: 'bold',
    },
    grid2Cols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' },
    inputGroup: { display: 'flex', flexDirection: 'column', width: '100%' },
    input: {
        backgroundColor: '#ECF0F1', border: '1px solid #7a838b', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center',
        color: '#2C3E50', outline: 'none',
    },
    inputForm: {
        backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center',
        color: '#2C3E50', outline: 'none',
    },
    selectInput: {
        backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', color: '#2C3E50',
        outline: 'none', cursor: 'pointer', textAlign: 'center',
    },
    textArea: {
        backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', color: '#2C3E50',
        outline: 'none', minHeight: '80px', resize: 'none',
    },
    divider: {
        width: '100%', height: '2px', backgroundColor: '#ECF0F1', marginBottom: '20px',
    },
    buttonSubmit: {
        backgroundColor: '#689F38', color: '#FFFFFF', padding: '15px', border: 'none',
        borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
        width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '10px',
    },
    successCard: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
        maxWidth: '500px', backgroundColor: '#FFFFFF', padding: '20px',
    },
    successTitle: {
        fontSize: '22px', fontWeight: 'bold', color: '#2C3E50', marginBottom: '30px', textAlign: 'center',
    },
    infoRow: {
        display: 'flex', justifyContent: 'space-between', width: '100%', padding: '15px 0',
        borderBottom: '1px solid #ECF0F1',
    },
    infoColumn: {
        display: 'flex', flexDirection: 'column', width: '100%', padding: '15px 0',
        borderBottom: '1px solid #ECF0F1',
    },
    infoLabel: { fontWeight: 'bold', color: '#34495E', marginBottom: '5px' },
    infoValue: { color: '#2C3E50', fontWeight: 'bold' },
    infoValueSuccess: { color: '#27AE60', fontWeight: 'bold' },
    readOnlyTextAreaBox: {
        backgroundColor: '#F2F3F4', padding: '15px', borderRadius: '5px', color: '#7F8C8D',
        fontSize: '14px', lineHeight: '1.5', marginTop: '10px', textAlign: 'justify',
    },
    buttonBackLarge: {
        backgroundColor: '#95A5A6', color: '#FFFFFF', padding: '15px', border: 'none',
        borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
        marginTop: '40px', width: '100%',
    },
};