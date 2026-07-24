import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    setErrorMensaje(''); // Resetea el mensaje de error antes de intentar iniciar sesión
    
    try {
      // 1. Petición POST al backend
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email: email,
        password: password
      });

      // 2. Si es exitoso, extraemos los datos
      if (response.data.success) {
        const { token, roles } = response.data.data;

        // 3. Guardamos en el navegador
        // Nota: localStorage solo guarda strings, por eso usamos JSON.stringify para los roles
        localStorage.setItem('token', token);
        localStorage.setItem('roles', JSON.stringify(roles));

        // 4. Lógica de enrutamiento (RBAC en el frontend)
        if (roles.includes('Colaborador') || roles.includes('Veterinario')) {
          navigate('/menu'); // Los mandamos al dashboard interno
        } else {
          navigate('/home'); // Los adoptantes/usuarios van al catálogo público
        }
      }
    } catch (error: any) {
      console.error('Error durante el login:', error);
      // Capturamos el 401 que configuramos en el backend
      if (error.response && error.response.data && error.response.data.messages) {
        setErrorMensaje(error.response.data.messages[0]);
      } else {
        setErrorMensaje('Error de conexión con el servidor.');
      }
    }
  };

  const handleRegister = () => {
    navigate('/registro'); 
  };

  return (
    <div style={styles.container}>
      {/* Encabezado */}
      <div style={styles.headerContainer}>
        <h1 style={styles.title}>Protectora SARA</h1>
        <p style={styles.subtitle}>Al servicio de los animales</p>
      </div>

      {/* Formulario */}
      <form style={styles.formContainer} onSubmit={handleLogin}>
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
          placeholder="Ej: ************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.button}>
          Ingresar
        </button>
      </form>

      {/* Pie de página / Registro */}
      <div style={styles.footerContainer}>
        <p style={styles.footerText}>¿No tiene una cuenta? ¡Registrate gratis!</p>
        <button type="button" onClick={handleRegister} style={styles.registerLink}>
          Crear una cuenta
        </button>
      </div>
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
    padding: '0 20px',
    backgroundColor: '#F8F9FA',
    fontFamily: 'Arial, sans-serif',
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '40px',
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
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '20px',
    border: '1px solid #BDC3C7',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#eeeeee',
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
    marginTop: '10px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  footerContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  footerText: {
    fontSize: '14px',
    color: '#7F8C8D',
    margin: '0 0 10px 0',
  },
  registerLink: {
    background: 'none',
    border: 'none',
    color: '#2980B9',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};