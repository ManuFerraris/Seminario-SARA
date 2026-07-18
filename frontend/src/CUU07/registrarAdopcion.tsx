import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 'MAIN_FORM' | 'SUCCESS';

export default function RegistrarAdopcion() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

    // Estados del formulario
    const [dni, setDni] = useState('');
    const [nroAnimal, setNroAnimal] = useState('');

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleRegistrarAdopcion = (e: React.FormEvent) => {
        e.preventDefault();

        // Simulación: El animal número 5 no tiene las vacunas al día
        if (nroAnimal === '5') {
        Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            text: 'Adopcion bloqueda. El animal no posee las vacunas al dia',
            confirmButtonColor: '#F39C12',
        });
        return;
        }

        // Si pasa la validación, procedemos a la vista de éxito
        console.log(`Registrando adopción para DNI: ${dni}, Animal: ${nroAnimal}`);
        setCurrentView('SUCCESS');
    };

    const handleOtraAdopcion = () => {
        // Reseteamos el estado para una nueva adopción
        setDni('');
        setNroAnimal('');
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'SUCCESS') {
        setCurrentView('MAIN_FORM');
        } else {
        navigate(-1); // Regresa a la ruta anterior en React Router
        }
    };

    // -------------------------------------------------------------------------
    // VISTA 2: ÉXITO (3-FS-adopcion-creada)
    // -------------------------------------------------------------------------
    if (currentView === 'SUCCESS') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar adopcion</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <div style={styles.successCard}>
            {/* Mantenemos el texto tal cual figura en el bosquejo */}
            <h2 style={styles.successTitle}>Adopcion registrada con exito</h2>
            
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nro. de adopcion</span>
                <span style={styles.infoValue}>15</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Fecha adopcion</span>
                <span style={styles.infoValue}>19/07/2026</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nro. Animal</span>
                <span style={styles.infoValue}>{nroAnimal || '69'}</span>
            </div>
            <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Nro. DNI</span>
                <span style={styles.infoValue}>{dni || '11222333'}</span>
            </div>

            <button style={styles.buttonBackLarge} onClick={handleOtraAdopcion}>
                Realizar otra adopcion
            </button>
            </div>
        </div>
        );
    }

    // -------------------------------------------------------------------------
    // VISTA 1: REGISTRAR ADOPCIÓN (1-FE-confirmacion-adopcion)
    // -------------------------------------------------------------------------
    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar adopcion</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <form style={styles.formContainer} onSubmit={handleRegistrarAdopcion}>
            
            <label style={styles.labelCentered}>Ingrese el numero de DNI</label>
            <input 
            style={styles.input} 
            type="text" 
            placeholder="Ej: 11222333" 
            value={dni} 
            onChange={e => setDni(e.target.value.replace(/\D/g, ''))} 
            required 
            />

            <label style={styles.labelCentered}>Ingrese el numero del animal</label>
            <input 
            style={styles.input} 
            type="text" 
            placeholder="Ej: 5" 
            value={nroAnimal} 
            onChange={e => setNroAnimal(e.target.value.replace(/\D/g, ''))} 
            required 
            />

            <button type="submit" style={styles.buttonSubmit}>
            Registrar adopcion
            </button>
        </form>
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
        maxWidth: '500px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        marginBottom: '40px',
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
        maxWidth: '400px',
    },
    labelCentered: {
        fontSize: '14px',
        color: '#000',
        marginBottom: '8px',
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
        backgroundColor: '#689F38', // Verde similar al de tus bosquejos
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
        maxWidth: '450px',
        backgroundColor: '#FFFFFF',
        padding: '20px',
    },
    successTitle: {
        fontSize: '20px',
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