import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig';

export default function BajaAnimal() {
  const [numeroAnimal, setNumeroAnimal] = useState('');
  const [fechaDefuncion, setFechaDefuncion] = useState('');
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate(-1);
  };

  const handleConfirmarBaja = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // 1. Armamos el payload (la fecha del input type="date" viene en formato YYYY-MM-DD)
      const payload = {
        fecha_defuncion: fechaDefuncion
      };

      // 2. Disparamos la petición al backend
      await api.put(`/animal/${numeroAnimal}/cambiar-estado-fallecido`, payload);

      // Formateamos la fecha a DD/MM/YYYY solo para que se vea linda en el HTML del alert
      const [anio, mes, dia] = fechaDefuncion.split('-');
      const fechaFormateada = `${dia}/${mes}/${anio}`;

      // 3. Caso de Éxito - Baja exitosa
      Swal.fire({
        icon: 'success',
        title: 'Baja exitosa',
        html: `
          <div style="text-align: left; margin-top: 20px;">
            <p><strong>Número de animal dado de baja:</strong> ${numeroAnimal}</p>
            <p><strong>Fecha de defunción:</strong> ${fechaFormateada}</p>
            <p><strong>Estado final:</strong> Fallecido</p>
          </div>
        `,
        confirmButtonText: 'Regresar a la pantalla anterior',
        confirmButtonColor: '#27AE60',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate(-1);
        }
      });

    } catch (error: any) {
      // 4. Manejo de Errores (404, 400, etc.)
      const status = error.response?.status;

      if (status === 404) {
        // Animal no encontrado
        Swal.fire({
          icon: 'error',
          title: 'Error de búsqueda',
          text: "El numero ingresado del animal no existe",
          confirmButtonColor: '#E74C3C',
        });
      } else if (status === 400 || status === 409) {
        // Animal ya fallecido o error de reglas de negocio
        Swal.fire({
          icon: 'info',
          title: 'Atención',
          text: "El animal ya se encuentra registrado como fallecido",
          confirmButtonColor: '#3498DB',
        });
      } else {
        // Error genérico del servidor
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema de conexión con el servidor.',
          confirmButtonColor: '#E74C3C',
        });
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Baja de animal en el sistema</h1>
      </div>

      <form style={styles.formContainer} onSubmit={handleConfirmarBaja}>
        <label style={styles.label}>Ingrese el número del animal</label>
        <input
          style={styles.input}
          type="text"
          inputMode="numeric"
          placeholder="Ej: 236"
          value={numeroAnimal}
          onChange={(e) => setNumeroAnimal(e.target.value.replace(/\D/g, ''))}
          required
        />

        <label style={styles.label}>Seleccione la fecha de defunción</label>
        <input
          style={styles.input}
          type="date"
          value={fechaDefuncion}
          onChange={(e) => setFechaDefuncion(e.target.value)}
          required
        />

        <button type="submit" style={styles.buttonSubmit}>
          Confirmar Baja
        </button>
        
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
    color: '#e8eaec',
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