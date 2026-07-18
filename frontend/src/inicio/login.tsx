import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Evita que la página se recargue al enviar el formulario
    
    // Acá se conectará el formulario con la API del backend de Protectora SARA 
    // para validar los usuarios contra la base de datos MySQL alojada en Aiven usando Mikro-ORM.
    console.log('Intentando ingresar con:', email);
    
    // Una vez validado, podés redirigir al usuario al Home:
    // navigate('/');
  };

  const handleRegister = () => {
    // Redirige a pantalla de registro
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
    color: '#2C3E50',
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