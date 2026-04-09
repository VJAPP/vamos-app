import React from 'react';
import { styles } from '../styles';

export default function Landing({ onNavigate }: any) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>VAMOS</h1>
        <p style={{ color: '#64748b', marginBottom: '2rem' }}>
          Tu viaje, tus reglas.
        </p>

        <button style={styles.button} onClick={() => onNavigate('login')}>
          Iniciar Sesión
        </button>

        <button
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={() => onNavigate('register')}
        >
          Crear Cuenta
        </button>
      </div>
    </div>
  );
}
