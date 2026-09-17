# Tavola Nonna — Backend (Node.js + Express + SQLite)

Backend simple para servir el menú del restaurante desde una base de datos SQLite.

## 1. Instalación

```bash
cd tavola-backend
npm install
```

Esto instala `express`, `better-sqlite3` y `cors`.

## 2. Levantar el servidor

```bash
npm start
```

Vas a ver en consola:

```
Base de datos inicializada con 8 platos de prueba.
Servidor de Tavola Nonna corriendo en http://localhost:3000
```

La primera vez que se ejecuta, se crea el archivo `restaurante.db` en la misma carpeta,
con la tabla `platos` y los datos de prueba (Ñoquis al ragù, Ravioles, Tiramisú, etc.).
Las próximas veces que reinicies el servidor, no se vuelven a insertar duplicados.

## 3. Endpoints disponibles

### GET /api/platos
Devuelve todos los platos.

```bash
curl http://localhost:3000/api/platos
```

### GET /api/platos/:id
Devuelve un plato puntual.

```bash
curl http://localhost:3000/api/platos/1
```

### PUT /api/platos/:id
Actualiza uno o más campos de un plato (precio, nombre, descripción, categoría o imagen).

```bash
curl -X PUT http://localhost:3000/api/platos/1 \
  -H "Content-Type: application/json" \
  -d '{"precio": 21500}'
```

Campos editables: `nombre`, `descripcion`, `precio`, `categoria`, `imagen_url`.

## 4. Conectar con el frontend (tavola-nonna.html)

1. Copiá `menu-fetch.js` a la misma carpeta que tu HTML (o a donde sirvas tus assets).
2. Agregá esta línea justo antes de `</body>` en tu HTML, **después** del `<script>` que ya tenías:

```html
<script src="menu-fetch.js"></script>
```

3. Con el backend corriendo (`npm start`), abrí tu HTML. El script busca los
   contenedores `.menu-category[data-cat="tradicionales|rellenas|salsas|postres"]`
   que ya existen en la página y reemplaza los platos estáticos por los que
   vengan de la base de datos, agrupados por categoría.

> Importante: si abrís el HTML directamente como archivo (`file://`), algunos
> navegadores bloquean el `fetch`. Lo más simple es servir el HTML también con
> un servidor estático (por ejemplo, agregando `express.static` en `server.js`
> y copiando el HTML dentro de una carpeta `public/`), o con la extensión
> "Live Server" de VS Code mientras el backend corre en el puerto 3000.

## 5. Estructura de archivos

```
tavola-backend/
├── package.json
├── database.js      -> crea la tabla e inserta datos de prueba
├── server.js         -> servidor Express + rutas de la API
├── menu-fetch.js      -> script para pegar en el frontend
└── restaurante.db     -> se genera solo al ejecutar el servidor
```
