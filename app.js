/* ══════════════════════════════════════════════
   BARBER STYLE — Lógica principal (app.js)
   Pantalla 1: Agendar Cita (formulario)
   Pantalla 2: CRUD Clientes
══════════════════════════════════════════════ */

/* URL base de la API del backend.
   Todas las peticiones HTTP se construyen a partir de esta dirección. */
const API = 'http://localhost:8080/api';

/* ── CONSTANTES ──
   Datos fijos que no cambian durante la ejecución de la app. */

/* Lista de horarios disponibles para agendar citas (de 9am a 5pm, cada hora) */
const HORARIOS = ['09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];

/* Lista de barberos del negocio con su información y los horarios que ya tienen ocupados */
const BARBEROS = [
  { id: 1, nombre: 'Andrés Gil',   especialidad: 'Cortes clásicos',    color: '#2D4A7A', inicial: 'AG', ocupados: ['09:00','12:00'] },
  { id: 2, nombre: 'Marco Ríos',   especialidad: 'Barba & degradado',  color: '#5A3535', inicial: 'MR', ocupados: ['10:00','14:00'] },
  { id: 3, nombre: 'Felipe Soto',  especialidad: 'Diseños modernos',   color: '#2D4A3A', inicial: 'FS', ocupados: ['11:00','15:00'] },
];

/* Catálogo de servicios disponibles con su precio en pesos colombianos */
const SERVICIOS = [
  { id: 1, nombre: 'Corte de cabello',    precio: 20000 },
  { id: 2, nombre: 'Arreglo de barba',    precio: 15000 },
  { id: 3, nombre: 'Afeitado navaja',     precio: 25000 },
  { id: 4, nombre: 'Degradado',           precio: 22000 },
  { id: 5, nombre: 'Tratamiento capilar', precio: 30000 },
  { id: 6, nombre: 'Cejas',               precio:  8000 },
];

/* ── DATOS DE PRUEBA (15 clientes) ──
   Arreglo inicial de clientes para poblar la tabla mientras no hay backend activo.
   En producción, estos datos vendrían de la API. */
let clientes = [
  { id:  1, documento: '1094900001', nombre: 'Carlos Alberto Pérez',    telefono: '3001234567', email: 'carlos@email.com'   },
  { id:  2, documento: '1094900002', nombre: 'Juan Esteban López',       telefono: '3109876543', email: 'juan@email.com'     },
  { id:  3, documento: '1094900003', nombre: 'Miguel Ángel Torres',      telefono: '3157654321', email: 'miguel@email.com'   },
  { id:  4, documento: '1094900004', nombre: 'Sebastián Díaz Gómez',     telefono: '3204561237', email: 'sebastian@mail.com' },
  { id:  5, documento: '1094900005', nombre: 'Andrés Felipe Ruiz',       telefono: '3002345678', email: 'andres@mail.com'    },
  { id:  6, documento: '1094900006', nombre: 'Diego Alejandro Moreno',   telefono: '3118765432', email: 'diego@email.com'    },
  { id:  7, documento: '1094900007', nombre: 'Julián David Vargas',      telefono: '3163456789', email: 'julian@email.com'   },
  { id:  8, documento: '1094900008', nombre: 'Camilo Ernesto Sánchez',   telefono: '3055678901', email: 'camilo@email.com'   },
  { id:  9, documento: '1094900009', nombre: 'Nicolás Herrera Castillo', telefono: '3177890123', email: 'nicolas@mail.com'   },
  { id: 10, documento: '1094900010', nombre: 'Felipe Andrés Ospina',     telefono: '3209012345', email: 'felipe@email.com'   },
  { id: 11, documento: '1094900011', nombre: 'Santiago Cárdenas Ríos',   telefono: '3001112223', email: 'santiago@mail.com'  },
  { id: 12, documento: '1094900012', nombre: 'David Mauricio Palomino',  telefono: '3133334445', email: 'david@email.com'    },
  { id: 13, documento: '1094900013', nombre: 'Steven Alexander Molina',  telefono: '3165556667', email: 'steven@mail.com'    },
  { id: 14, documento: '1094900014', nombre: 'Cristian Camilo Duque',    telefono: '3197778889', email: 'cristian@email.com' },
  { id: 15, documento: '1094900015', nombre: 'Jonatan Estiven Ramos',    telefono: '3029990001', email: 'jonatan@mail.com'   },
];

/* ── ESTADO GLOBAL DE LA APLICACIÓN ──
   Variables que guardan la selección actual del usuario en el formulario
   y controlan el comportamiento de la tabla y los modales. */
let selectedBarbero  = null;       // ID del barbero seleccionado en el formulario
let selectedSlot     = null;       // Horario seleccionado (ej: '10:00')
let selectedServices = new Set();  // Conjunto de IDs de servicios marcados (evita duplicados)
let editingId        = null;       // ID del cliente que se está editando en el modal (null si es nuevo)
let deletingId       = null;       // ID del cliente que se va a eliminar en el modal de confirmación
let currentPage      = 1;          // Página actualmente visible en la tabla de clientes
const PAGE_SIZE      = 8;          // Cantidad de clientes mostrados por página
let filteredClientes = [...clientes]; // Copia del arreglo de clientes que se actualiza al buscar
let nextId           = 16;         // Contador para asignar IDs únicos a nuevos clientes localmente

/* ══════════════════════════════════════════════
   NAVEGACIÓN
   Controla qué pantalla se muestra y cuál pestaña
   aparece como activa en la barra de navegación.
══════════════════════════════════════════════ */
function showScreen(name) {
  // Ocultar todas las pantallas quitando la clase "active"
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

  // Desactivar todas las pestañas de navegación
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected', 'false');
  });

  // Mostrar solo la pantalla correspondiente al nombre recibido
  document.getElementById('screen-' + name).classList.add('active');

  // Marcar como activa la pestaña correcta: índice 0 = citas, 1 = clientes
  const tabs = document.querySelectorAll('.nav-tab');
  const idx  = name === 'citas' ? 0 : 1;
  tabs[idx].classList.add('active');
  tabs[idx].setAttribute('aria-selected', 'true');

  // Si se navega a clientes, cargar y renderizar la tabla
  if (name === 'clientes') renderClientes();
}

