import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

type ViewState = 'SEARCH_FICHA' | 'REGISTER_VACCINES' | 'SUCCESS';

interface FichaData {
  nroAnimal: string;
  matricula: string;
  fechaCreacion: string;
  observaciones: string;
}

interface VacunaRow {
  id: number;
  nroVacuna: string;
  cantidad: string;
  stockActualizado?: number;
}

export default function ColocacionVacunas() {
  const navigate = useNavigate();

  // Control de vistas
  const [currentView, setCurrentView] = useState<ViewState>('SEARCH_FICHA');

  // Estados - Búsqueda de Ficha
  const [nroFicha, setNroFicha] = useState('');
  const [fichaData, setFichaData] = useState<FichaData | null>(null);

  // Estados - Registro de Vacunas (Corregido con Lazy Initialization)
  const [vacunas, setVacunas] = useState<VacunaRow[]>(() => [
    { id: Date.now(), nroVacuna: '', cantidad: '' }
  ]);

  // -------------------------------------------------------------------------
  // MÉTODOS DE ACCIÓN
  // -------------------------------------------------------------------------

  const handleBuscarFicha = () => {
    if (nroFicha === '25') {
      setFichaData({
        nroAnimal: '5',
        matricula: '11-45521084',
        fechaCreacion: '24/02/2026',
        observaciones: 'No se registran observaciones relevantes'
      });
    } else if (nroFicha.trim() !== '') {
      setFichaData(null);
      Swal.fire({
        icon: 'error',
        title: 'Ficha no encontrada',
        text: `No existe la ficha médica número ${nroFicha}`,
        confirmButtonColor: '#E74C3C',
      });
    }
  };

  const handleIrARegistro = () => {
    if (fichaData) {
      setCurrentView('REGISTER_VACCINES');
    }
  };

  const handleAddVacunaRow = () => {
    setVacunas([...vacunas, { id: Date.now(), nroVacuna: '', cantidad: '' }]);
  };

  const handleVacunaChange = (id: number, field: keyof VacunaRow, value: string) => {
    setVacunas(vacunas.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const handleRemoveVacunaRow = (id: number) => {
    if (vacunas.length > 1) {
      setVacunas(vacunas.filter(v => v.id !== id));
    }
  };

  const handleRegistrarVacunacion = (e: React.FormEvent) => {
    e.preventDefault();

    const vacunasValidas = vacunas.filter(v => v.nroVacuna.trim() !== '' && v.cantidad.trim() !== '');

    if (vacunasValidas.length === 0) {
      Swal.fire({ icon: 'info', title: 'Atención', text: 'Debe ingresar al menos una vacuna.' });
      return;
    }

    const stockProblem = vacunasValidas.find(v => v.nroVacuna === '2' && parseInt(v.cantidad) > 1);
    
    if (stockProblem) {
      Swal.fire({
        icon: 'warning',
        title: 'Atencion',
        html: `<b>Stock insuficiente</b><br/>Stock insuficiente para la vacuna '${stockProblem.nroVacuna}'.`,
        confirmButtonColor: '#F39C12',
      });
      return;
    }

    const vacunasExito = vacunasValidas.map(v => ({
      ...v,
      stockActualizado: Math.floor(Math.random() * 10) + 1 
    }));
    
    setVacunas(vacunasExito);
    setCurrentView('SUCCESS');
  };

  const handleRegistrarMasColocaciones = () => {
    setNroFicha('');
    setFichaData(null);
    setVacunas([{ id: Date.now(), nroVacuna: '', cantidad: '' }]);
    setCurrentView('SEARCH_FICHA');
  };

  const handleVolver = () => {
    if (currentView === 'REGISTER_VACCINES') {
      setCurrentView('SEARCH_FICHA');
    } else {
      navigate(-1);
    }
  };

  // -------------------------------------------------------------------------
  // VISTA 3: ÉXITO
  // -------------------------------------------------------------------------
  if (currentView === 'SUCCESS') {
    const fechaColocacion = '15/02/2026'; 

    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Registro exitoso</h1>
          <button style={styles.volverHeaderBtn} onClick={() => navigate(-1)}>Volver</button>
        </div>

        <div style={styles.successCard}>
          <div style={styles.gridRowCentered}>
            <div style={styles.columnGroup}>
              <label style={styles.labelCentered}>Fecha de colocacion</label>
              <div style={styles.readOnlyBox}>{fechaColocacion}</div>
            </div>
          </div>
          
          <div style={styles.gridRowCentered}>
            <div style={styles.columnGroup}>
              <label style={styles.labelCentered}>Nro. ficha</label>
              <div style={styles.readOnlyBox}>{nroFicha}</div>
            </div>
          </div>

          <div style={styles.tableHeader}>
            <span style={styles.columnTitle}>Nro. de Vacuna</span>
            <span style={styles.columnTitle}>Cantidad de vacunas</span>
            <span style={styles.columnTitle}>Stock actualizado</span>
          </div>

          {/* Corregido: Se eliminó el parámetro index */}
          {vacunas.map(v => (
            <div key={v.id} style={styles.tableRow}>
              <div style={styles.readOnlyBoxSmall}>{v.nroVacuna}</div>
              <div style={styles.readOnlyBoxSmall}>{v.cantidad}</div>
              <div style={styles.readOnlyBoxSmall}>{v.stockActualizado}</div>
            </div>
          ))}

          <button style={styles.buttonSubmit} onClick={handleRegistrarMasColocaciones}>
            Registrar mas colocaciones
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 2: REGISTRAR VACUNAS
  // -------------------------------------------------------------------------
  if (currentView === 'REGISTER_VACCINES') {
    return (
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.title}>Registro de vacunas</h1>
          <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
        </div>

        <form style={styles.formContainerWide} onSubmit={handleRegistrarVacunacion}>
          <div style={styles.tableHeader}>
            <span style={styles.columnTitle}>Nro. de Vacuna</span>
            <span style={styles.columnTitle}>Cantidad de vacunas</span>
            <span style={{ width: '40px' }}></span> 
          </div>

          {/* Corregido: Se eliminó el parámetro index */}
          {vacunas.map(v => (
            <div key={v.id} style={styles.tableRowInputs}>
              <input 
                style={styles.inputSmall} 
                type="number" 
                value={v.nroVacuna} 
                onChange={e => handleVacunaChange(v.id, 'nroVacuna', e.target.value)} 
                required 
              />
              <input 
                style={styles.inputSmall} 
                type="number" 
                value={v.cantidad} 
                onChange={e => handleVacunaChange(v.id, 'cantidad', e.target.value)} 
                required 
              />
              {vacunas.length > 1 ? (
                <button 
                  type="button" 
                  style={styles.btnRemoveRow} 
                  onClick={() => handleRemoveVacunaRow(v.id)}
                  title="Eliminar fila"
                >
                  ✖
                </button>
              ) : (
                <div style={{ width: '40px' }}></div>
              )}
            </div>
          ))}

          <button type="button" style={styles.btnAddRow} onClick={handleAddVacunaRow}>
            + Agregar otra vacuna
          </button>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
            <button type="submit" style={styles.buttonSubmit}>
              Registrar Vacunacion
            </button>
          </div>
        </form>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VISTA 1: BUSCAR FICHAS MÉDICAS
  // -------------------------------------------------------------------------
  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Buscar fichas medicas</h1>
        <button style={styles.volverHeaderBtn} onClick={handleVolver}>Volver</button>
      </div>

      <div style={styles.formContainer}>
        <label style={styles.labelCentered}>Ingrese el numero de la ficha medica</label>
        
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
              backgroundColor: '#FFFFFF'
            }}
            type="text" 
            placeholder="Ej: 25" 
            value={nroFicha} 
            onChange={e => setNroFicha(e.target.value.replace(/\D/g, ''))} 
          />
          <button 
            type="button" 
            style={{
              backgroundColor: '#FFFFFF',
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
            onClick={handleBuscarFicha}
          >
            🔍
          </button>
        </div>

        {fichaData && (
          <div style={styles.dataContainer}>
            <label style={styles.labelCentered}>Nro. Animal</label>
            <input style={styles.inputReadOnly} type="text" value={fichaData.nroAnimal} readOnly />

            <label style={styles.labelCentered}>Numero de matricula</label>
            <input style={styles.inputReadOnly} type="text" value={fichaData.matricula} readOnly />

            <label style={styles.labelCentered}>Fecha de Creacion</label>
            <input style={styles.inputReadOnly} type="text" value={fichaData.fechaCreacion} readOnly />

            <label style={styles.labelCentered}>Observaciones</label>
            <textarea 
              style={{...styles.inputReadOnly, resize: 'none', height: '60px'}} 
              value={fichaData.observaciones} 
              readOnly 
            />

            <button type="button" style={styles.buttonSubmit} onClick={handleIrARegistro}>
              Registrar Vacunas
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
    maxWidth: '700px',
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
  formContainerWide: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '600px',
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
  inputReadOnly: {
    backgroundColor: '#F2F3F4',
    border: 'none',
    borderRadius: '5px',
    padding: '12px',
    marginBottom: '20px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#7F8C8D',
    outline: 'none',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
    padding: '0 10px',
  },
  columnTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: 'bold',
  },
  tableRowInputs: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
    gap: '15px',
  },
  inputSmall: {
    flex: 1,
    backgroundColor: '#ECF0F1',
    border: '1px solid #BDC3C7',
    borderRadius: '5px',
    padding: '12px',
    fontSize: '14px',
    textAlign: 'center',
    color: '#2C3E50',
    outline: 'none',
  },
  btnRemoveRow: {
    backgroundColor: '#E74C3C',
    color: '#FFF',
    border: 'none',
    borderRadius: '5px',
    width: '35px',
    height: '35px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAddRow: {
    backgroundColor: 'transparent',
    color: '#3498DB',
    border: '2px dashed #3498DB',
    borderRadius: '5px',
    padding: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    marginTop: '10px',
  },
  successCard: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '700px',
    backgroundColor: '#FFFFFF',
    padding: '20px',
  },
  gridRowCentered: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  columnGroup: {
    display: 'flex',
    flexDirection: 'column',
    width: '200px',
  },
  readOnlyBox: {
    backgroundColor: '#F2F3F4',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: '14px',
    minHeight: '20px',
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px',
    gap: '20px',
  },
  readOnlyBoxSmall: {
    flex: 1,
    backgroundColor: '#F2F3F4',
    padding: '10px',
    borderRadius: '5px',
    textAlign: 'center',
    color: '#7F8C8D',
    fontSize: '14px',
  },
  buttonSubmit: {
    backgroundColor: '#008000', 
    color: '#FFFFFF',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '40px',
    alignSelf: 'center',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
};