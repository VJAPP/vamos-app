import React from 'react';

// --- ESTILOS DE AUTH (Para Login y Registro) ---
const authStyles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#ecfeff',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(6, 182, 212, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  title: {
    color: '#06b6d4',
    marginBottom: '1.5rem',
    fontSize: '2rem',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '8px 0',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    boxSizing: 'border-box',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#06b6d4',
    color: 'white',
    border: 'none',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    marginTop: '10px',
  },
  link: {
    color: '#0891b2',
    textDecoration: 'underline',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '15px',
    display: 'block',
  },
  // Agrega esto justo antes del cierre };
  error: {
    color: '#ef4444',
    fontSize: '0.9rem',
    marginTop: '10px',
    backgroundColor: '#fee2e2',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #fecaca',
  },
  success: {
    color: '#22c55e',
    fontSize: '0.9rem',
    marginTop: '10px',
    backgroundColor: '#dcfce7',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #bbf7d0',
  },
};

// --- COMPONENTE AUTH ---
export default function Auth({
  mode, // 'login' o 'register'
  name,
  email,
  password,
  setName,
  setEmail,
  setPassword,
  onLogin,
  onRegister,
  onSwitchMode,
  message,
  isError,
}: any) {
  // Usamos 'any' para simplificar los tipos por ahora

  return (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        {/* TÍTULO DINÁMICO SEGÚN EL MODO */}
        <h2 style={authStyles.title}>
          {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>

        {/* FORMULARIO */}
        <form onSubmit={mode === 'login' ? onLogin : onRegister}>
          {/* El nombre solo pide si es registro */}
          {mode === 'register' && (
            <input
              style={authStyles.input}
              placeholder="Nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            style={authStyles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            style={authStyles.input}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" style={authStyles.button}>
            {mode === 'login' ? 'Entrar' : 'Registrarse'}
          </button>
        </form>
        {/* VISUALIZADOR DE MENSAJES */}
        {message && (
          <div style={isError ? authStyles.error : authStyles.success}>
            {message}
          </div>
        )}
        {/* LINK PARA CAMBIAR DE MODO */}
        <span style={authStyles.link} onClick={onSwitchMode}>
          {mode === 'login'
            ? '¿No tienes cuenta? Regístrate aquí'
            : '¿Ya tienes cuenta? Ingresa aquí'}
        </span>
      </div>
    </div>
  );
}
