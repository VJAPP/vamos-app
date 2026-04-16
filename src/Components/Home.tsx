import React from 'react';
import styles from '../styles';

export default function Home({ userName, onNavigate }: any) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Hola, {userName || 'Viajero'}</h1>
        <p style={{ color: '#64748b', marginBottom: '20px' }}>
          ¿Qué necesitas hoy?
        </p>

        <button style={styles.button} onClick={() => onNavigate('publish')}>
          ✍️ Soy Conductor (Publicar)
        </button>

        <button
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={() => onNavigate('publish_request')}
        >
          ✋ Soy Pasajero (Solicitar)
        </button>

        <button
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            backgroundColor: '#f1f5f9',
            borderColor: '#cbd5e1',
            color: '#64748b',
          }}
          onClick={() => onNavigate('browse')}
        >
          🔍 Ver Ofertas
        </button>

        <button
          style={{
            ...styles.button,
            ...styles.buttonSecondary,
            backgroundColor: '#e0f2fe',
            borderColor: '#0284c7',
            color: '#0369a1',
          }}
          onClick={() => onNavigate('connections')}
        >
          🤝 Mis Conexiones
        </button>

        <span style={styles.link} onClick={() => onNavigate('landing')}>
          Cerrar Sesión
        </span>
      </div>
    </div>
  );
}