/* ══════════════════════════════════════════════
   INIT – FORMULARIO DE CITA
   Inicializa el formulario al cargar la página:
   establece la fecha mínima, dibuja las tarjetas
   de barberos, los checkboxes de servicios y los horarios.
══════════════════════════════════════════════ */
function initForm() {
  // Establecer la fecha de hoy como valor y mínimo del campo de fecha (no se pueden agendar citas en el pasado)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('apptDate').min   = today;
  document.getElementById('apptDate').value = today;

  // Generar dinámicamente las tarjetas de barbero a partir del arreglo BARBEROS
  const grid = document.getElementById('barberGrid');
  grid.innerHTML = BARBEROS.map(b => `
    <div class="barber-card" id="bc-${b.id}" onclick="selectBarbero(${b.id})"
         role="radio" aria-checked="false" tabindex="0"
         onkeydown="if(event.key==='Enter'||event.key===' ') selectBarbero(${b.id})">
      <div class="barber-avatar" style="background:${b.color}">${b.inicial}</div>
      <div class="barber-name">${b.nombre}</div>
      <div class="barber-spec">${b.especialidad}</div>
    </div>
  `).join('');

  // Generar dinámicamente los checkboxes de servicios a partir del arreglo SERVICIOS
  const sg = document.getElementById('servicesGrid');
  sg.innerHTML = SERVICIOS.map(s => `
    <label class="service-check" id="sc-${s.id}">
      <input type="checkbox" value="${s.id}" onchange="toggleService(${s.id}, this)" />
      <span>${s.nombre}</span>
    </label>
  `).join('');

  // Renderizar la grilla de horarios disponibles
  renderSlots();
}

/* ── SELECCIÓN DE BARBERO ──
   Marca visualmente la tarjeta del barbero elegido y
   actualiza los horarios disponibles según sus ocupados. */
