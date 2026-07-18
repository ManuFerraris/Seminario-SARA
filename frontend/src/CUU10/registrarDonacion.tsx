import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 'MAIN_FORM' | 'ALTA_DONANTE' | 'SUCCESS';

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

    // Estados - Datos de Donación
    const [tipoDonacion, setTipoDonacion] = useState('');
    const [cantidad, setCantidad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [fechaVto, setFechaVto] = useState('');

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleBuscarDonante = () => {
        if (!dni) return;

        // Simulación: Solo el DNI 1210000 está registrado
        if (dni === '1210000') {
        setDonorFound(true);
        } else {
        setDonorFound(false);
        Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            text: 'El donante no se encuentra registrado',
            confirmButtonColor: '#F39C12',
        }).then(() => {
            // Redirigir al formulario de Alta después de cerrar la alerta
            setCurrentView('ALTA_DONANTE');
        });
        }
    };

    const handleAltaDonante = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nuevoNombre || !nuevoApellido || !nuevoTelefono || !nuevoEmail) {
        Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete todos los campos del donante.' });
        return;
        }
        
        // Al registrar el donante, simulamos que ahora existe y volvemos a la vista principal
        setDonorFound(true);
        setCurrentView('MAIN_FORM');
        Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: 'Donante dado de alta correctamente. Proceda a registrar la donación.',
        timer: 2000,
        showConfirmButton: false
        });
    };

    const handleRegistrarDonacion = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tipoDonacion || !cantidad || !descripcion) {
        Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete los datos obligatorios de la donación.' });
        return;
        }
        
        setCurrentView('SUCCESS');
    };

    const handleReiniciarFlujo = () => {
        setDni('');
        setDonorFound(false);
        setTipoDonacion('');
        setCantidad('');
        setDescripcion('');
        setFechaVto('');
        
        // Limpiar campos de alta
        setNuevoNombre('');
        setNuevoApellido('');
        setNuevoTelefono('');
        setNuevoEmail('');
        
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
    if (currentView === 'SUCCESS') {
        const isVacuna = tipoDonacion === 'Vacuna';
        
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar donacion</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <div style={styles.successCard}>
            <h2 style={styles.successTitle}>Donacion registrada!</h2>
            
            <div style={styles.infoRow}><span style={styles.infoLabel}>Tipo</span><span style={styles.infoValue}>{tipoDonacion}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Cantidad</span><span style={styles.infoValue}>{cantidad}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha de registro</span><span style={styles.infoValue}>19/07/2026</span></div>
            
            {/* Mantenemos "Nro. Entrevista" tal como figura en el bosquejo, aunque probablemente deba ser "Nro. Donacion" */}
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. Entrevista</span><span style={styles.infoValue}>10</span></div>
            
            <div style={styles.infoColumn}>
                <span style={styles.infoLabel}>Descripcion</span>
                <div style={styles.readOnlyTextAreaBox}>{descripcion}</div>
            </div>

            {fechaVto && (
                <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha de vencimiento</span><span style={styles.infoValue}>{fechaVto.split('-').reverse().join('/')}</span></div>
            )}

            {/* Lógica condicional: Si es vacuna, mostramos stock actualizado */}
            {isVacuna && (
                <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Stock actualizado</span>
                <span style={styles.infoValueSuccess}>{Number(cantidad) + 5}</span> {/* Simulamos un stock previo de 5 */}
                </div>
            )}

            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>
                Evaluar otra entrevista {/* Texto original del bosquejo */}
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

            <label style={styles.labelCentered}>Ingrese el telefono</label>
            <input style={styles.input} type="tel" value={nuevoTelefono} onChange={e => setNuevoTelefono(e.target.value.replace(/\D/g, ''))} required />

            <label style={styles.labelCentered}>Ingrese el email</label>
            <input style={styles.input} type="email" value={nuevoEmail} onChange={e => setNuevoEmail(e.target.value)} required />

            <button type="submit" style={styles.buttonSubmit}>
                Dar de alta
            </button>
            </form>
        </div>
        );
    }

    // VISTA 1: BÚSQUEDA Y REGISTRO DE DONACIÓN (1-FE-ingreso-donante / 2-FE-datos-donacion)
    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar donacion</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.scrollableFormWrapper}>
            <div style={styles.formContainer}>
            <label style={styles.labelCentered}>Ingrese el numero de DNI del donante</label>
            
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
                    if (donorFound) setDonorFound(false); // Resetear estado si cambia el input
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
                    <select style={styles.selectInput} value={tipoDonacion} onChange={e => setTipoDonacion(e.target.value)} required>
                        <option value="" disabled>Seleccionar...</option>
                        <option value="Alimento">Alimento</option>
                        <option value="Vacuna">Vacuna</option>
                        <option value="Medicamento">Medicamento</option>
                        <option value="Insumo">Insumo general</option>
                    </select>
                    </div>
                    <div style={styles.inputGroup}>
                    <label style={styles.labelCentered}>Cantidad</label>
                    <input style={styles.inputForm} type="number" min="1" value={cantidad} onChange={e => setCantidad(e.target.value)} required />
                    </div>
                </div>

                <label style={styles.labelCentered}>Descripcion</label>
                <textarea 
                    style={styles.textArea} 
                    value={descripcion} 
                    onChange={e => setDescripcion(e.target.value)} 
                    placeholder="Ej: Bolsa de alimento para cachorro de 10kg..."
                    required 
                />

                <label style={styles.labelCentered}>Fecha vto. (opcional)</label>
                <input style={styles.inputForm} type="date" value={fechaVto} onChange={e => setFechaVto(e.target.value)} />

                <button type="submit" style={styles.buttonSubmit}>
                    Registrar donacion
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
        backgroundColor: '#ECF0F1', border: '1px solid #BDC3C7', borderRadius: '5px',
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