import { useState } from 'react';
//import { useNavigate } from 'react-router-dom';

export default function Registro() {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  //const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Pequeña validación para evitar que el usuario se equivoque en la contraseña
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden. Por favor, verifíquelas.');
      return;
    }

    // Objeto con los datos listos para ser enviados a tu base de datos
    const newUser = { nombre, apellido, dni, telefono, email, password };
    console.log('Intentando registrar usuario:', newUser);

    // Al finalizar el registro correctamente, podrías redirigir al Login o al Inicio
    // navigate('/login');
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
          // Esta línea bloquea cualquier carácter que no sea un número (0-9)
          onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))} 
          required
        />

        <label style={styles.label}>Ingrese su telefono (solo numeros)</label>
        <input
          style={styles.input}
          type="tel"
          placeholder="Ej: 0341300600"
          value={telefono}
          // Esta línea también bloquea cualquier carácter que no sea un número
          onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))} 
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
        />

        <label style={styles.label}>Repita su contraseña</label>
        <input
          style={styles.input}
          type="password"
          placeholder="*****************"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
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
    marginTop: '15px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }
};