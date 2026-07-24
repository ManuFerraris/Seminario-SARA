import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig';

type ViewState = 'MAIN_FORM' | 'ALTA_RESCATISTA' | 'SUCCESS';

export default function RegistroRescate() {
    const navigate = useNavigate();

    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');
    const [isRescatistaNotFound, setIsRescatistaNotFound] = useState(false);
    
    // Estado para guardar los IDs generados y mostrarlos en la pantalla de éxito
    const [rescateExitoso, setRescateExitoso] = useState({ nro_rescate: '', nro_animal: '' });

    // Estados del formulario principal
    const [dniBusqueda, setDniBusqueda] = useState('');
    const [especie, setEspecie] = useState('');
    const [sexo, setSexo] = useState('');
    const [raza, setRaza] = useState('');
    const [peso, setPeso] = useState('');
    const [estadoAnimal] = useState('No Apto'); // Ojo: lo puse igual que tu backend
    const [edad, setEdad] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [lugar, setLugar] = useState('');
    const [fechaRescate, setFechaRescate] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');

    // Estados del formulario Alta Rescatista
    const [nombreResc, setNombreResc] = useState('');
    const [apellidoResc, setApellidoResc] = useState('');
    const [emailResc, setEmailResc] = useState('');
    const [telefonoResc, setTelefonoResc] = useState('');
    const [contraseniaResc, setContraseniaResc] = useState('');
    const [contraseniaRescConfirm, setContraseniaRescConfirm] = useState('');
    const [direccionResc, setDireccionResc] = useState('');

    const handleBuscarDNI = async () => {
        if (!dniBusqueda.trim()) return;

        try {
            // Hacemos una petición real para ver si la persona existe
            // NOTA: Asegurate de tener este endpoint GET en tu backend
            await api.get(`/persona/${dniBusqueda}`); 
            
            Swal.fire({
                icon: 'success',
                title: 'Rescatista encontrado',
                text: 'Puede continuar con el registro del rescate.',
                timer: 1500,
                showConfirmButton: false,
            });
            setIsRescatistaNotFound(false);
        } catch (error: any) {
            // Si el backend devuelve 404, habilitamos el alta
            if (error.response && error.response.status === 404) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: `No se encontró el rescatista con el DNI '${dniBusqueda}'`,
                    confirmButtonColor: '#F39C12',
                });
                setIsRescatistaNotFound(true);
            } else {
                Swal.fire('Error', 'Hubo un problema de conexión al buscar el DNI', 'error');
            }
        }
    };

    const handleRegistrarRescatista = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Acá conectarías con el endpoint de crear persona
            const payload = {
                dni: dniBusqueda,
                nombre: nombreResc,
                apellido: apellidoResc,
                email: emailResc,
                contrasenia: contraseniaResc,
                contraseniaConfirm: contraseniaRescConfirm,
                domicilio: direccionResc,
                telefono: telefonoResc
            };
            
            await api.post('/persona/crear-persona', payload);

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Rescatista dado de alta correctamente.',
                timer: 1500,
                showConfirmButton: false,
            });
            setCurrentView('MAIN_FORM');
            setIsRescatistaNotFound(false);
        } catch (error) {
            Swal.fire('Error', 'No se pudo registrar el rescatista', 'error');
        }
    };

    const handleRegistrarRescate = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // 1. Armamos el objeto con EXACTAMENTE los nombres que espera tu DTO
            const payload = {
                dni_rescatista: dniBusqueda,
                animal_especie: especie,
                animal_sexo: sexo, 
                animal_raza: raza,
                animal_peso: parseFloat(peso), // Convertimos a número
                animal_estado: estadoAnimal, 
                animal_edad_estimada: parseInt(edad, 10), // Convertimos a número
                animal_descripcion: descripcion,
                lugar_rescate_descripcion: lugar,
                fecha_rescate: fechaRescate,
                fecha_ingreso_animal: fechaIngreso
                // fotos: Por ahora lo omitimos hasta que configuremos Multer en el back
            };

            // 2. Enviamos al endpoint que armamos en el paso anterior
            const response = await api.post('/rescate/registrar-rescate', payload);

            if (response.data.success) {
                const rescateCreado = response.data.data;
                
                // 1. Disparamos la notificación de éxito VERIFICAR MENSAJE SEGUN BOSQUEJO!!!
                Swal.fire({
                    icon: 'success',
                    title: '¡Rescate registrado!',
                    text: 'El animal y el rescate se guardaron correctamente.',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                // 2. Guardamos los IDs reales
                setRescateExitoso({
                    nro_rescate: rescateCreado.nro_rescate, 
                    nro_animal: rescateCreado.animal.nro_animal 
                });
                
                // 3. Pasamos a la vista de resumen (SUCCESS)
                setCurrentView('SUCCESS');
            }

        } catch (error: any) {
            // Mostramos el error exacto que mandó tu middleware o tu validación
            const mensajeError = error.response?.data?.messages?.[0] || 'Ocurrió un error inesperado al registrar';
            Swal.fire({
                icon: 'error',
                title: 'No se pudo registrar',
                text: mensajeError,
            });
        }
    };

    const handleNuevoRescate = () => {
        setDniBusqueda('');
        setEspecie('');
        setSexo('');
        setRaza('');
        setPeso('');
        setEdad('');
        setDescripcion('');
        setLugar('');
        setFechaRescate('');
        setFechaIngreso('');
        setIsRescatistaNotFound(false);
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'ALTA_RESCATISTA') {
            setCurrentView('MAIN_FORM');
        } else {
            navigate(-1);
        }
    };

    if (currentView === 'SUCCESS') {
        return (
            <div style={styles.container}>
                <button style={styles.volverHeaderBtn} onClick={() => navigate(-1)}>Volver</button>
                <div style={styles.successCard}>
                    <h2 style={styles.successTitle}>Registro de rescate realizado con éxito</h2>
                    <div style={styles.successGrid}>
                        <div style={styles.successBox}>
                            <span style={styles.successLabel}>Nro. de rescate</span>
                            <div style={styles.successValueBox}>{rescateExitoso.nro_rescate}</div>
                        </div>
                        <div style={styles.successBox}>
                            <span style={styles.successLabel}>Nro. de documento del rescatista</span>
                            <div style={styles.successValueBox}>{dniBusqueda}</div>
                        </div>
                        <div style={styles.successBox}>
                            <span style={styles.successLabel}>Nro. del Animal</span>
                            <div style={styles.successValueBox}>{rescateExitoso.nro_animal}</div>
                        </div>
                    </div>
                    <button style={styles.buttonSubmit} onClick={handleNuevoRescate}>
                        Dar de alta otro rescate
                    </button>
                </div>
            </div>
        );
    }

    if (currentView === 'ALTA_RESCATISTA') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Alta Rescatista</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <form style={styles.formContainer} onSubmit={handleRegistrarRescatista}>
            <label style={styles.labelCentered}>Ingrese el DNI del rescatista</label>
            <input style={styles.input} type="text" value={dniBusqueda} readOnly />
            <label style={styles.labelCentered}>Ingrese su nombre</label>
            <input style={styles.input} type="text" value={nombreResc} onChange={e => setNombreResc(e.target.value)} required />
            <label style={styles.labelCentered}>Ingrese su apellido</label>
            <input style={styles.input} type="text" value={apellidoResc} onChange={e => setApellidoResc(e.target.value)} required />
            <label style={styles.labelCentered}>Ingrese su email</label>
            <input style={styles.input} type="email" value={emailResc} onChange={e => setEmailResc(e.target.value)} required />
            <label style={styles.labelCentered}>Ingrese su telefono</label>
            <input style={styles.input} type="tel" value={telefonoResc} onChange={e => setTelefonoResc(e.target.value.replace(/\D/g, ''))} required />
            <label style={styles.labelCentered}>Ingrese su direccion</label>
            <input style={styles.input} type="text" value={direccionResc} onChange={e => setDireccionResc(e.target.value)} required />
            <label style={styles.labelCentered}>Ingrese su contraseña</label>
            <input style={styles.input} type="password" value={contraseniaResc} onChange={e => setContraseniaResc(e.target.value)} required />
            <label style={styles.labelCentered}>Confirme su contraseña</label>
            <input style={styles.input} type="password" value={contraseniaRescConfirm} onChange={e => setContraseniaRescConfirm(e.target.value)} required />
            
            <button type="submit" style={styles.buttonSubmit}>
                Registrar Rescatista
            </button>
            </form>
        </div>
        );
    }

    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Registro de Rescate</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.scrollableFormWrapper}>
            <form style={styles.formContainer} onSubmit={handleRegistrarRescate}>
            
            <label style={styles.labelCentered}>Ingrese el DNI del rescatista</label>
            
            {/* BUSCADOR DNI GARANTIZADO */}
            <div style={{ display: 'flex', width: '100%', marginBottom: '15px' }}>
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
                    backgroundColor: '#FFFFFF'
                }}
                type="text" 
                placeholder="Ej: 11222333" 
                value={dniBusqueda} 
                onChange={e => setDniBusqueda(e.target.value.replace(/\D/g, ''))} 
                />
                <button 
                type="button" 
                style={{
                    backgroundColor: '#3498DB',
                    color: '#FFFFFF',
                    border: '2px solid #3498DB',
                    borderRadius: '0 5px 5px 0',
                    padding: '0 20px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} 
                onClick={handleBuscarDNI}
                >
                🔍
                </button>
            </div>

            <button 
                type="button" 
                disabled={!isRescatistaNotFound}
                style={isRescatistaNotFound ? styles.btnAltaRescatistaActive : styles.btnAltaRescatistaDisabled} 
                onClick={() => setCurrentView('ALTA_RESCATISTA')}
            >
                Alta Rescatista
            </button>

            <label style={styles.labelCentered}>Ingrese la especie</label>
            <input style={styles.input} type="text" value={especie} onChange={e => setEspecie(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese el sexo</label>
            <input style={styles.input} type="text" value={sexo} onChange={e => setSexo(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese la raza</label>
            <input style={styles.input} type="text" value={raza} onChange={e => setRaza(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese el peso (en Kg)</label>
            <input style={styles.input} type="number" value={peso} onChange={e => setPeso(e.target.value)} required />

            <label style={styles.labelCentered}>Estado animal</label>
            <input style={styles.inputReadOnly} type="text" value={estadoAnimal} readOnly />

            <label style={styles.labelCentered}>Ingrese la edad estimada</label>
            <input style={styles.input} type="number" value={edad} onChange={e => setEdad(e.target.value)} required />

            <label style={styles.labelCentered}>Ingrese una descripcion (opcional)</label>
            <input style={styles.input} type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} />

            <label style={styles.labelCentered}>Ingrese una descripcion del lugar del rescate</label>
            <input style={styles.input} type="text" value={lugar} onChange={e => setLugar(e.target.value)} required />

            <label style={styles.labelCentered}>Seleccione la fecha del rescate</label>
            <input style={styles.input} type="date" value={fechaRescate} onChange={e => setFechaRescate(e.target.value)} required />

            <label style={styles.labelCentered}>Seleccione la fecha de ingreso</label>
            <input style={styles.input} type="date" value={fechaIngreso} onChange={e => setFechaIngreso(e.target.value)} required />

            <label style={styles.labelCentered}>Ingresar fotografia/s y video/s</label>
            <input style={{...styles.input, padding: '10px'}} type="file" multiple accept="image/*,video/*" />

            <button type="submit" style={styles.buttonSubmit}>
                Registrar rescate
            </button>
            </form>
        </div>
        </div>
    );
    }

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
        maxWidth: '600px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        marginBottom: '20px',
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
        padding: '5px 15px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    scrollableFormWrapper: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflowY: 'auto',
        maxHeight: '85vh',
        paddingRight: '10px', 
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        maxWidth: '500px',
    },
    labelCentered: {
        fontSize: '13px',
        color: '#000',
        marginBottom: '5px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#ECF0F1',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '15px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#2C3E50',
        outline: 'none',
    },
    inputReadOnly: {
        backgroundColor: '#E0E0E0',
        border: '1px solid #BDC3C7',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '15px',
        fontSize: '14px',
        textAlign: 'center',
        color: '#7F8C8D',
        outline: 'none',
    },
    btnAltaRescatistaDisabled: {
        backgroundColor: '#BDC3C7', 
        color: '#7F8C8D', 
        border: 'none',
        borderRadius: '5px',
        padding: '10px',
        fontWeight: 'bold',
        marginBottom: '20px',
        cursor: 'not-allowed', 
    },
    btnAltaRescatistaActive: {
        backgroundColor: '#27AE60', 
        color: '#FFF',
        border: 'none',
        borderRadius: '5px',
        padding: '10px',
        fontWeight: 'bold',
        marginBottom: '20px',
        cursor: 'pointer',
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
        marginTop: '20px',
        marginBottom: '40px',
    },
    successCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '700px',
        marginTop: '40px',
        textAlign: 'center',
    },
    successTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '40px',
    },
    successGrid: {
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: '40px',
        flexWrap: 'wrap',
        gap: '20px',
    },
    successBox: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    successLabel: {
        fontSize: '14px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    successValueBox: {
        border: '2px solid #3498DB',
        padding: '10px 30px',
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#3498DB',
        minWidth: '100px',
    }
};