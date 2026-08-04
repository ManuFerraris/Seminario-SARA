import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../axiosConfig';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de contraseñas con Swal en lugar de alert()
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Atención',
        text: 'Las contraseñas no coinciden. Por favor, verifíquelas.',
        confirmButtonColor: '#F39C12',
      });
      return;
    }

    try {
      // Objeto con los datos listos para ser enviados a tu base de datos
      const payload = { 
        nombre, 
        apellido, 
        dni, 
        telefono, 
        email, 
        domicilio: direccion,
        contrasenia: password 
      };
      
      console.log('Intentando registrar usuario:', payload);

      await api.post('/persona/crear-signup', payload);

      // Si todo sale bien, mostramos mensaje de éxito y redirigimos al Login
      Swal.fire({
        icon: 'success',
        title: '¡Registro exitoso!',
        text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
        confirmButtonColor: '#2ECC71',
      }).then(() => {
        navigate('/login'); // Ajustá la ruta si tu pantalla de login se llama distinto
      });

    } catch (error: any) {
      // Capturamos errores del backend (ej: "El DNI ya está registrado", "El email ya existe")
      let mensajeBack = 'Ocurrió un error al intentar registrarte.';
      if (error.response?.data?.messages?.[0]) mensajeBack = error.response.data.messages[0];
      else if (error.response?.data?.message) mensajeBack = error.response.data.message;
      else if (error.response?.data?.error && typeof error.response.data.error === 'string') mensajeBack = error.response.data.error;

      Swal.fire({
        icon: 'error',
        title: 'Atención',
        text: mensajeBack,
        confirmButtonColor: '#E74C3C',
      });
    }
  };

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Protectora SARA</h1>
        <p style={styles.subtitle}>Al servicio de los animales</p>
      </div>

      {/* Formulario */}
      <form style={styles.formContainer} onSubmit={handleRegister}>
        
        <label style={styles.label}>Ingrese su nombre</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Ej: Juan"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label style={styles.label}>Ingrese su apellido</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Ej: Perez"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
        />

        <label style={styles.label}>Ingrese su DNI (sin puntos)</label>
        <input
          style={styles.input}
          type="text"
          inputMode="numeric"
          placeholder="Ej: 11222333"
          value={dni}
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))} 
          required
        />

        <label style={styles.label}>Ingrese su telefono (solo numeros)</label>
        <input
          style={styles.input}
          type="tel"
          placeholder="Ej: 0341300600"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))} 
          required
        />

        <label style={styles.label}>Ingrese su dirección</label>
        <input
          style={styles.input}
          type="text"
          placeholder="Ej: Calle Falsa 123"
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          required
        />

        <label style={styles.label}>Ingrese su email</label>
        <input
          style={styles.input}
          type="email"
          placeholder="Ej: ejemplousuario@tipo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label}>Ingrese su contraseña</label>
        <input
          style={styles.input}
          type="password"
          placeholder="*****************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6} // Buena práctica para evitar contraseñas muy cortas
        />

        <label style={styles.label}>Repita su contraseña</label>
        <input
          style={styles.input}
          type="password"
          placeholder="*****************"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />

        <button type="submit" style={styles.button}>
          Registrarme
        </button>
      </form>
    </div>
  );
}

// Estilos re-adaptados del Login
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px 20px', // Un padding mayor para permitir scroll en pantallas pequeñas
    backgroundColor: '#F8F9FA',
    fontFamily: 'Arial, sans-serif',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2C3E50',
    margin: '0 0 5px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#7F8C8D',
    fontStyle: 'italic',
    margin: 0,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '400px',
  },
  label: {
    fontSize: '14px',
    color: '#34495E',
    marginBottom: '6px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    border: '1px solid #BDC3C7',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#cacccf',
    outline: 'none',
  },
  button: {
    backgroundColor: '#27AE60',
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