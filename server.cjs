const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Inicializamos la aplicación
const app = express();
const PORT = 3000;

// Configuración básica de seguridad y formatos
app.use(cors()); // Permite que otras páginas (nuestro Frontend) consulten datos
app.use(express.json()); // Permite leer datos en formato JSON

// Obtenemos la ruta absoluta del proyecto
const dbPath = path.join(process.cwd(), 'vamos.db');

// Nos conectamos a ESA ruta exacta
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
    throw err;
  }
  console.log('✅ Conectado a la base de datos en:', dbPath);
});
// --- CREACIÓN DE TABLA DE USUARIOS ---
db.run(
  `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE,
  password TEXT
)`,
  (err) => {
    if (err) {
      console.error('Error creando tabla de usuarios:', err.message);
    } else {
      console.log('✅ Tabla de usuarios lista.');
    }
  }
);
// --- CREACIÓN DE TABLA DE VIAJES ---
db.run(
  `CREATE TABLE IF NOT EXISTS trips (
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
  )`,
  (err) => {
    if (err) {
      console.error('Error creando tabla de viajes:', err.message);
    } else {
      console.log('✅ Tabla de viajes lista.');
    }
  }
);
// --- CREACIÓN DE TABLA DE SOLICITUDES ---
db.run(
  `CREATE TABLE IF NOT EXISTS requests (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          trip_id INTEGER,
          passenger_name TEXT,
          driver_name TEXT,
          destination TEXT,
          passenger_email TEXT,
          driver_email TEXT,
          status TEXT DEFAULT 'pending',
          contact_method TEXT,
          contact_info TEXT
        )`,
  (err) => {
    if (err) {
      console.error('Error creando tabla requests:', err.message);
    } else {
      console.log('✅ Tabla de solicitudes lista.');
      app.listen(PORT, () => {
        console.log(`🚀 Servidor VAMOS corriendo en http://localhost:${PORT}`);
      });
    }
  }
);

// RUTA DE PRUEBA (Health Check)
// Esta ruta servirá para verificar que el servidor está prendido
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    project: 'VAMOS',
    message: 'Backend funcionando correctamente',
  });
});
// --- RUTAS DE USUARIOS ---

// 1. REGISTRO
app.post('/api/users/register', (req, res) => {
  const { name, email, password } = req.body;

  // Validación simple
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
  const params = [name, email, password]; // Nota: En producción la contraseña debe ir encriptada

  db.run(sql, params, function (err) {
    if (err) {
      // Si el email ya existe (restricción UNIQUE)
      if (err.message.includes('UNIQUE constraint failed')) {
        return res.status(400).json({ error: 'El email ya está registrado' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: 'Usuario registrado con éxito',
      userId: this.lastID,
    });
  });
});

// 2. LOGIN
app.post('/api/users/login', (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM users WHERE email = ? AND password = ?`;

  db.get(sql, [email, password], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      // Usuario encontrado
      res.json({
        message: 'Login exitoso',
        user: { id: row.id, name: row.name, email: row.email },
      });
    } else {
      // Usuario o contraseña incorrectos
      res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }
  });
});
// --- RUTAS DE VIAJES ---

// 1. OBTENER LISTA DE VIAJES (Para que los pasajeros vean qué hay)
app.get('/api/trips', (req, res) => {
  const sql = `SELECT * FROM trips ORDER BY id DESC`; // Del más nuevo al más viejo
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Lista de viajes obtenida',
      trips: rows,
    });
  });
});

// 2. CREAR UN NUEVO VIAJE (Para que el conductor publique)
// 2. CREAR UN NUEVO VIAJE (Para que el conductor publique)
app.post('/api/trips', (req, res) => {
  // --- LOG DE ENTRADA: Para saber si el servidor recibe el pedido ---
  console.log('🔔 Llegó un pedido a /api/trips. Datos:', req.body);

  const {
    driver_name,
    origin,
    destination,
    date,
    price,
    description,
    type,
    contact_method,
    contact_info,
  } = req.body;

  if (!driver_name || !origin || !destination || !price) {
    console.log('⚠️ Faltan datos obligatorios');
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  const sql = `INSERT INTO trips (driver_name, origin, destination, date, price, description, type, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    driver_name,
    origin,
    destination,
    date,
    price,
    description,
    type,
    contact_method,
    contact_info,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      // --- LOG DE ERROR: Esto nos dirá exactamente qué salió mal en la Base de Datos ---
      console.error('❌ ERROR EN LA BASE DE DATOS:', err.message);
      console.error('📝 Detalles completos del error:', err);
      return res.status(500).json({ error: err.message });
    }
    console.log('✅ Viaje guardado en DB con ID:', this.lastID);
    res.json({
      message: 'Viaje creado con éxito',
      tripId: this.lastID,
    });
  });
});
// --- ELIMINAR UN VIAJE (Solo viajero: Pasajero/Conductor) ---
app.delete('/api/trips/:id', (req, res) => {
  const { id } = req.params;

  // Ejecutamos la sentencia SQL de borrar
  const sql = `DELETE FROM trips WHERE id = ?`;

  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    console.log(`🗑️ Viaje con ID ${id} eliminado.`);
    res.json({ message: 'Viaje eliminado correctamente' });
  });
});
// --- ELIMINAR UNA CONEXIÓN ---
app.delete('/api/requests/:id', (req, res) => {
  const { id } = req.params;

  const sql = `DELETE FROM requests WHERE id = ?`;

  db.run(sql, id, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    console.log(`🗑️ Conexión con ID ${id} eliminada.`);
    res.json({ message: 'Conexión eliminada correctamente' });
  });
});
// --- RUTAS DE SOLICITUDES ---

