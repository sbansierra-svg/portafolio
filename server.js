const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Sirve los archivos estáticos de la carpeta
app.use(express.static(__dirname));

// Fuerza la carga de pastas.html en la raíz del sitio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pastas.html'));
});

// Ruta API para traer la lista de platos
app.get('/api/platos', (req, res) => {
  db.all('SELECT * FROM platos', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Ruta API para actualizar un plato
app.put('/api/platos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, categoria, imagen_url } = req.body;

  if (precio !== undefined && (typeof precio !== 'number' || precio <= 0)) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo' });
  }

  const sql = `
    UPDATE platos 
    SET nombre = COALESCE(?, nombre),
        descripcion = COALESCE(?, descripcion),
        precio = COALESCE(?, precio),
        categoria = COALESCE(?, categoria),
        imagen_url = COALESCE(?, imagen_url)
    WHERE id = ?
  `;

  db.run(sql, [nombre, descripcion, precio, categoria, imagen_url, id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Plato no encontrado' });
    res.json({ message: 'Plato actualizado correctamente' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Tavola Nonna corriendo en http://localhost:${PORT}`);
});