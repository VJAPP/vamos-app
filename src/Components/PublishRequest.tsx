import React from 'react';
import { styles } from '../styles';

export default function PublishRequest({
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
        <h2 style={styles.title}>Solicitar Viaje</h2>
        <p
          style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '15px' }}
        >
          Publica tu necesidad.
        </p>

        <form onSubmit={onSubmit}>
          <input
            style={styles.input}
            name="origin"
            placeholder="Salgo desde"
            required
            value={tripForm.origin}
            onChange={onInputChange}
          />
          <input
            style={styles.input}
            name="destination"
            placeholder="Llego a"
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
            placeholder="Colaboracion Ofrecida (Opcional)"
            value={tripForm.price}
            onChange={onInputChange}
          />
          <input
            style={styles.input}
            name="description"
            placeholder="Comentarios"
            value={tripForm.description}
            onChange={onInputChange}
          />

          <button type="submit" style={styles.button}>
            Publicar Solicitud
          </button>
        </form>
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
