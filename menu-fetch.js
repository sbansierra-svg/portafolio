const API_URL = 'http://localhost:3000/api/platos';

// Formatea números como precio en pesos, ej: 20000 -> "$20.000"
function formatearPrecio(valor) {
  return '$' + Number(valor).toLocaleString('es-AR');
}

// Crea la tarjeta del plato sumando controles para cambiar precio y foto
function crearTarjetaPlato(plato) {
  const dish = document.createElement('div');
  dish.className = 'dish';
  dish.dataset.id = plato.id;

  dish.innerHTML = `
    <div class="dish-top">
      <span class="dish-name">${plato.nombre}</span>
      <span class="dish-price">${formatearPrecio(plato.precio)}</span>
    </div>
    <p class="dish-sub">${plato.descripcion}</p>
    <div class="dish-detail" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">
      ${plato.imagen_url ? `<img src="${plato.imagen_url}" alt="${plato.nombre}" style="width:100%; max-height: 200px; object-fit: cover; border-radius: 6px;">` : ''}
      
      <!-- Panel sencillo para que el dueño edite -->
      <div class="admin-edit-panel" style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 6px; display: flex; flex-direction: column; gap: 6px;" onclick="event.stopPropagation()">
        <label style="font-size: 0.8em; font-weight: bold;">Editar Precio ($):</label>
        <input type="number" class="input-precio" value="${plato.precio}" style="padding: 4px; border-radius: 4px; border: 1px solid #ccc;">

        <label style="font-size: 0.8em; font-weight: bold;">Ruta o URL de Imagen:</label>
        <input type="text" class="input-imagen" value="${plato.imagen_url || ''}" placeholder="Ej: img/foto.jpg" style="padding: 4px; border-radius: 4px; border: 1px solid #ccc;">

        <button class="btn-guardar" style="margin-top: 6px; padding: 6px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">
          💾 Guardar Cambios
        </button>
      </div>
    </div>
  `;

  // Despliega o contrae la tarjeta al hacer clic
  dish.addEventListener('click', () => dish.classList.toggle('open'));

  // Evento para guardar cambios de precio y foto en el backend
  const btnGuardar = dish.querySelector('.btn-guardar');
  btnGuardar.addEventListener('click', async (e) => {
    e.stopPropagation(); // Evita que la tarjeta se cierre al presionar el botón

    const nuevoPrecio = parseFloat(dish.querySelector('.input-precio').value);
    const nuevaImagen = dish.querySelector('.input-imagen').value.trim();

    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
      alert('Por favor, ingresá un precio válido.');
      return;
    }

    await actualizarPlato(plato.id, {
      precio: nuevoPrecio,
      imagen_url: nuevaImagen
    });
  });

  return dish;
}

// Agrupa los platos por categoría e inserta las tarjetas
function renderizarMenu(platos) {
  const categorias = {};

  platos.forEach((plato) => {
    if (!categorias[plato.categoria]) categorias[plato.categoria] = [];
    categorias[plato.categoria].push(plato);
  });

  Object.entries(categorias).forEach(([categoria, listaPlatos]) => {
    const contenedorCategoria = document.querySelector(
      `.menu-category[data-cat="${categoria}"] .dish-grid`
    );

    if (!contenedorCategoria) {
      console.warn(`No se encontró contenedor para la categoría "${categoria}". Se omite.`);
      return;
    }

    contenedorCategoria.innerHTML = '';
    listaPlatos.forEach((plato) => {
      contenedorCategoria.appendChild(crearTarjetaPlato(plato));
    });
  });
}

async function cargarMenu() {
  try {
    const respuesta = await fetch(API_URL);
    if (!respuesta.ok) throw new Error(`Error HTTP ${respuesta.status}`);

    const platos = await respuesta.json();
    renderizarMenu(platos);
  } catch (error) {
    console.error('No se pudo cargar el menú desde la base de datos:', error);
    document.querySelectorAll('.dish-grid').forEach((grid) => {
      grid.innerHTML = '<p style="color:var(--cream-dim);">No se pudo cargar el menú en este momento.</p>';
    });
  }
}

// Envía los cambios al servidor (PUT /api/platos/:id)
async function actualizarPlato(id, cambios) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cambios)
    });

    if (!respuesta.ok) {
      const error = await respuesta.json();
      throw new Error(error.error || `Error HTTP ${respuesta.status}`);
    }

    alert('¡Plato actualizado correctamente!');
    cargarMenu(); // Vuelve a consultar la DB y actualiza las imágenes y precios guardados
  } catch (error) {
    console.error('No se pudo actualizar el plato:', error);
    alert('Ocurrió un error al guardar los cambios.');
  }
}

document.addEventListener('DOMContentLoaded', cargarMenu);