function selectBarbero(id) {
  selectedBarbero = id;

  // Quitar la selección visual de todas las tarjetas
  document.querySelectorAll('.barber-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });

  // Marcar como seleccionada la tarjeta del barbero elegido
  const card = document.getElementById('bc-' + id);
  card.classList.add('selected');
  card.setAttribute('aria-checked', 'true');

  // Limpiar el error de validación del campo barbero
  clearErr('barber');

  // Volver a renderizar los horarios para reflejar los ocupados del barbero seleccionado
  renderSlots();
}

/* ── RENDERIZADO DE HORARIOS ──
   Dibuja los botones de horario marcando cuáles están ocupados
   para el barbero seleccionado y cuál está actualmente elegido. */
function renderSlots() {
  // Obtener los horarios ocupados del barbero seleccionado (o vacío si no hay barbero)
  const barbero = BARBEROS.find(b => b.id === selectedBarbero);
  const booked  = selectedBarbero ? (barbero.ocupados || []) : [];
  const grid    = document.getElementById('slotsGrid');

  // Crear un botón por cada horario, aplicando clases según si está ocupado o seleccionado
  grid.innerHTML = HORARIOS.map(h => {
    const taken = booked.includes(h);   // true si ese horario ya está reservado
    const sel   = h === selectedSlot;   // true si el usuario ya lo eligió
    return `<button type="button"
      class="slot${taken ? ' taken' : ''}${sel ? ' selected' : ''}"
      onclick="${taken ? '' : `selectSlot('${h}')`}"
      aria-label="Horario ${h}${taken ? ' - no disponible' : ''}"
      aria-disabled="${taken}"
    >${h}${taken ? ' ✗' : ''}</button>`;
  }).join('');
}

/* Al cambiar la fecha de la cita, se reinicia el horario seleccionado
   y se vuelven a dibujar los slots para reflejar el nuevo día */
document.getElementById('apptDate').addEventListener('change', () => {
  selectedSlot = null;
  renderSlots();
});

/* ── SELECCIÓN DE HORARIO ──
   Guarda el horario elegido y refresca la grilla para marcarlo visualmente. */
function selectSlot(h) {
  selectedSlot = h;
  clearErr('slot');
  renderSlots();
}

/* ── SELECCIÓN DE SERVICIOS ──
   Añade o elimina un servicio del Set de seleccionados
   y aplica/quita el estilo visual de la etiqueta. */
function toggleService(id, cb) {
  const label = document.getElementById('sc-' + id);
  if (cb.checked) { selectedServices.add(id); label.classList.add('selected'); }
  else            { selectedServices.delete(id); label.classList.remove('selected'); }

  // Si hay al menos un servicio seleccionado, quitar el mensaje de error
  if (selectedServices.size > 0) clearErr('services');
}

/* ══════════════════════════════════════════════
   VALIDACIÓN DE CAMPOS
   Funciones para mostrar y ocultar mensajes de error
   en los campos del formulario de agendar cita.
══════════════════════════════════════════════ */

/* Muestra el mensaje de error de un campo y le aplica el estilo de error al input */
function setErr(field) {
  const el  = document.getElementById('err-' + field);
  // Mapa que relaciona el nombre del campo con el ID de su input en el DOM
  const map = { clientDoc:'clientDoc', clientName:'clientName', clientPhone:'clientPhone', clientEmail:'clientEmail', apptDate:'apptDate' };
  if (el) el.classList.add('visible');
  if (map[field]) document.getElementById(map[field])?.classList.add('error');
}

/* Oculta el mensaje de error de un campo y le quita el estilo de error al input */
function clearErr(field) {
  const el  = document.getElementById('err-' + field);
  const map = { clientDoc:'clientDoc', clientName:'clientName', clientPhone:'clientPhone', clientEmail:'clientEmail', apptDate:'apptDate' };
  if (el) el.classList.remove('visible');
  if (map[field]) document.getElementById(map[field])?.classList.remove('error');
}

/* ══════════════════════════════════════════════
   SUBMIT – AGENDAR CITA
   Intercepta el envío del formulario, valida todos los campos,
   envía los datos al backend y actualiza el estado local.
══════════════════════════════════════════════ */
document.getElementById('appointmentForm').addEventListener('submit', async function(e) {
  e.preventDefault(); // Evitar el comportamiento nativo de recarga de página
  let valid = true;

  // Leer y limpiar los valores de cada campo del formulario
  const doc   = document.getElementById('clientDoc').value.trim();
  const name  = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim().replace(/\s/g, ''); // quitar espacios del teléfono
  const email = document.getElementById('clientEmail').value.trim();
  const date  = document.getElementById('apptDate').value;

  // Limpiar todos los errores antes de validar de nuevo
  ['clientDoc','clientName','clientPhone','clientEmail','apptDate','barber','slot','services'].forEach(clearErr);

  // Validaciones de cada campo: si falla, se muestra el error y se marca el formulario como inválido
  if (!doc   || doc.length < 5)                                      { setErr('clientDoc');   valid = false; } // Documento mínimo 5 caracteres
  if (!name  || name.length < 3)                                     { setErr('clientName');  valid = false; } // Nombre mínimo 3 caracteres
  if (!/^\d{10}$/.test(phone))                                       { setErr('clientPhone'); valid = false; } // Teléfono exactamente 10 dígitos
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))           { setErr('clientEmail'); valid = false; } // Email válido si se ingresó
  if (!date)                                                          { setErr('apptDate');    valid = false; } // Fecha obligatoria
  if (!selectedBarbero)                                               { setErr('barber');      valid = false; } // Barbero obligatorio
  if (!selectedSlot)                                                  { setErr('slot');        valid = false; } // Horario obligatorio
  if (selectedServices.size === 0)                                    { setErr('services');    valid = false; } // Al menos un servicio
  if (!valid) return; // Si hay errores, no continuar con el envío

  // Deshabilitar el botón y mostrar spinner mientras se procesa
  const submitBtn = e.submitter || document.querySelector('#appointmentForm [type=submit]');
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="spinner"></span> Guardando…';

  try {
    // Construir el objeto con los datos de la cita para enviar al backend
    const payload = {
      documento:   doc,
      nombre:      name,
      telefono:    phone,
      email:       email || '',
      barberoId:   selectedBarbero,
      servicioIds: Array.from(selectedServices), // Convertir Set a array para JSON
      fecha:       date,
      hora:        selectedSlot
    };
    // Enviar la cita al backend vía POST (si falla, el catch lo maneja silenciosamente)
    await fetch(`${API}/citas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch(_) { /* Si el backend no está disponible, se continúa con el flujo local */ }

  // Bloquear el horario localmente para que no se pueda volver a seleccionar en la misma sesión
  const b = BARBEROS.find(x => x.id === selectedBarbero);
  if (!b.ocupados.includes(selectedSlot)) b.ocupados.push(selectedSlot);

  // Si el cliente no existe aún en la lista local, agregarlo
  const existe = clientes.find(c => c.documento === doc || c.telefono === phone);
  if (!existe) {
    clientes.push({ id: nextId++, documento: doc, nombre: name, telefono: phone, email: email || '' });
    filteredClientes = [...clientes];
  }

  // Construir el resumen de servicios seleccionados para mostrar en el toast
  const sNames = Array.from(selectedServices)
    .map(id => SERVICIOS.find(s => s.id === id).nombre)
    .join(', ');

  // Mostrar notificación de éxito con el resumen de la cita
  showToast('Cita confirmada', `${name} · ${b.nombre} · ${date} ${selectedSlot} · ${sNames}`);

  // Limpiar el formulario para una nueva cita
  resetForm();

  // Reactivar el botón de envío
  submitBtn.disabled = false;
  submitBtn.innerHTML = 'Confirmar Cita';
});

/* ── LIMPIAR FORMULARIO ──
   Reinicia todos los campos, selecciones y estados visuales del formulario
   dejándolo listo para agendar una nueva cita. */
function resetForm() {
  document.getElementById('appointmentForm').reset(); // Limpiar todos los inputs nativos

  // Reiniciar estado de selecciones
  selectedBarbero = null; selectedSlot = null; selectedServices.clear();

  // Quitar estilos de selección de barberos
  document.querySelectorAll('.barber-card').forEach(c => {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });

  // Quitar estilos de selección de servicios
  document.querySelectorAll('.service-check').forEach(c => c.classList.remove('selected'));

  // Ocultar todos los mensajes de error
  document.querySelectorAll('.error-msg').forEach(e => e.classList.remove('visible'));

  // Quitar estilos de error de los inputs
  document.querySelectorAll('.error').forEach(e => e.classList.remove('error'));

  // Restablecer la fecha al día de hoy
  document.getElementById('apptDate').value = new Date().toISOString().split('T')[0];

  // Volver a renderizar los horarios (sin selección y sin barbero)
  renderSlots();
}

/* ══════════════════════════════════════════════
   TOAST (NOTIFICACIÓN EMERGENTE)
   Muestra un mensaje temporal en la esquina superior derecha.
   Desaparece automáticamente después de 4 segundos.
══════════════════════════════════════════════ */
function showToast(title, msg, isError = false) {
  const t = document.getElementById('toast');
  document.getElementById('toastTitle').textContent = title;
  document.getElementById('toastMsg').textContent   = msg;
  t.classList.toggle('error', isError); // Si isError es true, aplica el estilo rojo
  t.classList.add('show');              // Hacer visible el toast
  setTimeout(() => t.classList.remove('show'), 4000); // Ocultarlo después de 4 segundos
}

/* ══════════════════════════════════════════════
   CRUD CLIENTES
   Funciones para buscar, listar, paginar,
   crear, editar y eliminar clientes.
══════════════════════════════════════════════ */

/* ── FILTRAR CLIENTES ──
   Se ejecuta en tiempo real al escribir en el buscador.
   Filtra por nombre, documento, teléfono o email. */
function filterClientes() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  filteredClientes = clientes.filter(c =>
    c.nombre.toLowerCase().includes(q)  ||
    c.documento.includes(q)             ||
    c.telefono.includes(q)              ||
    (c.email || '').toLowerCase().includes(q)
  );
  currentPage = 1; // Volver a la primera página al filtrar
  renderTable();
}

/* ── CARGAR CLIENTES ──
   Reinicia la lista filtrada con todos los clientes y renderiza la tabla desde la página 1. */
function renderClientes() {
  filteredClientes = [...clientes];
  currentPage = 1;
  renderTable();
}

/* ── RENDERIZAR TABLA ──
   Dibuja las filas de la página actual en el cuerpo de la tabla
   y actualiza los controles de paginación. */
function renderTable() {
  // Calcular el rango de clientes de la página actual
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredClientes.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('clientesTableBody');

  // Si no hay resultados, mostrar un mensaje centrado en lugar de filas
  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:2.5rem">Sin resultados</td></tr>`;
    document.getElementById('pagination').innerHTML = '';
    return;
  }

  // Generar el HTML de cada fila con los datos del cliente y sus botones de acción
  tbody.innerHTML = page.map(c => `
    <tr>
      <td class="td-doc">${c.documento}</td>
      <td class="td-name">${c.nombre}</td>
      <td>${c.telefono}</td>
      <td class="td-email">${c.email || '—'}</td>
      <td>
        <div class="td-actions">
          <button class="btn btn-outline btn-sm" onclick="openModal(${c.id})" aria-label="Editar ${c.nombre}">✎ Editar</button>
          <button class="btn btn-danger  btn-sm" onclick="openConfirm(${c.id})" aria-label="Eliminar ${c.nombre}">✕</button>
        </div>
      </td>
    </tr>
  `).join('');

  renderPagination(); // Actualizar los controles de paginación debajo de la tabla
}

/* ── RENDERIZAR PAGINACIÓN ──
   Genera los botones de página y el texto "Mostrando X–Y de Z" debajo de la tabla. */
function renderPagination() {
  const total = filteredClientes.length;
  const pages = Math.ceil(total / PAGE_SIZE);             // Total de páginas necesarias
  const start = (currentPage - 1) * PAGE_SIZE + 1;       // Número del primer registro visible
  const end   = Math.min(currentPage * PAGE_SIZE, total); // Número del último registro visible

  // Construir el HTML de la barra de paginación
  let html = `<span>Mostrando ${start}–${end} de ${total}</span><div class="page-btns">`;
  html += `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}>‹ Prev</button>`;

  // Generar un botón por cada página
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
  }

  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}>Next ›</button>`;
  html += '</div>';
  document.getElementById('pagination').innerHTML = html;
}

/* ── IR A UNA PÁGINA ──
   Cambia la página activa de la tabla si el número es válido. */
function goPage(p) {
  const pages = Math.ceil(filteredClientes.length / PAGE_SIZE);
  if (p < 1 || p > pages) return; // Ignorar si está fuera del rango válido
  currentPage = p;
  renderTable();
}

/* ══════════════════════════════════════════════
   MODAL CREAR / EDITAR CLIENTE
   Abre el modal para registrar un nuevo cliente o
   para modificar los datos de uno existente.
══════════════════════════════════════════════ */

/* ── ABRIR MODAL ──
   Si se pasa un ID, el modal se abre en modo edición con los datos del cliente.
   Si no se pasa ID, se abre en modo creación con los campos vacíos. */
function openModal(id) {
  editingId = id || null;
  clearModalErrors();

  const cancelBtn = document.getElementById('modalCancelBtn');
  const saveBtn   = document.getElementById('modalSaveBtn');

  if (id) {
    // Modo edición: cargar los datos del cliente en los campos del modal
    const c = clientes.find(x => x.id === id);
    document.getElementById('modalTitle').textContent = 'Editar Cliente';
    document.getElementById('mDoc').value   = c.documento;
    document.getElementById('mName').value  = c.nombre;
    document.getElementById('mPhone').value = c.telefono;
    document.getElementById('mEmail').value = c.email || '';
    cancelBtn.textContent = 'Cancelar'; // En edición, cancelar cierra el modal
    saveBtn.textContent   = 'Guardar';
  } else {
    // Modo creación: limpiar los campos y mostrar textos de nuevo cliente
    document.getElementById('modalTitle').textContent = 'Nuevo Cliente';
    clearModalFields();
    cancelBtn.textContent = 'Limpiar'; // En creación, "cancelar" solo limpia los campos
    saveBtn.textContent   = 'Agregar';
  }

  // Mostrar el modal y enfocar el primer campo
  document.getElementById('clientModal').classList.add('open');
  document.getElementById('mDoc').focus();
}

/* ── MANEJAR BOTÓN CANCELAR DEL MODAL ──
   En modo edición: cierra el modal.
   En modo creación: solo limpia los campos sin cerrar. */
function handleModalCancel() {
  if (editingId) {
    closeModal();
  } else {
    clearModalFields();
    clearModalErrors();
  }
}

/* ── LIMPIAR CAMPOS DEL MODAL ──
   Vacía todos los inputs del formulario del modal. */
function clearModalFields() {
  ['mDoc','mName','mPhone','mEmail'].forEach(id => {
    document.getElementById(id).value = '';
  });
}

/* ── LIMPIAR ERRORES DEL MODAL ──
   Oculta todos los mensajes de error del formulario del modal. */
function clearModalErrors() {
  ['doc','name','phone','email'].forEach(f => {
    document.getElementById('mErr-' + f)?.classList.remove('visible');
  });
}

/* ── CERRAR MODAL ──
   Cierra el modal y reinicia el ID de edición. */
function closeModal() {
  document.getElementById('clientModal').classList.remove('open');
  editingId = null;
}

/* ── GUARDAR CLIENTE ──
   Valida los campos del modal y luego crea o actualiza el cliente
   tanto en el backend (si está disponible) como en el arreglo local. */
async function saveCliente() {
  const doc   = document.getElementById('mDoc').value.trim();
  const name  = document.getElementById('mName').value.trim();
  const phone = document.getElementById('mPhone').value.trim().replace(/\s/g, '');
  const email = document.getElementById('mEmail').value.trim();
  let valid   = true;

  clearModalErrors();

  // Validar cada campo del modal
  if (!doc   || doc.length < 5)                                    { document.getElementById('mErr-doc').classList.add('visible');   valid = false; }
  if (!name  || name.length < 3)                                   { document.getElementById('mErr-name').classList.add('visible');  valid = false; }
  if (!/^\d{10}$/.test(phone))                                     { document.getElementById('mErr-phone').classList.add('visible'); valid = false; }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))         { document.getElementById('mErr-email').classList.add('visible'); valid = false; }
  if (!valid) return; // No continuar si hay errores

  // Deshabilitar el botón mientras se procesa para evitar doble clic
  const saveBtn = document.getElementById('modalSaveBtn');
  saveBtn.disabled = true;

  try {
    if (editingId) {
      // Modo edición: enviar PUT al backend con los nuevos datos
      await fetch(`${API}/clientes/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documento: doc, nombre: name, telefono: phone, email })
      });
      // Actualizar el cliente en el arreglo local
      const c = clientes.find(x => x.id === editingId);
      c.documento = doc; c.nombre = name; c.telefono = phone; c.email = email;
      showToast('Cliente actualizado', name);
    } else {
      // Modo creación: enviar POST al backend
      const res = await fetch(`${API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documento: doc, nombre: name, telefono: phone, email })
      }).catch(() => null); // Si falla la petición, devuelve null en lugar de lanzar error

      // Usar el ID devuelto por el backend, o generar uno local si no está disponible
      let newId = nextId++;
      if (res && res.ok) {
        const created = await res.json().catch(() => null);
        if (created?.id) newId = created.id;
      }
      clientes.push({ id: newId, documento: doc, nombre: name, telefono: phone, email: email || '' });
      showToast('Cliente creado', name);
    }
  } catch(_) {
    // Si el backend no responde, realizar la operación solo en el arreglo local
    if (editingId) {
      const c = clientes.find(x => x.id === editingId);
      c.documento = doc; c.nombre = name; c.telefono = phone; c.email = email;
    } else {
      clientes.push({ id: nextId++, documento: doc, nombre: name, telefono: phone, email: email || '' });
    }
    showToast(editingId ? 'Cliente actualizado' : 'Cliente creado', name);
  }

  // Sincronizar la lista filtrada, refrescar la tabla, cerrar el modal y reactivar el botón
  filteredClientes = [...clientes];
  renderTable();
  closeModal();
  saveBtn.disabled = false;
}
