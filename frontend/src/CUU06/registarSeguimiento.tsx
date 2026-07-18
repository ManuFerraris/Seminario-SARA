import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 'SEARCH_ADOPCION' | 'REGISTER_SEGUIMIENTO' | 'SUCCESS';

interface AdopcionData {
    nombreAdoptante: string;
    apellidoAdoptante: string;
    especieAnimal: string;
}

export default function RegistrarSeguimiento() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('SEARCH_ADOPCION');

    // Estados - Búsqueda
    const [nroAdopcion, setNroAdopcion] = useState('');
    const [adopcionData, setAdopcionData] = useState<AdopcionData | null>(null);

    // Estados - Formulario de Seguimiento
    const [fecha, setFecha] = useState('');
    const [descripcionEntorno, setDescripcionEntorno] = useState('');
    const [estadoAnimal, setEstadoAnimal] = useState('');

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleBuscarAdopcion = () => {
        // Simulación: Solo la adopción 84 devuelve resultados
        if (nroAdopcion === '84') {
        setAdopcionData({
            nombreAdoptante: 'MAURICIO',
            apellidoAdoptante: 'FERNANDEZ',
            especieAnimal: 'GATO',
        });
        } else {
        setAdopcionData(null);
        Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            text: 'Numero de adopcion no encontrado',
            confirmButtonColor: '#F39C12',
        });
        }
    };

    const handleIrARegistro = () => {
        if (adopcionData) {
        setCurrentView('REGISTER_SEGUIMIENTO');
        }
    };

    const handleConfirmarSeguimiento = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fecha || !descripcionEntorno || !estadoAnimal) {
        Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete todos los campos requeridos.' });
        return;
        }
        
        // Aquí enviarías los datos a la base de datos MySQL usando tu backend TypeScript
        console.log('Registrando seguimiento:', { nroAdopcion, fecha, descripcionEntorno, estadoAnimal });
        setCurrentView('SUCCESS');
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
    if (currentView === 'SUCCESS') {
        // Evaluamos si el entorno escrito por el usuario contiene la palabra "apto" para simular la vista
        const entornoResumen = descripcionEntorno.toLowerCase().includes('no') ? 'No apto' : 'Apto';

        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Confirmar seguimiento</h1>
            <button style={styles.volverHeaderBtn} onClick={() => navigate(-1)}>Volver</button>
            </div>

            <div style={styles.successCard}>
            <h2 style={styles.successTitle}>Seguimiento registrado con exito</h2>
            
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nro. Seguimiento</span>
                <span style={styles.infoValue}>3</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Fecha realizado</span>
                <span style={styles.infoValue}>{fecha.split('-').reverse().join('/') || '24/07/2026'}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Entorno</span>
                <span style={styles.infoValue}>{entornoResumen}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Estado animal</span>
                <span style={estadoAnimal === 'No apto' ? styles.infoValueWarning : styles.infoValueSuccess}>
                {estadoAnimal}
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
            <label style={styles.labelCentered}>Definir fecha</label>
            <input 
                style={styles.input} 
                type="date" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)} 
                required 
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
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#FFFFFF',
        padding: '30px',
        marginTop: '10px',
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