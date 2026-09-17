const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'restaurante.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Crear la tabla si no existe
  db.run(`
    CREATE TABLE IF NOT EXISTS platos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT,
      precio REAL NOT NULL,
      categoria TEXT,
      imagen_url TEXT
    )
  `);

  // 2. Verificar si ya hay datos guardados
  db.get("SELECT COUNT(*) AS count FROM platos", (err, row) => {
    if (err) {
      console.error("Error al consultar la base de datos:", err.message);
      return;
    }

    // Solo si la base de datos está totalmente vacía (0 platos) se cargan los iniciales
    if (row.count === 0) {
      console.log('Cargando la carta inicial por primera vez...');

      const stmt = db.prepare(`
        INSERT INTO platos (nombre, descripcion, precio, categoria)
        VALUES (?, ?, ?, ?)
      `);

      // Pastas Tradicionales
      stmt.run('Tagliatelle al ragù', 'Cinta de huevo, ragú de cocción lenta, parmesano.', 8900, 'tradicionales');
      stmt.run('Spaghetti alle vongole', 'Almejas frescas, ajo, vino blanco, perejil.', 9800, 'tradicionales');
      stmt.run('Trofie al pesto', 'Pesto genovés molido a mano, papa y chaucha.', 7900, 'tradicionales');
      stmt.run('Cacio e pepe', 'Tonnarelli, pecorino romano, pimienta negra.', 7500, 'tradicionales');

      // Pastas Rellenas
      stmt.run('Ravioles de ricotta y espinaca', 'Manteca salvia, nuez moscada.', 9200, 'rellenas');
      stmt.run('Tortelloni de osobuco', 'Relleno braseado 8 horas, caldo reducido.', 10500, 'rellenas');
      stmt.run('Agnolotti del plin', 'Tres carnes, manteca y romero.', 9900, 'rellenas');
      stmt.run('Sorrentinos de jamón crudo', 'Mozzarella, jamón crudo, salsa rosa suave.', 8700, 'rellenas');

      // Salsas
      stmt.run('Pomodoro', 'Tomate San Marzano, albahaca, ajo.', 1500, 'salsas');
      stmt.run('Bolognesa', 'Cocción lenta de 6 horas, tres carnes.', 2200, 'salsas');
      stmt.run('Cuatro quesos', 'Parmesano, gorgonzola, fontina, provolone.', 2400, 'salsas');
      stmt.run('Pesto genovés', 'Molido a mano en mortero de mármol.', 2100, 'salsas');

      // Postres
      stmt.run('Tiramisú de la casa', 'Receta original de Nonna Elena.', 4800, 'postres');
      stmt.run('Panna cotta de vainilla', 'Coulis de frutos rojos de estación.', 4200, 'postres');
      stmt.run('Cannoli sicilianos', 'Ricotta, chocolate, pistacho tostado.', 4500, 'postres');
      stmt.run('Affogato', 'Helado de vainilla, espresso al momento.', 3600, 'postres');

      stmt.finalize();
      console.log('¡Base de datos inicializada correctamente!');
    } else {
      console.log('Base de datos cargada. Se conservan los precios y cambios existentes.');
    }
  });
});

module.exports = db;