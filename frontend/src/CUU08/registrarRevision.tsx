import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig'; // ¡Acordate de importar tu instancia de axios!

type ViewState = 'MAIN_FORM' | 'SUCCESS';

interface AnimalData {
    especie: string;
    raza: string;
    edad: string;
    sexo: string;
    peso: string;
    descripcion: string;
}

// Interfaz para la respuesta de éxito
interface FichaExito {
    nro_ficha: string | number;
    fecha: string;
    estado_animal: string;
    observaciones: string;
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
    
    // Estado - Resultado exitoso
    const [datosExito, setDatosExito] = useState<FichaExito | null>(null);

    // -------------------------------------------------------------------------
    // FORMATEADOR DE FECHA
    // -------------------------------------------------------------------------
    const formatearFecha = (fechaString: string) => {
        if (!fechaString) return '';
        const soloFecha = fechaString.split('T')[0]; 
        const [year, month, day] = soloFecha.split('-');
        return `${day}/${month}/${year}`;
    };

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const obtenerDniDelToken = (): string | null => {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
        // Agarramos la segunda parte del token (el payload)
        const payloadBase64 = token.split('.')[1];
        
        // Lo decodificamos de Base64 a texto normal
        const payloadDecodificado = atob(payloadBase64);
        
        // Lo convertimos a un objeto JSON de JavaScript
        const payloadJson = JSON.parse(payloadDecodificado);
        
        // Retornamos el DNI
        return payloadJson.dni;
        } catch (error) {
        console.error("Error leyendo el token:", error);
        return null;
        }
    };

    const handleBuscarAnimal = async () => {
        if (!nroAnimal.trim()) return;

        try {
            // Hacemos el GET al backend para traer los datos reales del animal
            // Ajustá la ruta según tu Controlador
            const response = await api.get(`/animal/${nroAnimal}`);
            const data = response.data.data; // Asumiendo que tu backend devuelve { data: {...} }

            setAnimalData({
                especie: data.especie || '-',
                raza: data.raza || '-',
                edad: data.edad_estimada?.toString() || '-', // Ajustá el nombre del campo si es distinto
                sexo: data.sexo || '-',
                peso: data.peso?.toString() || '-',
                descripcion: data.descripcion || '-'
            });

        } catch (error: any) {
            // Si el animal no existe (ej: 404), limpiamos los datos y mostramos error
            setAnimalData(null);
            
            console.log('Error al buscar animal:', error.response?.data);
            
            let mensajeBack = `Animal con número ${nroAnimal} no se encuentra registrado.`;
            if (error.response && error.response.data) {
                const dataError = error.response.data;
                if (dataError.messages && dataError.messages.length > 0) mensajeBack = dataError.messages[0];
                else if (dataError.message) mensajeBack = dataError.message;
            }

            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: mensajeBack,
                confirmButtonColor: '#F39C12',
            });
        }
    };

    const handleRegistrarRevision = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!observaciones || !estadoAnimal) {
            Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete las observaciones y el estado del animal.' });
            return;
        }

        try {
            // Armamos el payload
            const payload = {
                nro_animal: parseInt(nroAnimal, 10),
                observaciones: observaciones,
                estado: 'Apto para vacunar',
                dni_veterinario: obtenerDniDelToken()
            };

            // Ajustá la ruta según tu Controlador
            const response = await api.post('/fichamedica/registrar', payload);
            console.log('Respuesta del backend:', response.data);

            // Guardamos los datos reales devueltos por la BD
            setDatosExito({
                nro_ficha: response.data.data.nro_ficha || response.data.data.id_ficha, // Ajustá según cómo se llame el ID de la ficha en tu BD
                fecha: response.data.data.fecha, // La fecha que guardó el servidor
                estado_animal: response.data.data.animal.estado,
                observaciones: observaciones
            });

            setCurrentView('SUCCESS');

        } catch (error: any) {
            console.log('Estructura del error en el front:', error.response?.data);
            
            let mensajeBack = 'Ocurrió un error al registrar la revisión médica.';
            if (error.response && error.response.data) {
                const data = error.response.data;
                if (data.messages && data.messages.length > 0) mensajeBack = data.messages[0];
                else if (data.message) mensajeBack = data.message;
                else if (data.error && typeof data.error === 'string') mensajeBack = data.error;
            }
            
            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: mensajeBack,
                confirmButtonColor: '#F39C12',
            });
        }
    };

    const handleOtraFicha = () => {
        setNroAnimal('');
        setAnimalData(null);
        setObservaciones('');
        setEstadoAnimal('');
        setDatosExito(null);
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'SUCCESS') {
            handleOtraFicha();
        } else {
            navigate(-1);
        }
    };

    // -------------------------------------------------------------------------
    // VISTA 2: ÉXITO (3-FS-registro-ficha)
    // -------------------------------------------------------------------------
    if (currentView === 'SUCCESS' && datosExito) {
        return (
            <div style={styles.container}>
                <div style={styles.headerRow}>
                    <div style={{ flex: 1 }}></div>
                    <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
                </div>

                <div style={styles.successCard}>
                    <h2 style={styles.successTitle}>Ficha médica registrada</h2>
                    
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Nro. de ficha</span>
                        <span style={styles.infoValue}>{datosExito.nro_ficha}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Fecha de registro</span>
                        {/* Usamos el formateador de fechas ISO */}
                        <span style={styles.infoValue}>{formatearFecha(datosExito.fecha)}</span>
                    </div>
                    <div style={styles.infoRow}>
                        <span style={styles.infoLabel}>Estado animal</span>
                        <span style={datosExito.estado_animal === 'No apto' ? styles.infoValueWarning : styles.infoValueSuccess}>
                            {datosExito.estado_animal}
                        </span>
                    </div>
                    
                    <div style={styles.infoColumn}>
                        <span style={styles.infoLabel}>Observaciones</span>
                        <div style={styles.readOnlyTextAreaBox}>
                            {datosExito.observaciones}
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
                <h1 style={styles.title}>Registrar revisión médica</h1>
                <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>

            <div style={styles.scrollableFormWrapper}>
                <div style={styles.formContainer}>
                    <label style={styles.labelCentered}>Ingrese el número del animal</label>
                    
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

                            <label style={styles.labelCentered}>Descripción</label>
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
                                Registrar revisión
                            </button>
                        </form>
                    )}

                    {/* BOTÓN INACTIVO SI NO HAY ANIMAL */}
                    {!animalData && (
                        <button type="button" disabled style={styles.buttonSubmitDisabled}>
                            Registrar revisión
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