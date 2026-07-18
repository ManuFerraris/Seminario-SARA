import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 'LANDING' | 'ANIMAL_LIST' | 'DATE_TIME_SELECT' | 'SUCCESS';

interface Animal {
    id: number;
    especie: string;
    edad: string;
    fechaIngreso: string;
    estado: string;
    }

    export default function AltaEntrevista() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('LANDING');

    // Estados del flujo
    const [selectedAnimalId, setSelectedAnimalId] = useState<number | null>(null);
    const [fechaEntrevista, setFechaEntrevista] = useState('');
    const [horaEntrevista, setHoraEntrevista] = useState('');

    // Datos simulados de la grilla
    const animalesMock: Animal[] = [
        { id: 1, especie: 'Perro', edad: '5 años', fechaIngreso: '02/02/2025', estado: 'Disponible' }, // Éste disparará la lista negra
        { id: 2, especie: 'Gato', edad: '2 años', fechaIngreso: '13/02/2026', estado: 'Disponible' },
        { id: 3, especie: 'Perro', edad: '2 años', fechaIngreso: '28/08/2025', estado: 'Disponible' },
        { id: 4, especie: 'Perro', edad: '5 años', fechaIngreso: '02/02/2025', estado: 'Disponible' },
        { id: 5, especie: 'Gato', edad: '2 años', fechaIngreso: '13/02/2026', estado: 'Disponible' },
        { id: 6, especie: 'Perro', edad: '2 años', fechaIngreso: '28/08/2025', estado: 'Disponible' },
        { id: 7, especie: 'Perro', edad: '5 años', fechaIngreso: '02/02/2025', estado: 'Disponible' },
        { id: 8, especie: 'Gato', edad: '2 años', fechaIngreso: '13/02/2026', estado: 'Disponible' },
        { id: 9, especie: 'Perro', edad: '2 años', fechaIngreso: '28/08/2025', estado: 'Disponible' },
    ];

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleQuieroAdoptar = () => {
        setCurrentView('ANIMAL_LIST');
    };

    const handleAdoptarClic = (animalId: number) => {
        // Simulación: Si elige el animal ID 1, el adoptante está inhabilitado
        if (animalId === 1) {
        Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            html: `<b>Inhabilitado para adoptar</b><br/><br/>Si considera que es un error,<br/>comuniquese con nosotros`,
            confirmButtonColor: '#F39C12',
            background: '#F1C40F', // Fondo amarillo/naranja similar al bosquejo
            color: '#FFFFFF'
        });
        } else {
        setSelectedAnimalId(animalId);
        setCurrentView('DATE_TIME_SELECT');
        }
    };

    const handleConfirmarFechaHora = (e: React.FormEvent) => {
        e.preventDefault();
        if (!fechaEntrevista || !horaEntrevista) {
        Swal.fire({ icon: 'info', title: 'Atención', text: 'Debe seleccionar fecha y hora.' });
        return;
        }
        console.log(`Entrevista agendada para el animal ${selectedAnimalId} el ${fechaEntrevista} a las ${horaEntrevista}`);
        setCurrentView('SUCCESS');
    };

    const handleVolver = () => {
        if (currentView === 'SUCCESS') {
        // Regresar al listado y limpiar selección
        setSelectedAnimalId(null);
        setFechaEntrevista('');
        setHoraEntrevista('');
        setCurrentView('ANIMAL_LIST');
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
    if (currentView === 'SUCCESS') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Entrevista registrada con exito</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <div style={styles.successCard}>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Estado animal:</span>
                <span style={styles.infoValueWarning}>No disponible</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Estado entrevista:</span>
                <span style={styles.infoValueSuccess}>Activa</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>DNI adoptante:</span>
                <span style={styles.infoValue}>11222333</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nro. animal:</span>
                <span style={styles.infoValue}>{selectedAnimalId || '13'}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Fecha:</span>
                <span style={styles.infoValue}>{fechaEntrevista}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Hora:</span>
                <span style={styles.infoValue}>{horaEntrevista}</span>
            </div>
            
            <div style={{...styles.infoRow, flexDirection: 'column', alignItems: 'flex-start', borderBottom: 'none'}}>
                <span style={styles.infoLabel}>Descripcion:</span>
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
            <div style={styles.gridContainer}>
                {animalesMock.map(animal => (
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
                ))}
            </div>
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
            
            <h2 style={styles.sectionTitle}>Quienes somos ?</h2>
            <p style={styles.paragraphText}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>

            <h2 style={styles.sectionTitle}>A que no dedicamos ?</h2>
            <p style={styles.paragraphText}>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>

            <h2 style={styles.sectionTitle}>Comienzos ?</h2>
            <p style={styles.paragraphText}>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, 
                eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>

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