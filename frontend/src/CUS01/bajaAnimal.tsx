import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function BajaAnimal() {
  const [numeroAnimal, setNumeroAnimal] = useState('');
  const [fechaDefuncion, setFechaDefuncion] = useState('');
  const navigate = useNavigate();

  const handleVolver = () => {
    // Redirige a la pantalla anterior (ej: al menú principal)
    navigate(-1);
  };

  const handleConfirmarBaja = (e: React.FormEvent) => {
    e.preventDefault();

    // -------------------------------------------------------------------------
    // SIMULACIÓN DE LÓGICA DE NEGOCIO PARA DISPARAR LAS DISTINTAS ALERTAS
    // -------------------------------------------------------------------------

    // 1. Simulación: Caso de Error - Animal no encontrado
    if (numeroAnimal === '999') {
      Swal.fire({
        icon: 'error',
        title: 'Error de busqueda',
        text: 'El numero del animal ingresado no existe',
        confirmButtonColor: '#E74C3C',
      });
      return;
    }

    // 2. Simulación: Caso Informativo - Animal ya dado de baja
    if (numeroAnimal === '236') {
      Swal.fire({
        icon: 'info',
        title: 'Animal ya dado de baja',
        text: 'El animal ya se encuentra registrado como fallecido',
        confirmButtonColor: '#3498DB',
      });
      return;
    }

    // 3. Simulación: Caso de Éxito - Baja exitosa
    // Aquí construiríamos el HTML personalizado para mostrar los datos del bosquejo
    Swal.fire({
      icon: 'success',
      title: 'Baja exitosa',
      html: `
        <div style="text-align: left; margin-top: 20px;">
          <p><strong>Numero de animal dado de baja:</strong> ${numeroAnimal}</p>
          <p><strong>Fecha de defuncion:</strong> ${fechaDefuncion}</p>
          <p><strong>Estado final:</strong> Fallecido</p>
        </div>
      `,
      confirmButtonText: 'Regresar a la pantalla anterior',
      confirmButtonColor: '#27AE60',
    }).then((result) => {
      if (result.isConfirmed) {
        // Redirige al usuario al menú principal o a la pantalla anterior al cerrar el modal
        navigate(-1);
      }
    });
  };

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Baja de animal en el sistema</h1>
      </div>

      {/* Formulario */}
      <form style={styles.formContainer} onSubmit={handleConfirmarBaja}>
        
        <label style={styles.label}>Ingrese el numero del animal</label>
        <input
          style={styles.input}
          type="text"
          inputMode="numeric"
          placeholder="Ej: 236"
          value={numeroAnimal}
          onChange={(e) => setNumeroAnimal(e.target.value.replace(/\D/g, ''))} // Solo números
          required
        />

        <label style={styles.label}>Seleccione la fecha de defuncion</label>
        <input
          style={styles.input}
          type="date"
          placeholder="05/03/2026"
          value={fechaDefuncion}
          onChange={(e) => setFechaDefuncion(e.target.value)}
          required
        />

        <button type="submit" style={styles.buttonSubmit}>
          Confirmar Baja
        </button>
        
        {/* Botón de Volver */}
        <button type="button" style={styles.buttonBack} onClick={handleVolver}>
          Volver
        </button>

      </form>
    </div>
  );
}

// Estilos
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px 20px',
    backgroundColor: '#F8F9FA',
    fontFamily: 'Arial, sans-serif',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#2C3E50',
    margin: '0',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#FFFFFF',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  label: {
    fontSize: '14px',
    color: '#34495E',
    marginBottom: '6px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '20px',
    border: '1px solid #BDC3C7',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#2C3E50',
    outline: 'none',
  },
  buttonSubmit: {
    backgroundColor: '#27AE60',
    color: '#FFFFFF',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  buttonBack: {
    backgroundColor: '#95A5A6',
    color: '#FFFFFF',
    padding: '15px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }
};