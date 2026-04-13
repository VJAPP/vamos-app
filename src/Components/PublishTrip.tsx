import React from 'react';
import styles from '../styles';

export default function PublishTrip({
  tripForm,
  onInputChange,
  onSubmit,
  onBack,
  message, // <--- AGREGAR ESTO
  isError, // <--- AGREGAR ESTO
}: any) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Publicar Viaje</h2>

        <form onSubmit={onSubmit}>
          <input
            style={styles.input}
            name="origin"
            placeholder="Origen"
            required
            value={tripForm.origin}
            onChange={onInputChange}
          />
          <input
            style={styles.input}
            name="destination"
            placeholder="Destino"
            required
            value={tripForm.destination}
            onChange={onInputChange}
          />
          <input
            style={styles.input}
            name="date"
            placeholder="Fecha"
            required
            value={tripForm.date}
            onChange={onInputChange}
          />

          {/* --- NUEVOS CAMPOS --- */}
          <select
            style={styles.input}
            name="contact_method"
            value={tripForm.contact_method}
            onChange={onInputChange}
          >
            <option value="whatsapp">WhatsApp</option>
            <option value="line">LINE</option>
            <option value="telegram">Telegram</option>
            <option value="phone">Llamar (Teléfono)</option>
            <option value="email">Email</option>
          </select>
          <input
            style={styles.input}
            name="contact_info"
            placeholder="Tu número, ID o correo"
            value={tripForm.contact_info}
            onChange={onInputChange}
          />

          <input
            style={styles.input}
            name="price"
            placeholder="Colaboracion Esperada"
            required
            value={tripForm.price}
            onChange={onInputChange}
          />
          <input
            style={styles.input}
            name="description"
            placeholder="Detalles"
            value={tripForm.description}
            onChange={onInputChange}
          />

          <button type="submit" style={styles.button}>
            Publicar
          </button>
        </form>

        {/* --- VISUALIZADOR DE MENSAJES --- */}
        {message && (
          <div style={isError ? styles.error : styles.success}>{message}</div>
        )}

        <span style={styles.link} onClick={onBack}>
          Volver
        </span>
      </div>
    </div>
  );
}
