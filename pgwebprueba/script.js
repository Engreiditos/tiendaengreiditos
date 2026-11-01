// ============================================
// NAVEGACIÓN ENTRE CATEGORÍAS
// ============================================
function mostrarCategoria(categoria, boton) {
  // Ocultar todos los catálogos
  document.querySelectorAll('.catalogo').forEach(sec => {
    sec.classList.add('oculto');
  });

  // Mostrar el seleccionado
  document.getElementById(categoria).classList.remove('oculto');

  // Cerrar el menú después de elegir
  const menu = document.getElementById('dropdown-menu');
  if (menu) menu.classList.remove('abierto');

  // Scroll suave al catálogo
  document.getElementById(categoria).scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// CARRITO
// ============================================
let carrito = JSON.parse(localStorage.getItem('carritoEngreiditos')) || [];

// Agregar producto
function agregarAlCarrito(boton) {
  const producto = boton.closest('.producto');
  const id = producto.dataset.id;
  const nombre = producto.dataset.nombre;
  const precio = parseFloat(producto.dataset.precio);
  const imagen = producto.querySelector('img').src;

  const existente = carrito.find(p => p.id === id);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
  }

  guardarCarrito();
  actualizarCarrito();
  animarCarrito();
}

// Guardar en localStorage
function guardarCarrito() {
  localStorage.setItem('carritoEngreiditos', JSON.stringify(carrito));
}

// Actualizar el panel y el contador
function actualizarCarrito() {
  const lista = document.getElementById('lista-carrito');
  const contador = document.getElementById('contador-carrito');
  const totalEl = document.getElementById('total-carrito');

  lista.innerHTML = '';
  let total = 0;
  let cantidadTotal = 0;

  if (carrito.length === 0) {
    lista.innerHTML = '<p class="carrito-vacio">Tu carrito está vacío 🐾</p>';
  } else {
    carrito.forEach(item => {
      total += item.precio * item.cantidad;
      cantidadTotal += item.cantidad;

      const div = document.createElement('div');
      div.className = 'item-carrito';
      div.innerHTML = `
        <img src="${item.imagen}" alt="${item.nombre}">
        <div class="item-info">
          <p>${item.nombre}</p>
          <span>S/ ${item.precio.toFixed(2)}</span>
          <div class="cantidad-controles">
            <button onclick="cambiarCantidad('${item.id}', -1)">−</button>
            <span>${item.cantidad}</span>
            <button onclick="cambiarCantidad('${item.id}', 1)">+</button>
          </div>
        </div>
        <button class="btn-eliminar" onclick="eliminarProducto('${item.id}')">
          <i class="fas fa-trash"></i>
        </button>
      `;
      lista.appendChild(div);
    });
  }

  contador.textContent = cantidadTotal;
  contador.style.display = cantidadTotal > 0 ? 'flex' : 'none';
  totalEl.textContent = `S/ ${total.toFixed(2)}`;
}

// Cambiar cantidad
function cambiarCantidad(id, cambio) {
  const item = carrito.find(p => p.id === id);
  if (!item) return;

  item.cantidad += cambio;

  if (item.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }

  guardarCarrito();
  actualizarCarrito();
}

// Eliminar producto
function eliminarProducto(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarrito();
  actualizarCarrito();
}

// Abrir / cerrar panel
const panel = document.getElementById('panel-carrito');
const overlay = document.getElementById('overlay');

document.getElementById('btn-carrito').addEventListener('click', () => {
  panel.classList.add('abierto');
  overlay.classList.add('activo');
});

document.getElementById('cerrar-carrito').addEventListener('click', cerrarCarrito);
overlay.addEventListener('click', cerrarCarrito);

function cerrarCarrito() {
  panel.classList.remove('abierto');
  overlay.classList.remove('activo');
}

// Animación del icono
function animarCarrito() {
  const btn = document.getElementById('btn-carrito');
  btn.classList.add('animar');
  setTimeout(() => btn.classList.remove('animar'), 400);
}

// Finalizar compra por WhatsApp
function finalizarCompra() {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío 🐾');
    return;
  }

  let mensaje = '¡Hola ENGREIDITOS! 🐾 Quiero comprar:\n\n';
  let total = 0;

  carrito.forEach(item => {
    mensaje += `• ${item.nombre} x${item.cantidad} = S/ ${(item.precio * item.cantidad).toFixed(2)}\n`;
    total += item.precio * item.cantidad;
  });

  mensaje += `\n*Total: S/ ${total.toFixed(2)}*`;

  const telefono = '51937317265'; // 👈 CAMBIA por tu número real
  window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`, '_blank');
}

// Inicializar
actualizarCarrito();

// ============================================
// MODAL DE PRODUCTO
// ============================================
let productoActual = null;

function abrirModal(elemento) {
  const modal = document.getElementById('modal-producto');
  productoActual = elemento;

  // Cargar datos
  document.getElementById('modal-img').src = elemento.dataset.img;
  document.getElementById('modal-img').alt = elemento.dataset.nombre;
  document.getElementById('modal-nombre').textContent = elemento.dataset.nombre;
  document.getElementById('modal-precio').textContent = `S/ ${parseFloat(elemento.dataset.precio).toFixed(2)}`;
  document.getElementById('modal-desc').textContent = elemento.dataset.desc;

  // Cargar características (separadas por |)
  const lista = document.getElementById('modal-carac');
  lista.innerHTML = '';
  const caracteristicas = elemento.dataset.carac.split('|');
  caracteristicas.forEach(c => {
    if (c.trim()) {
      const li = document.createElement('li');
      li.innerHTML = `<i class="fas fa-check"></i> ${c.trim()}`;
      lista.appendChild(li);
    }
  });

  // Botón agregar del modal
  const btnAgregar = document.getElementById('modal-btn-agregar');
  btnAgregar.onclick = () => {
    agregarAlCarrito(elemento.querySelector('.btn-agregar'));
    cerrarModal();
  };

  modal.classList.add('activo');
  document.body.style.overflow = 'hidden'; // bloquea scroll de fondo
}

function cerrarModal() {
  document.getElementById('modal-producto').classList.remove('activo');
  document.body.style.overflow = '';
}

// Cerrar modal al hacer clic fuera del contenido
document.getElementById('modal-producto').addEventListener('click', (e) => {
  if (e.target.id === 'modal-producto') cerrarModal();
});

// Cerrar modal con la tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') cerrarModal();
});

// ============================================
// MENÚ DESPLEGABLE DE CATEGORÍAS
// ============================================
function toggleDropdown(event) {
  event.stopPropagation();
  const menu = document.getElementById('dropdown-menu');
  menu.classList.toggle('abierto');
}

// Cerrar el menú al hacer clic fuera
document.addEventListener('click', (e) => {
  const menu = document.getElementById('dropdown-menu');
  const dropdown = document.querySelector('.dropdown');
  if (menu && dropdown && !dropdown.contains(e.target)) {
    menu.classList.remove('abierto');
  }
});
