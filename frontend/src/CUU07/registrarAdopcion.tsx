import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig'; // ¡Asegurate de importar tu instancia de axios!

type ViewState = 'MAIN_FORM' | 'SUCCESS';

// Agregamos la interfaz para los datos de respuesta
interface AdopcionExitosa {
    nro_adopcion: number;
    fecha_adopcion: string;
    nro_animal: string;
    dni_adoptante: string;
}

export default function RegistrarAdopcion() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

    // Estados del formulario
    const [dni, setDni] = useState('');
    const [nroAnimal, setNroAnimal] = useState('');
    
    // Estado para guardar la respuesta del backend
    const [datosExito, setDatosExito] = useState<AdopcionExitosa | null>(null);

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleRegistrarAdopcion = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!dni || !nroAnimal) {
            Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete todos los campos.' });
            return;
        }

        try {
            // Armamos el payload con los nombres que suele esperar tu backend
            const payload = {
                dni_adoptante: dni,
                nro_animal: parseInt(nroAnimal, 10)
            };

            // Hacemos el POST al backend (ajustá la ruta exacta si es distinta)
            const response = await api.post('/adopcion/registrar', payload);
            
            console.log('Respuesta del backend:', response.data);

            // Guardamos los datos reales para mostrarlos en la pantalla de éxito
            setDatosExito({
                nro_adopcion: response.data.data.nro_adopcion,
                fecha_adopcion: response.data.data.fecha_adopcion, 
                nro_animal: nroAnimal,
                dni_adoptante: dni
            });

            setCurrentView('SUCCESS');

        } catch (error: any) {
            // 1. Logueamos la respuesta cruda para ver qué estructura mandó Express
            console.log('Estructura del error en el front:', error.response?.data);

            // 2. Definimos el mensaje por defecto
            let mensajeBack = 'Ocurrió un error al registrar la adopción.';

            // 3. Buscamos el mensaje real en las rutas más comunes
            if (error.response && error.response.data) {
                const data = error.response.data;
                
                if (data.messages && data.messages.length > 0) {
                    // Si llega como { messages: ["..."] }
                    mensajeBack = data.messages[0];
                } else if (data.message) {
                    // Si llega como { message: "..." } (muy común si usas manejadores de errores genéricos)
                    mensajeBack = data.message;
                } else if (data.error && typeof data.error === 'string') {
                    // Si llega como { error: "..." }
                    mensajeBack = data.error;
                }
            }
            
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: mensajeBack,
                confirmButtonColor: '#F39C12',
            });
        }
    };

    const handleOtraAdopcion = () => {
        setDni('');
        setNroAnimal('');
        setDatosExito(null);
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'SUCCESS') {
            handleOtraAdopcion();
        } else {
            navigate(-1); 
        }
    };

    // Formateador de fecha auxiliar para que se vea como DD/MM/YYYY
    const formatearFecha = (fechaString: string) => {
        if (!fechaString) return '';
        const soloFecha = fechaString.split('T')[0]; // Corta en la T y se queda con "2026-07-28"
        const [year, month, day] = soloFecha.split('-'); // Separa por guiones
        return `${day}/${month}/${year}`; // Arma "28/07/2026"
    };

    // -------------------------------------------------------------------------
    // VISTA 2: ÉXITO (3-FS-adopcion-creada)
    // -------------------------------------------------------------------------
    if (currentView === 'SUCCESS' && datosExito) {
        return (
            <div style={styles.container}>
                <div style={styles.headerRow}>
                    <h1 style={styles.title}>Registrar adopcion</h1>
                    <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
                </div>

                <div style={styles.successCard}>
                    <h2 style={styles.successTitle}>Adopción registrada con éxito</h2>
                    
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Nro. de adopción</span>
                        <span style={styles.infoValue}>{datosExito.nro_adopcion}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Fecha adopción</span>
                        {/* Asumiendo que el backend devuelve '2026-07-19' */}
                        <span style={styles.infoValue}>{formatearFecha(datosExito.fecha_adopcion)}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Nro. Animal</span>
                        <span style={styles.infoValue}>{datosExito.nro_animal}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Nro. DNI</span>
                        <span style={styles.infoValue}>{datosExito.dni_adoptante}</span>
                    </div>

                    <button style={styles.buttonBackLarge} onClick={handleOtraAdopcion}>
                        Realizar otra adopción
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