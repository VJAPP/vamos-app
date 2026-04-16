import React from 'react';
import styles from '../styles'; // Importamos estilos generales

export default function Connections({
  connections,
  currentUserEmail, // <--- NUEVO
  onDelete, // <--- NUEVO
  onOpenChat,
  onBack,
}: any) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Mis Conexiones</h2>
        <p
          style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '20px' }}
        >
          Tus contactos recientes.
        </p>

        <div style={{ width: '100%', textAlign: 'left' }}>
          {connections.length === 0 && (
            <p style={{ textAlign: 'center', color: '#cbd5e1' }}>
              Aún no tienes conexiones.
            </p>
          )}

          {connections.map((conn: any) => {
            const isTripRequest = conn.tripType === 'request';

            const cardStyle = {
              ...styles.tripCard,
              borderLeftColor: isTripRequest ? '#f97316' : '#06b6d4',
            };

            // --- LÓGICA DEL TOBOGÁN ---
            let chatLink = '#';
            const method = conn.contact_method || 'phone';
            const info = conn.contact_info || '';

            if (method === 'whatsapp') {
              chatLink = `https://wa.me/${info}`;
            } else if (method === 'line') {
              chatLink = `https://line.me/ti/p/~${info}`;
            } else if (method === 'telegram') {
              chatLink = `https://t.me/${info}`;
            } else if (method === 'email') {
              chatLink = `mailto:${info}`;
            } else {
              chatLink = `tel:${info}`;
            }

            return (
              <div key={conn.id} style={cardStyle}>
                <div style={styles.tripHeader}>
                  <div style={styles.tripRoute}>
                    {isTripRequest ? '🙋 Solicitaste:' : '🚗 Ofertaste:'}{' '}
                    {conn.details}
                  </div>
                </div>
                <div style={styles.tripDetails}>
                  Contacto: {conn.contact} | 📅 {conn.date}
                </div>

                {/* --- CAMBIO AQUÍ: Contenedor para los dos botones --- */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                  <button
                    style={{
                      backgroundColor: '#0284c7',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(chatLink, '_blank')}
                  >
                    💬 Chat ({method})
                  </button>

                  {/* BOTÓN ELIMINAR (Solo si es mi conexión) */}
                  {(conn.passenger_email === currentUserEmail ||
                    conn.driver_email === currentUserEmail) && (
                    <button
                      onClick={() => onDelete(conn.id)}
                      style={{
                        background: 'none',
                        border: '1px solid #ef4444',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '0.8rem',
                      }}
                      title="Eliminar conexión"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {/* ------------------------------------------- */}
              </div>
            );
          })}
        </div>

        <button
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={onBack}
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
