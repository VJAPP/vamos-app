import React from 'react';
import { styles } from '../styles';

export default function TripList({
  trips,
  currentUser, // <--- NUEVO: Recibimos el nombre del usuario actual
  onDelete, // <--- NUEVO: Recibimos la función para borrar
  onRequest,
  onOfferDriver,
  onBack,
}: any) {
  return (
    <div style={styles.container}>
      <div style={styles.tripListContainer}>
        <h2 style={{ ...styles.title, textAlign: 'center' }}>
          Ofertas y Solicitudes
        </h2>

        {trips.length === 0 && (
          <p style={{ textAlign: 'center', color: '#64748b' }}>
            No hay actividad por el momento.
          </p>
        )}

        {trips.map((trip: any) => {
          const isRequest = trip.type === 'request';

          // --- NUEVO: ¿Este viaje es mío? ---
          const isMyTrip = trip.driver_name === currentUser;

          const cardStyle = {
            ...styles.tripCard,
            borderLeftColor: isRequest ? '#f97316' : '#06b6d4',
          };

          return (
            <div key={trip.id} style={cardStyle}>
              <div style={styles.tripHeader}>
                <div style={styles.tripRoute}>
                  {isRequest ? '🙋 Solicita:' : '🚗 Ofrece:'} {trip.origin} ➝{' '}
                  {trip.destination}
                </div>

                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  {/* --- CAMBIO REALIZADO AQUÍ --- */}
                  {trip.price && (
                    <div style={styles.tripPrice}>
                      {isRequest
                        ? 'Colaboración ofrecida:'
                        : 'Colaboración esperada:'}{' '}
                      {trip.price}
                    </div>
                  )}

                  {/* --- NUEVO: BOTÓN ELIMINAR (Solo si es mi viaje) --- */}
                  {isMyTrip && (
                    <button
                      onClick={() => onDelete(trip.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444', // Rojo
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        padding: '0',
                        lineHeight: '1',
                      }}
                      title="Eliminar viaje"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              <div style={styles.tripDetails}>
                👤 {trip.driver_name} | 📅 {trip.date}
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: '#64748b',
                    marginTop: '8px',
                    borderTop: '1px dashed #cbd5e1',
                    paddingTop: '5px',
                  }}
                >
                  📱 Contacto: {trip.contact_method || 'No definido'}
                  {trip.contact_info && ` (${trip.contact_info})`}
                </div>
              </div>

              {trip.description && (
                <div style={{ marginTop: '5px', color: '#475569' }}>
                  💬 {trip.description}
                </div>
              )}

              {/* BOTONES DE ACCIÓN */}
              {!isRequest && (
                <button
                  style={styles.requestButton}
                  onClick={() => onRequest(trip.id)}
                >
                  Unirme a este viaje
                </button>
              )}

              {isRequest && (
                <button
                  style={{
                    ...styles.requestButton,
                    backgroundColor: '#f97316',
                  }}
                  onClick={
                    () =>
                      onOfferDriver(
                        trip.id,
                        trip.driver_name,
                        trip.destination,
                        trip
                      ) // <--- AGREGA 'trip' AL FINAL
                  }
                >
                  Ofrecerme como conductor
                </button>
              )}
            </div>
          );
        })}

        <button
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={onBack}
        >
          {' '}
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
