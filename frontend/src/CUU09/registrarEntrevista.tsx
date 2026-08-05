import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig'; // Asegurate de importar la instancia de axios configurada
import jsPDF from 'jspdf';

type ViewState = 
    | 'MAIN_FORM' 
    | 'SUCCESS_APPROVED' 
    | 'SUCCESS_REJECTED' 
    | 'SUCCESS_CANCELLED' 
    | 'REPROGRAM_FORM' 
    | 'SUCCESS_REPROGRAMMED';

interface AdopcionExitosa {
    nro_adopcion: number;
    fecha_adopcion: string;
    nro_animal: string;
    dni_adoptante: string;
    seguimientos: any[];
}

interface EntrevistaData {
    // Datos crudos del backend
    nro_entrevista?: string | number;
    fecha?: string;
    hora?: string;
    fecha_hora?: string;
    fecha_hora_rep?: string;
    estadoEntrevista: string;
    
    // Datos aplanados para mostrar
    nombreAdoptante: string;
    apellidoAdoptante: string;
    dniAdoptante: string;
    especieAnimal: string;
    raza: string;
    edad: string;
    sexo: string;
    peso: string;
    nroAnimal: string | number;
    descripcion: string;
    id_colaborador?: string | number;
    estadoAnimal: string; 
}

