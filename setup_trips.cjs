const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./vamos.db', (err) => {
  if (err) {
    console.error('Error abriendo la base de datos', err.message);
    throw err; // Detenemos todo si falla la conexión inicial
  }

  console.log('🧹 Limpiando y recreando tabla de viajes...');

  // Paso 1: Borrar la tabla vieja
  db.run(`DROP TABLE IF EXISTS trips;`, (err) => {
    if (err) {
      console.error('Error borrando tabla:', err.message);
      throw err; // Si no se puede borrar, nos detenemos
    } else {
      console.log('✅ Tabla vieja eliminada.');
    }
  });

  // Paso 2: Crear la tabla nueva
  db.run(
    `
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      driver_name TEXT,
      origin TEXT,
      destination TEXT,
      date TEXT,
      price TEXT,
      description TEXT,
      type TEXT,
      contact_method TEXT,
      contact_info TEXT
    )
  `,
    (err) => {
      if (err) {
        console.error('Error creando tabla:', err.message);
        throw err;
      } else {
        console.log('✅ Tabla viajes creada exitosamente con 9 columnas.');
        console.log(
          '🚀 Puedes cerrar esta terminal e iniciar el servidor node server.cjs ahora.'
        );
      }
    }
  );
});