// Unirse a un viaje
app.post('/api/trips/:id/request', (req, res) => {
  console.log('📨 Recibí pedido de UNIRSE. DATOS:', req.body);

  // Extraemos los nuevos datos
  const {
    passenger_name,
    driver_name,
    destination,
    passenger_email,
    contact_method,
    contact_info,
  } = req.body;
  const tripId = req.params.id;

  const sql = `INSERT INTO requests (trip_id, passenger_name, driver_name, destination, passenger_email, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      tripId,
      passenger_name,
      driver_name,
      destination,
      passenger_email,
      contact_method,
      contact_info,
    ],
    function (err) {
      if (err) {
        console.log('❌ FALLÓ AL GUARDAR (Unirse):', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('✅ Unión guardada con ID:', this.lastID);
      res.json({
        message: 'Solicitud enviada al conductor',
        requestId: this.lastID,
      });
    }
  );
});
// Un conductor se ofrece por una solicitud (Nueva Ruta)
app.post('/api/trips/:id/offer', (req, res) => {
  console.log('📨 Recibí pedido de OFRECERSE');

  const {
    passenger_name,
    driver_name,
    driver_email,
    destination,
    contact_method,
    contact_info,
  } = req.body;
  const tripId = req.params.id;

  const sql = `INSERT INTO requests (trip_id, passenger_name, driver_name, destination, driver_email, contact_method, contact_info) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  db.run(
    sql,
    [
      tripId,
      passenger_name,
      driver_name,
      destination,
      driver_email,
      contact_method,
      contact_info,
    ],
    function (err) {
      if (err) {
        console.log('❌ FALLÓ AL GUARDAR (Ofrecerse):', err.message);
        return res.status(500).json({ error: err.message });
      }
      console.log('✅ Oferta guardada con ID:', this.lastID);
      res.json({
        message: 'Oferta enviada al pasajero',
        requestId: this.lastID,
      });
    }
  );
});
// --- RUTAS DE SOLICITUDES (LECTURA) ---

// Obtener conexiones (Ahora con Filtro de Privacidad)
app.get('/api/requests', (req, res) => {
  const userEmail = req.query.email; // Obtenemos el email de la URL

  let sql = `SELECT * FROM requests`;
  const params = [];

  // Si hay un email, filtramos para mostrar SOLO las de ese usuario
  if (userEmail) {
    sql += ` WHERE passenger_email = ? OR driver_email = ?`;
    params.push(userEmail, userEmail);
  }

  sql += ` ORDER BY id DESC`; // Del más nuevo al más viejo

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({
      message: 'Lista de conexiones filtrada',
      requests: rows,
    });
  });
});
