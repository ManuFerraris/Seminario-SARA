import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 'MAIN_FORM' | 'SUCCESS';

interface AnimalData {
    especie: string;
    raza: string;
    edad: string;
    sexo: string;
    peso: string;
    descripcion: string;
}

export default function RegistrarRevision() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

    // Estados - Búsqueda
    const [nroAnimal, setNroAnimal] = useState('');
    const [animalData, setAnimalData] = useState<AnimalData | null>(null);

    // Estados - Formulario de Revisión
    const [observaciones, setObservaciones] = useState('');
    const [estadoAnimal, setEstadoAnimal] = useState('');

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleBuscarAnimal = () => {
        // Simulación: El animal número 15 no está registrado
        if (nroAnimal === '15') {
        setAnimalData(null);
        Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            html: `Animal con numero ${nroAnimal} no se<br/>encuentra registrado`,
            confirmButtonColor: '#F39C12',
        });
        } else if (nroAnimal.trim() !== '') {
        // Simulación de carga de datos exitosa
        setAnimalData({
            especie: 'PERRO',
            raza: 'CUSCO',
            edad: '5',
            sexo: 'HEMBRA',
            peso: '15',
            descripcion: 'Docil y Juguetona, le tiene miedo a la tormenta'
        });
        }
    };

    const handleRegistrarRevision = (e: React.FormEvent) => {
        e.preventDefault();

        if (!observaciones || !estadoAnimal) {
        Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete las observaciones y el estado del animal.' });
        return;
        }

        // Si todo está correcto, pasamos a la pantalla de éxito
        console.log('Registrando revisión:', { nroAnimal, observaciones, estadoAnimal });
        setCurrentView('SUCCESS');
    };

    const handleOtraFicha = () => {
        // Limpiamos los estados para registrar una nueva revisión
        setNroAnimal('');
        setAnimalData(null);
        setObservaciones('');
        setEstadoAnimal('');
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'SUCCESS') {
        setCurrentView('MAIN_FORM');
        } else {
        navigate(-1);
        }
    };

    // -------------------------------------------------------------------------
    // VISTA 2: ÉXITO (3-FS-registro-ficha)
    // -------------------------------------------------------------------------
    if (currentView === 'SUCCESS') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            {/* Mantenemos el título vacío a la izquierda para centrar o usamos el botón Volver */}
            <div style={{ flex: 1 }}></div>
            <button style={styles.volverHeaderBtn} onClick={() => navigate(-1)}>Volver</button>
            </div>

            <div style={styles.successCard}>
            <h2 style={styles.successTitle}>Ficha medica registrada</h2>
            
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nro. de ficha</span>
                <span style={styles.infoValue}>{nroAnimal || '15'}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Fecha de registro</span>
                <span style={styles.infoValue}>19/07/2026</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Estado animal</span>
                <span style={estadoAnimal === 'No apto' ? styles.infoValueWarning : styles.infoValueSuccess}>
                {estadoAnimal}
                </span>
            </div>
            
            <div style={styles.infoColumn}>
                <span style={styles.infoLabel}>Observaciones</span>
                <div style={styles.readOnlyTextAreaBox}>
                {observaciones}
                </div>
            </div>

            <button style={styles.buttonBackLarge} onClick={handleOtraFicha}>
                Registrar otra ficha
            </button>
            </div>
        </div>
        );
    }

    // -------------------------------------------------------------------------
    // VISTA 1: BUSCAR ANIMAL Y FORMULARIO (1-FE-ingreso-animal / 1-FS-datos-animal)
    // -------------------------------------------------------------------------
    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar revision medica</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.scrollableFormWrapper}>
            <div style={styles.formContainer}>
            <label style={styles.labelCentered}>Ingrese el numero del animal</label>
            
            {/* BUSCADOR */}
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
                placeholder="Ej: 15" 
                value={nroAnimal} 
                onChange={e => setNroAnimal(e.target.value.replace(/\D/g, ''))} 
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
                onClick={handleBuscarAnimal}
                >
                🔍
                </button>
            </div>

            {/* FORMULARIO COMPLETO AL ENCONTRAR ANIMAL */}
            {animalData && (
                <form onSubmit={handleRegistrarRevision} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <div style={styles.grid2Cols}>
                    <div style={styles.inputGroup}>
                    <label style={styles.labelCentered}>Especie</label>
                    <input style={styles.inputReadOnly} type="text" value={animalData.especie} readOnly />
                    </div>
                    <div style={styles.inputGroup}>
                    <label style={styles.labelCentered}>Raza</label>
                    <input style={styles.inputReadOnly} type="text" value={animalData.raza} readOnly />
                    </div>
                </div>

                <div style={styles.grid3Cols}>
                    <div style={styles.inputGroup}>
                    <label style={styles.labelCentered}>Edad (AÑOS)</label>
                    <input style={styles.inputReadOnly} type="text" value={animalData.edad} readOnly />
                    </div>
                    <div style={styles.inputGroup}>
                    <label style={styles.labelCentered}>Sexo</label>
                    <input style={styles.inputReadOnly} type="text" value={animalData.sexo} readOnly />
                    </div>
                    <div style={styles.inputGroup}>
                    <label style={styles.labelCentered}>Peso (KG)</label>
                    <input style={styles.inputReadOnly} type="text" value={animalData.peso} readOnly />
                    </div>
                </div>

                <label style={styles.labelCentered}>Descripcion</label>
                <input style={styles.inputReadOnly} type="text" value={animalData.descripcion} readOnly />

                <label style={styles.labelCentered}>Ingresar observaciones</label>
                <textarea 
                    style={styles.textArea} 
                    value={observaciones} 
                    onChange={e => setObservaciones(e.target.value)} 
                    required 
                />

                <label style={styles.labelCentered}>Seleccione el estado del animal</label>
                <select 
                    style={styles.selectInput} 
                    value={estadoAnimal} 
                    onChange={e => setEstadoAnimal(e.target.value)} 
                    required
                >
                    <option value="" disabled>Seleccionar un estado</option>
                    <option value="Apto para vacunar">Apto para vacunar</option>
                    <option value="No apto">No apto</option>
                </select>

                <button type="submit" style={styles.buttonSubmit}>
                    Registrar revision
                </button>
                </form>
            )}

            {/* BOTÓN INACTIVO SI NO HAY ANIMAL (Simulando vista inicial 1-FE-ingreso-animal) */}
            {!animalData && (
                <button type="button" disabled style={styles.buttonSubmitDisabled}>
                Registrar revision
                </button>
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
    scrollableFormWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        maxHeight: '85vh',
        paddingRight: '5px',
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '550px',
    },
    labelCentered: {
        fontSize: '13px',
        color: '#000',
        marginBottom: '6px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    grid2Cols: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px',
        width: '100%',
    },
    grid3Cols: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '15px',
        width: '100%',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
    },
    inputReadOnly: {
        backgroundColor: '#F2F3F4',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#7F8C8D',
        outline: 'none',
    },
    textArea: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#2C3E50',
        outline: 'none',
        minHeight: '120px',
        resize: 'none',
    },
    selectInput: {
        backgroundColor: '#FFFFFF',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '12px',
        marginBottom: '30px',
        fontSize: '14px',
        color: '#2C3E50',
        outline: 'none',
        cursor: 'pointer',
        textAlign: 'center',
    },
    buttonSubmit: {
        backgroundColor: '#27AE60',
        color: '#FFFFFF',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        width: '100%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    buttonSubmitDisabled: {
        backgroundColor: '#BDC3C7',
        color: '#FFFFFF',
        padding: '15px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'not-allowed',
        width: '100%',
    },
    // Estilos Éxito
    successCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        backgroundColor: '#FFFFFF',
        padding: '20px',
        marginTop: '10px',
    },
    successTitle: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#2C3E50',
        marginBottom: '30px',
        textAlign: 'center',
        textDecoration: 'underline',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
        padding: '15px 0',
        borderBottom: '1px solid #ECF0F1',
    },
    infoColumn: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        padding: '15px 0',
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
    infoValueSuccess: {
        color: '#27AE60',
        fontWeight: 'bold',
    },
    infoValueWarning: {
        color: '#E74C3C',
        fontWeight: 'bold',
    },
    readOnlyTextAreaBox: {
        backgroundColor: '#F2F3F4',
        padding: '15px',
        borderRadius: '5px',
        color: '#7F8C8D',
        fontSize: '14px',
        lineHeight: '1.5',
        marginTop: '10px',
        textAlign: 'justify',
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