import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 
    | 'MAIN_FORM' 
    | 'SUCCESS_APPROVED' 
    | 'SUCCESS_REJECTED' 
    | 'SUCCESS_CANCELLED' 
    | 'REPROGRAM_FORM' 
    | 'SUCCESS_REPROGRAMMED';

interface EntrevistaData {
    nombreAdoptante: string;
    apellidoAdoptante: string;
    especieAnimal: string;
    raza: string;
    edad: string;
    sexo: string;
    peso: string;
    descripcion: string;
}

export default function ResultadoEntrevista() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

    // Estados - Búsqueda y Datos
    const [nroEntrevista, setNroEntrevista] = useState('');
    const [entrevistaData, setEntrevistaData] = useState<EntrevistaData | null>(null);

    // Estados - Resultado
    const [resultado, setResultado] = useState('');
    const [descripcionResultado, setDescripcionResultado] = useState('');

    // Estados - Reprogramación
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHora, setNuevaHora] = useState('');

    // -------------------------------------------------------------------------
    // MÉTODOS DE ACCIÓN
    // -------------------------------------------------------------------------

    const handleBuscarEntrevista = () => {
        // Simulación ALERTA 1: Entrevista 1 no existe
        if (nroEntrevista === '1') {
        setEntrevistaData(null);
        Swal.fire({
            icon: 'warning',
            title: 'Atencion',
            text: `Entrevista con numero ${nroEntrevista} no se encuentra registrado`,
            confirmButtonColor: '#F39C12',
        });
        } else if (nroEntrevista.trim() !== '') {
        // Cargamos datos simulados
        setEntrevistaData({
            nombreAdoptante: 'JUAN',
            apellidoAdoptante: 'PEREZ',
            especieAnimal: 'PERRO',
            raza: 'MESTIZO',
            edad: '3 AÑOS',
            sexo: 'MACHO',
            peso: '20 KG',
            descripcion: 'Animal rescatado en buenas condiciones, apto para convivir con niños.'
        });
        }
    };

    const handleRegistrarResultado = (e: React.FormEvent) => {
        e.preventDefault();

        if (!resultado || !descripcionResultado) {
        Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete el resultado y la descripción.' });
        return;
        }

        // Aquí mapearías el estado booleano para Mikro-ORM según el resultado.
        // Ejemplo: const isActiva = (resultado !== 'Cancelada'); 
        
        switch (resultado) {
        case 'Aprobada':
            setCurrentView('SUCCESS_APPROVED');
            break;
        case 'Rechazada':
            setCurrentView('SUCCESS_REJECTED');
            break;
        case 'Cancelada':
            setCurrentView('SUCCESS_CANCELLED');
            break;
        case 'Reprogramar':
            setCurrentView('REPROGRAM_FORM');
            break;
        }
    };

    const handleConfirmarReprogramacion = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Simulación ALERTA 2: Reprogramación no permitida si elige el 1 de Enero de 2020
        if (nuevaFecha === '2020-01-01') {
        Swal.fire({
            icon: 'error',
            title: 'Atencion',
            text: 'Reprogramacion no permitida. Elija una fecha futura válida.',
            confirmButtonColor: '#E74C3C',
        });
        return;
        }

        setCurrentView('SUCCESS_REPROGRAMMED');
    };

    const handleReiniciarFlujo = () => {
        setNroEntrevista('');
        setEntrevistaData(null);
        setResultado('');
        setDescripcionResultado('');
        setNuevaFecha('');
        setNuevaHora('');
        setCurrentView('MAIN_FORM');
    };

    const handleVolver = () => {
        if (currentView === 'REPROGRAM_FORM') {
        setCurrentView('MAIN_FORM');
        } else if (currentView !== 'MAIN_FORM') {
        handleReiniciarFlujo();
        } else {
        navigate(-1);
        }
    };

    // -------------------------------------------------------------------------
    // RENDERIZADO DE VISTAS
    // -------------------------------------------------------------------------

    // VISTA: REPROGRAMACIÓN EXITOSA (2.c.3-FS)
    if (currentView === 'SUCCESS_REPROGRAMMED') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Entrevista reprogramada</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <div style={styles.successCard}>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Numero entrevista</span><span style={styles.infoValue}>{nroEntrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha nueva</span><span style={styles.infoValue}>{nuevaFecha.split('-').reverse().join('/')}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Hora nueva</span><span style={styles.infoValue}>{nuevaHora}</span></div>
            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>Evaluar otra entrevista</button>
            </div>
        </div>
        );
    }

    // VISTA: FORMULARIO DE REPROGRAMACIÓN (2.c.1-FE)
    if (currentView === 'REPROGRAM_FORM') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Reprogramar entrevista</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <form style={styles.formContainer} onSubmit={handleConfirmarReprogramacion}>
            <label style={styles.labelCentered}>Fecha de reprogramacion</label>
            <input style={styles.input} type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} required />
            <label style={styles.labelCentered}>Hora de reprogramacion</label>
            <input style={styles.input} type="time" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)} required />
            <button type="submit" style={styles.buttonSubmit}>Confirmar reprogramacion</button>
            </form>
        </div>
        );
    }

    // VISTA: CANCELADA (2.c.1-FS)
    if (currentView === 'SUCCESS_CANCELLED') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Entrevista cancelada</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <div style={styles.successCard}>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado animal</span><span style={styles.infoValueSuccess}>Disponible</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado entrevista</span><span style={styles.infoValueDanger}>Cancelada</span></div>
            {/* NOTA PARA BD: Este estado visual "Cancelada" corresponde a `estado = false` en tu tabla de Mikro-ORM */}
            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>Evaluar otra entrevista</button>
            </div>
        </div>
        );
    }

    // VISTA: RECHAZADA (2.b-FS)
    if (currentView === 'SUCCESS_REJECTED') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Entrevista rechazada</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <div style={styles.successCard}>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado animal</span><span style={styles.infoValueSuccess}>Disponible</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado entrevista</span><span style={styles.infoValueDanger}>Rechazada</span></div>
            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>Evaluar otra entrevista</button>
            </div>
        </div>
        );
    }

    // VISTA: APROBADA (3-FS)
    if (currentView === 'SUCCESS_APPROVED') {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
            <h1 style={styles.title}>Entrevista aprobada</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <div style={styles.successCard}>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. de adopcion</span><span style={styles.infoValue}>15</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha adopcion</span><span style={styles.infoValue}>19/07/2026</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. Entrevista</span><span style={styles.infoValue}>{nroEntrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. Colaborador</span><span style={styles.infoValue}>22</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. DNI adoptante</span><span style={styles.infoValue}>35136842</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. de animal</span><span style={styles.infoValue}>8</span></div>
            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>Evaluar otra entrevista</button>
            </div>
        </div>
        );
    }

    // VISTA: PRINCIPAL (BÚSQUEDA Y EVALUACIÓN) (1-FE / 1-FS)
    return (
        <div style={styles.container}>
        <div style={styles.headerRow}>
            <h1 style={styles.title}>Registrar resultado de entrevista</h1>
            <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <div style={styles.scrollableFormWrapper}>
            <div style={styles.formContainer}>
            <label style={styles.labelCentered}>Ingrese el numero de la entrevista</label>
            
            <div style={{ display: 'flex', width: '100%', marginBottom: '25px' }}>
                <input 
                style={{
                    flex: 1, padding: '12px', border: '2px solid #3498DB', borderRight: 'none',
                    borderRadius: '5px 0 0 5px', fontSize: '14px', textAlign: 'center',
                    color: '#2C3E50', outline: 'none', backgroundColor: '#ECF0F1'
                }}
                type="text" 
                placeholder="Ej: 5" 
                value={nroEntrevista} 
                onChange={e => setNroEntrevista(e.target.value.replace(/\D/g, ''))} 
                />
                <button 
                type="button" 
                style={{
                    backgroundColor: '#ECF0F1', color: '#3498DB', border: '2px solid #3498DB',
                    borderLeft: 'none', borderRadius: '0 5px 5px 0', padding: '0 20px',
                    cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center'
                }} 
                onClick={handleBuscarEntrevista}
                >
                🔍
                </button>
            </div>

            {entrevistaData && (
                <form onSubmit={handleRegistrarResultado} style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                
                <div style={styles.grid2Cols}>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Nombre adoptante</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.nombreAdoptante} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Apellido adoptante</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.apellidoAdoptante} readOnly /></div>
                </div>

                <div style={styles.grid2Cols}>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Especie animal</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.especieAnimal} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Raza</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.raza} readOnly /></div>
                </div>

                <div style={styles.grid3Cols}>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Edad</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.edad} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Sexo animal</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.sexo} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Peso</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.peso} readOnly /></div>
                </div>

                <label style={styles.labelCentered}>Descripcion</label>
                <textarea style={{...styles.textAreaReadOnly, minHeight: '60px'}} value={entrevistaData.descripcion} readOnly />

                <div style={styles.divider}></div>

                <label style={styles.labelCentered}>Seleccione el resultado de la entrevista</label>
                <select style={styles.selectInput} value={resultado} onChange={e => setResultado(e.target.value)} required>
                    <option value="" disabled>Seleccionar un resultado...</option>
                    <option value="Aprobada">Aprobada</option>
                    <option value="Rechazada">Rechazada</option>
                    <option value="Cancelada">Cancelada</option>
                    <option value="Reprogramar">Reprogramar</option>
                </select>

                <label style={styles.labelCentered}>Descripcion</label>
                <textarea 
                    style={styles.textArea} 
                    value={descripcionResultado} 
                    onChange={e => setDescripcionResultado(e.target.value)} 
                    placeholder="Observaciones de la evaluación..."
                    required 
                />

                <button type="submit" style={styles.buttonSubmit}>
                    Registrar resultado
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
        maxWidth: '700px', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '30px',
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
        display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '600px',
    },
    labelCentered: {
        fontSize: '13px', color: '#000', marginBottom: '6px', textAlign: 'center', fontWeight: 'bold',
    },
    grid2Cols: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', width: '100%' },
    grid3Cols: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', width: '100%' },
    inputGroup: { display: 'flex', flexDirection: 'column', width: '100%' },
    input: {
        backgroundColor: '#ECF0F1', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', textAlign: 'center',
        color: '#2C3E50', outline: 'none',
    },
    inputReadOnly: {
        backgroundColor: '#F2F3F4', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '10px', marginBottom: '15px', fontSize: '13px', textAlign: 'center',
        color: '#7F8C8D', outline: 'none',
    },
    textArea: {
        backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', color: '#2C3E50',
        outline: 'none', minHeight: '80px', resize: 'none',
    },
    textAreaReadOnly: {
        backgroundColor: '#F2F3F4', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '10px', marginBottom: '15px', fontSize: '13px', color: '#7F8C8D',
        outline: 'none', resize: 'none',
    },
    selectInput: {
        backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px',
        padding: '12px', marginBottom: '20px', fontSize: '14px', color: '#2C3E50',
        outline: 'none', cursor: 'pointer', textAlign: 'center',
    },
    divider: {
        width: '100%', height: '2px', backgroundColor: '#ECF0F1', margin: '20px 0',
    },
    buttonSubmit: {
        backgroundColor: '#27AE60', color: '#FFFFFF', padding: '15px', border: 'none',
        borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
        width: '100%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginTop: '10px',
    },
    successCard: {
        display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%',
        maxWidth: '500px', backgroundColor: '#FFFFFF', padding: '20px',
    },
    infoRow: {
        display: 'flex', justifyContent: 'space-between', width: '100%', padding: '15px 0',
        borderBottom: '1px solid #ECF0F1',
    },
    infoLabel: { fontWeight: 'bold', color: '#34495E' },
    infoValue: { color: '#2C3E50', fontWeight: 'bold' },
    infoValueSuccess: { color: '#27AE60', fontWeight: 'bold' },
    infoValueDanger: { color: '#E74C3C', fontWeight: 'bold' },
    buttonBackLarge: {
        backgroundColor: '#95A5A6', color: '#FFFFFF', padding: '15px', border: 'none',
        borderRadius: '5px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer',
        marginTop: '40px', width: '100%',
    },
};