export default function ResultadoEntrevista() {
    const navigate = useNavigate();

    // Control de vistas
    const [currentView, setCurrentView] = useState<ViewState>('MAIN_FORM');

    // Estados - Búsqueda y Datos
    const [id_entrevista, setNroEntrevista] = useState('');
    const [entrevistaData, setEntrevistaData] = useState<EntrevistaData | null>(null);

    // Estados - Resultado
    const [resultado, setResultado] = useState('');
    const [descripcionResultado, setDescripcionResultado] = useState('');
    const [datosExito, setDatosExito] = useState<AdopcionExitosa | null>(null);

    // Estados - Reprogramación
    const [nuevaFecha, setNuevaFecha] = useState('');
    const [nuevaHora, setNuevaHora] = useState('');

    // -------------------------------------------------------------------------
    // FORMATEADORES
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

    const handleBuscarEntrevista = async () => {
        if (!id_entrevista.trim()) return;

        try {
            const response = await api.get(`/entrevista/${id_entrevista}`);
            console.log('Respuesta del backend al buscar entrevista:', response.data);
            const data = response.data.data;

            if (data.estado === 'Cancelada' || data.estado === 'Rechazada' || data.estado === 'Aprobada') {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: `La entrevista ${id_entrevista} ya fue procesada anteriormente (Estado: ${data.estado}).`,
                    confirmButtonColor: '#F39C12',
                });
                return;
            }

            const fechaCruda = data.fecha_hora_rep || data.fecha_hora;
            const [fecha, horaCompleta] = fechaCruda.split('T');
            const hora = horaCompleta.substring(0, 5);

            setEntrevistaData({
                nro_entrevista: data.id_entrevista,
                fecha: fecha,
                hora: hora,
                fecha_hora: data.fecha_hora,
                fecha_hora_rep: data.fecha_hora_rep,
                estadoEntrevista: data.estado || '-',
                // Ahora sí accedemos a las propiedades del objeto populado
                dniAdoptante: data.adoptante?.persona?.dni || '-',
                nombreAdoptante: data.adoptante?.persona?.nombre || '-',
                apellidoAdoptante: data.adoptante?.persona?.apellido || '-',
                
                // Mapeamos los datos del animal (ajustá si los nombres de tus columnas varían)
                nroAnimal: data.animal?.nro_animal || '-',
                especieAnimal: data.animal?.especie || '-',
                raza: data.animal?.raza || '-',
                edad: data.animal?.edad_estimada?.toString() || '-',
                sexo: data.animal?.sexo || '-',
                peso: data.animal?.peso?.toString() || '-',
                descripcion: data.animal?.descripcion || '-',
                
                id_colaborador: data.colaborador?.id_colaborador || '-', // O id_colaborador, según tu entidad
                estadoAnimal: data.animal?.estado || '-'
            });

        } catch (error: any) {
            setEntrevistaData(null);
            
            let mensajeBack = `Entrevista con número ${id_entrevista} no encontrada.`;
            if (error.response?.data?.messages?.[0]) mensajeBack = error.response.data.messages[0];
            else if (error.response?.data?.message) mensajeBack = error.response.data.message;

            Swal.fire({
                icon: 'warning',
                title: 'Atención',
                text: mensajeBack,
                confirmButtonColor: '#F39C12',
            });
        }
    };

    const handleRegistrarResultado = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resultado || !descripcionResultado) {
            Swal.fire({ icon: 'info', title: 'Atención', text: 'Complete el resultado y la descripción.' });
            return;
        }

        // Si la decisión es reprogramar, no disparamos al backend todavía. 
        // Llevamos al usuario al formulario de reprogramación.
        if (resultado === 'Reprogramar') {
            setCurrentView('REPROGRAM_FORM');
            return;
        }

        // Si es Aprobada, Rechazada o Cancelada, llamamos al backend
        try {
            const payload = {
                estado: resultado,
                descripcion: descripcionResultado
            };

            // Ajustá la ruta según tu Controlador
            const response = await api.post(`/entrevista/${id_entrevista}/resultado`, payload);
            console.log('Respuesta del backend al registrar Entrevista y Adopcion unificadas:', response.data);

            const data = response.data.data;
            const fechaCruda = data.entrevista.fecha_hora_rep || data.entrevista.fecha_hora;
            const [fecha, horaCompleta] = fechaCruda.split('T');
            const hora = horaCompleta.substring(0, 5);

            setEntrevistaData({
                nro_entrevista: data.entrevista.id_entrevista,
                fecha: fecha,
                hora: hora,
                fecha_hora: data.entrevista.fecha_hora,
                fecha_hora_rep: data.entrevista.fecha_hora_rep || '-',
                estadoEntrevista: data.entrevista.estado || '-',
                // Ahora sí accedemos a las propiedades del objeto populado
                dniAdoptante: data.entrevista.adoptante?.persona?.dni || '-',
                nombreAdoptante: data.entrevista.adoptante?.persona?.nombre || '-',
                apellidoAdoptante: data.entrevista.adoptante?.persona?.apellido || '-',
                
                // Mapeamos los datos del animal (ajustá si los nombres de tus columnas varían)
                nroAnimal: data.entrevista.animal?.nro_animal || '-',
                especieAnimal: data.entrevista.animal?.especie || '-',
                raza: data.entrevista.animal?.raza || '-',
                edad: data.entrevista.animal?.edad_estimada?.toString() || '-',
                sexo: data.entrevista.animal?.sexo || '-',
                peso: data.entrevista.animal?.peso?.toString() || '-',
                descripcion: data.entrevista.animal?.descripcion || '-',
                
                id_colaborador: data.entrevista.colaborador?.id_colaborador || '-', // O id_colaborador, según tu entidad
                estadoAnimal: data.entrevista.animal?.estado || '-'
            });

            // Cambiamos de vista según el resultado exitoso
            switch (resultado) {
                case 'Aprobada':
                    setDatosExito({
                        nro_adopcion: data.adopcion.nro_adopcion,
                        fecha_adopcion: data.adopcion.fecha_adopcion, 
                        nro_animal: data.adopcion.nroAnimal,
                        dni_adoptante: data.adopcion.dni,
                        seguimientos: data.adopcion.seguimientos
                    });
                    setCurrentView('SUCCESS_APPROVED');
                    break;
                case 'Rechazada':
                    setCurrentView('SUCCESS_REJECTED');
                    break;
                case 'Cancelada':
                    setCurrentView('SUCCESS_CANCELLED');
                    break;
            }

        } catch (error: any) {
            let mensajeBack = 'Ocurrió un error al procesar la entrevista.';
            if (error.response?.data?.messages?.[0]) mensajeBack = error.response.data.messages[0];
            
            Swal.fire({ icon: 'error', title: 'Error', text: mensajeBack });
        }
    };

    const handleConfirmarReprogramacion = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const payload = {
                nuevaFecha: nuevaFecha,
                nuevaHora: nuevaHora,
                descripcion: descripcionResultado // Lo que escribió el colaborador justificando el cambio
            };

            await api.put(`/entrevista/${id_entrevista}/reprogramar`, payload);
            setCurrentView('SUCCESS_REPROGRAMMED');

        } catch (error: any) {
            let mensajeBack = 'Ocurrió un error al reprogramar.';
            if (error.response?.data?.messages?.[0]) mensajeBack = error.response.data.messages[0];
            
            Swal.fire({
                icon: 'error',
                title: 'Atención',
                text: mensajeBack,
                confirmButtonColor: '#E74C3C',
            });
        }
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

    const handleDescargarPDF = () => {
            // Si no hay datos de éxito, no hacemos nada
            if (!datosExito) return; 
    
            // 1. Instanciamos el documento (tamaño A4 por defecto)
            const doc = new jsPDF();
    
            // 2. Título principal
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            // (Texto, posX, posY en milímetros)
            doc.text("Certificado de Adopción - Protectora SARA", 20, 20); 
    
            // 3. Datos de la Adopción
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);
            doc.text(`Nro. de Adopción: ${datosExito.nro_adopcion}`, 20, 35);
            doc.text(`Fecha de Adopción: ${datosExito.fecha_adopcion}`, 20, 42);
    
            // 4. Línea separadora
            doc.line(20, 48, 190, 48); 
    
            // 5. Cronograma de Seguimientos (El 1{ ... }4)
            doc.setFont("helvetica", "bold");
            doc.text("Cronograma de Seguimientos Obligatorios:", 20, 60);
    
            doc.setFont("helvetica", "normal");
            
            // Iteramos sobre el arreglo de 4 seguimientos que devolvió el backend
            // Asumo que vienen en datosExito.seguimientos
            datosExito.seguimientos.forEach((seguimiento: any, index: number) => {
                // Incrementamos la posición Y para que cada línea baje 10mm
                const posicionY = 70 + (index * 10); 
    
                const fechaLimpia = formatearFecha(seguimiento.fecha_seguimiento);
                
                doc.text(
                    `${index + 1}. Seguimiento Nro: ${seguimiento.id_seguimiento} - Fecha Programada: ${fechaLimpia}`, 
                    25, 
                    posicionY
                );
            });
    
            // 6. Firmas (al fondo de la hoja)
            doc.line(30, 140, 90, 140);
            doc.text("Firma del Adoptante", 45, 146);
    
            doc.line(120, 140, 180, 140);
            doc.text("Firma Protectora SARA", 130, 146);
    
            // 7. Descargar el archivo automáticamente
            doc.save(`Adopcion_${datosExito.nro_adopcion}_SARA.pdf`);
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
            <div style={styles.infoRow}><span style={styles.infoLabel}>Numero entrevista</span><span style={styles.infoValue}>{id_entrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha nueva</span><span style={styles.infoValue}>{formatearFecha(nuevaFecha)}</span></div>
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
            <input style={styles.dateInput} type="date" value={nuevaFecha} onChange={e => setNuevaFecha(e.target.value)} required />
            <label style={styles.labelCentered}>Hora de reprogramacion</label>
            <input style={styles.dateInput} type="time" value={nuevaHora} onChange={e => setNuevaHora(e.target.value)} required />
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
            <div style={styles.infoRow}><span style={styles.infoLabel}>Numero entrevista</span><span style={styles.infoValue}>{id_entrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado animal</span><span style={styles.infoValueSuccess}>{entrevistaData?.estadoAnimal}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado entrevista</span><span style={styles.infoValueDanger}>{entrevistaData?.estadoEntrevista}</span></div>
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
            <div style={styles.infoRow}><span style={styles.infoLabel}>Numero entrevista</span><span style={styles.infoValue}>{id_entrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado animal</span><span style={styles.infoValueSuccess}>{entrevistaData?.estadoAnimal}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado entrevista</span><span style={styles.infoValueDanger}>{entrevistaData?.estadoEntrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Motivo del rechazo</span><span style={styles.infoValueDanger}>{descripcionResultado}</span></div>
            <button style={styles.buttonBackLarge} onClick={handleReiniciarFlujo}>Evaluar otra entrevista</button>
            </div>
        </div>
        );
    }

    // VISTA: APROBADA (3-FS)
    if (currentView === 'SUCCESS_APPROVED' && entrevistaData) {
        return (
        <div style={styles.container}>
            <div style={styles.headerRow}>
                <h1 style={styles.title}>Entrevista aprobada</h1>
                <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
            </div>
            <div style={styles.successCard}>

            <div style={styles.infoRow}><span style={styles.infoLabel}>Fecha y hora</span><span style={styles.infoValue}>{entrevistaData.fecha_hora}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. Entrevista</span><span style={styles.infoValue}>{id_entrevista}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. Colaborador asig.</span><span style={styles.infoValue}>{entrevistaData.id_colaborador}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. DNI adoptante</span><span style={styles.infoValue}>{entrevistaData.dniAdoptante}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Nro. de animal</span><span style={styles.infoValue}>{entrevistaData.nroAnimal}</span></div>
            <div style={styles.infoRow}><span style={styles.infoLabel}>Estado animal</span><span style={styles.infoValueSuccess}>{entrevistaData.estadoAnimal}</span></div>
            <button 
                style={{
                    ...styles.buttonSubmit,
                    backgroundColor: '#E67E22', 
                    marginTop: '20px'
                }} 
                onClick={handleDescargarPDF}
            >
                📄 Descargar Comprobante (PDF)
            </button>

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
                value={id_entrevista} 
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
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <label style={styles.labelCentered}>Fecha y hora de la entrevista</label>
                    <input style={styles.inputReadOnly} type="text" value={entrevistaData.fecha_hora} readOnly />
                </div>

                <div style={styles.grid2Cols}>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Nombre adoptante</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.nombreAdoptante} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Apellido adoptante</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.apellidoAdoptante} readOnly /></div>
                </div>

                <div style={styles.grid2Cols}>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Especie animal</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.especieAnimal} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Raza</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.raza} readOnly /></div>
                </div>

                <div style={styles.grid3Cols}>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Edad (Años)</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.edad} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Sexo</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.sexo} readOnly /></div>
                    <div style={styles.inputGroup}><label style={styles.labelCentered}>Peso (Kg)</label><input style={styles.inputReadOnly} type="text" value={entrevistaData.peso} readOnly /></div>
                </div>

                <label style={styles.labelCentered}>Descripción del animal</label>
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

                <label style={styles.labelCentered}>Descripción / Observaciones</label>
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
    dateInput: {
        backgroundColor: '#FFFFFF', border: '1px solid #BDC3C7', borderRadius: '5px', padding: '12px', 
        marginBottom: '20px', fontSize: '14px', textAlign: 'center', 
        color: '#2C3E50', width: '95%', colorScheme: 'light', 
    },
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