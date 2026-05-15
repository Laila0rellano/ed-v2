let clientes = [
  {
    id: 1,
    nombre: 'Pablo', apellido: 'Sosa',
    dni: '33.212.890',
    tel: '+54 351 412 8800', email: 'p.sosa@gmail.com',
    domicilio: 'Av. Vélez 450, Córdoba',
    tipo: 'comprador',
    presupuesto: 'USD 70.000 – 100.000',
    notas: 'Busca dpto 2/3 ambientes en Güemes o Nueva Córdoba.',
    fecha_ingreso: '10/03/2025',
  },
  {
    id: 2,
    nombre: 'Lucía', apellido: 'Ramírez',
    dni: '28.500.100',
    tel: '+54 351 567 9900', email: 'lucia.r@hotmail.com',
    domicilio: 'San Juan 800, Córdoba',
    tipo: 'comprador',
    presupuesto: 'USD 280.000 – 350.000',
    notas: 'Interesada en casas con jardín, zona norte.',
    fecha_ingreso: '25/03/2025',
  },
];

let nextClienteId  = 3;
let clienteFiltroTipo   = 'todos';
let clienteEditandoId   = null;
let clienteDetalleId    = null;

/* ─── Render grid ─── */
function renderClientes() {
  const query  = (document.getElementById('clientes-search')?.value || '').toLowerCase();
  const grid   = document.getElementById('clientes-grid');

  let lista = clientes.filter(c => {
    const matchTipo = clienteFiltroTipo === 'todos' || c.tipo === clienteFiltroTipo;
    const matchQ    = !query ||
      `${c.nombre} ${c.apellido} ${c.dni} ${c.email}`.toLowerCase().includes(query);
    return matchTipo && matchQ;
  });

  if (!lista.length) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <h3>Sin clientes</h3>
        <p>No hay clientes que coincidan con los filtros.</p>
      </div>`;
    return;
  }

  grid.innerHTML = lista.map(c => {
    // Operaciones vinculadas (reservas donde es oferente)
    const ops = reservas.filter(r =>
      r.rof_dni === c.dni || r.rof_email === c.email
    );
    const initials = `${c.nombre[0]}${c.apellido[0]}`.toUpperCase();
    const tipoInfo = { comprador: ['blue','Comprador'], vendedor: ['green','Vendedor'], ambos: ['amber','Ambos'] };
    const [color, label] = tipoInfo[c.tipo] || ['blue','—'];

    return `
    <div class="cliente-card" onclick="verDetalleCliente(${c.id})">
      <div class="cliente-card-top">
        <div class="cliente-avatar">${initials}</div>
        <div style="flex:1;min-width:0;">
          <div class="cliente-nombre">${c.apellido}, ${c.nombre}</div>
          <div class="cliente-sub">${c.email || '—'}</div>
        </div>
        <span class="chip ${color}">${label}</span>
      </div>
      <div class="cliente-card-body">
        <div class="cliente-dato">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 8.63 19.79 19.79 0 01.12 2.18 2 2 0 012.1 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
          </svg>
          ${c.tel || '—'}
        </div>
        <div class="cliente-dato">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          ${c.domicilio || '—'}
        </div>
        ${c.presupuesto ? `
        <div class="cliente-dato">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
          </svg>
          ${c.presupuesto}
        </div>` : ''}
      </div>
      <div class="cliente-card-footer">
        <span style="font-size:11px;color:var(--c-muted);">
          ${ops.length ? `📄 ${ops.length} reserva${ops.length > 1 ? 's' : ''}` : 'Sin operaciones'}
        </span>
        <div style="display:flex;gap:6px;">
          <button class="act-btn" onclick="event.stopPropagation();abrirFormCliente(${c.id})" title="Editar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="act-btn danger" onclick="event.stopPropagation();eliminarCliente(${c.id})" title="Eliminar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
            </svg>
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
}

/* ─── Filtros ─── */
function setFiltroTipo(tipo, btn) {
  clienteFiltroTipo = tipo;
  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderClientes();
}

function filtrarClientes() {
  renderClientes();
}

/* ─── Detalle ─── */
function verDetalleCliente(id) {
  const c = clientes.find(x => x.id === id);
  if (!c) return;
  clienteDetalleId = id;

  const initials = `${c.nombre[0]}${c.apellido[0]}`.toUpperCase();
  document.getElementById('detalle-avatar').textContent = initials;
  document.getElementById('detalle-nombre').textContent = `${c.nombre} ${c.apellido}`;

  const tipoInfo = { comprador: 'blue', vendedor: 'green', ambos: 'amber' };
  const tipoLabel = { comprador: 'Comprador', vendedor: 'Vendedor', ambos: 'Ambos' };
  document.getElementById('detalle-badges').innerHTML = `
    <span class="chip ${tipoInfo[c.tipo] || 'blue'}">${tipoLabel[c.tipo] || '—'}</span>`;

  document.getElementById('fd-dni').textContent      = c.dni || '—';
  document.getElementById('fd-domicilio').textContent = c.domicilio || '—';
  document.getElementById('fd-tel').textContent      = c.tel || '—';
  document.getElementById('fd-email').textContent    = c.email || '—';
  document.getElementById('fd-tipo').textContent     = tipoLabel[c.tipo] || '—';
  document.getElementById('fd-fecha').textContent    = c.fecha_ingreso || '—';
  document.getElementById('fd-notas').textContent    = c.notas || 'Sin notas.';

  // Operaciones vinculadas
  const ops = reservas.filter(r => r.rof_dni === c.dni || r.rof_email === c.email);
  const opEl = document.getElementById('fd-operaciones');
  if (!ops.length) {
    opEl.innerHTML = '<p style="font-size:13px;color:var(--c-muted);">Sin operaciones registradas.</p>';
  } else {
    opEl.innerHTML = ops.map(r => {
      const prop = PROPIEDADES.find(p => p.id === r.prop_id);
      return `
        <div class="prop-mini">
          <div class="prop-mini-img">${prop ? prop.emoji : '📄'}</div>
          <div class="prop-mini-info">
            <strong>${r.rin_direccion}</strong>
            <span>Reserva · ${r.fecha} · ${r.rres_monto_num}</span>
          </div>
          <span class="chip amber" style="font-size:10px;">${r.rres_tipo_doc}</span>
        </div>`;
    }).join('');
  }

  mostrarSubview('clientes', 'detalle');
}

function cerrarDetalleCliente() {
  mostrarSubview('clientes', 'list');
}

function volverListaClientes() {
  mostrarSubview('clientes', 'list');
}

function editarClienteActual() {
  abrirFormCliente(clienteDetalleId);
}

/* ─── Formulario ─── */
function abrirFormCliente(id) {
  clienteEditandoId = id;
  resetFormCliente();

  if (id !== null) {
    const c = clientes.find(x => x.id === id);
    if (c) {
      document.getElementById('form-cliente-title').textContent = 'Editar Cliente';
      document.getElementById('cl_nombre').value      = c.nombre || '';
      document.getElementById('cl_apellido').value    = c.apellido || '';
      document.getElementById('cl_dni').value         = c.dni || '';
      document.getElementById('cl_tel').value         = c.tel || '';
      document.getElementById('cl_email').value       = c.email || '';
      document.getElementById('cl_domicilio').value   = c.domicilio || '';
      document.getElementById('cl_tipo').value        = c.tipo || 'comprador';
      document.getElementById('cl_presupuesto').value = c.presupuesto || '';
      document.getElementById('cl_notas').value       = c.notas || '';
    }
  } else {
    document.getElementById('form-cliente-title').textContent = 'Nuevo Cliente';
  }

  mostrarSubview('clientes', 'form');
}

function cancelarFormCliente() {
  mostrarSubview('clientes', 'list');
}

function resetFormCliente() {
  ['cl_nombre','cl_apellido','cl_dni','cl_tel','cl_email',
   'cl_domicilio','cl_presupuesto','cl_notas'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  document.getElementById('cl_tipo').value = 'comprador';
}

function guardarCliente() {
  const nombre   = document.getElementById('cl_nombre').value.trim();
  const apellido = document.getElementById('cl_apellido').value.trim();

  if (!apellido) {
    showToast('Completá al menos el apellido del cliente', 'warning');
    return;
  }

  const data = {
    nombre,
    apellido,
    dni:         document.getElementById('cl_dni').value.trim(),
    tel:         document.getElementById('cl_tel').value.trim(),
    email:       document.getElementById('cl_email').value.trim(),
    domicilio:   document.getElementById('cl_domicilio').value.trim(),
    tipo:        document.getElementById('cl_tipo').value,
    presupuesto: document.getElementById('cl_presupuesto').value.trim(),
    notas:       document.getElementById('cl_notas').value.trim(),
  };

  if (clienteEditandoId !== null) {
    const idx = clientes.findIndex(c => c.id === clienteEditandoId);
    if (idx !== -1) clientes[idx] = { ...clientes[idx], ...data };
    showToast('✓ Cliente actualizado', 'success');
  } else {
    const hoy = new Date().toLocaleDateString('es-AR');
    clientes.push({ id: nextClienteId++, fecha_ingreso: hoy, ...data });
    showToast('✓ Cliente agregado', 'success');
  }

  renderClientes();
  mostrarSubview('clientes', 'list');
}

function eliminarCliente(id) {
  if (!confirm('¿Eliminar este cliente?')) return;
  clientes = clientes.filter(c => c.id !== id);
  renderClientes();
  showToast('Cliente eliminado', 'warning');
}

/* ─── Helper: mostrar sub-vista dentro de view-clientes ─── */
function mostrarSubview(view, sub) {
  const map = {
    list:    'clientes-list-view',
    detalle: 'clientes-detalle-view',
    form:    'clientes-form-view',
  };
  Object.values(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const target = document.getElementById(map[sub]);
  if (target) target.style.display = 'block';

  // Si volvemos a la lista, re-renderizamos
  if (sub === 'list') renderClientes();

  window.scrollTo(0, 0);
}

/* ─── Auto-importar clientes desde reservas existentes ─── */
function sincronizarClientesDesdeReservas() {
  reservas.forEach(r => {
    // Verificar si ya existe por DNI o email
    const existe = clientes.find(c =>
      (r.rof_dni   && c.dni   === r.rof_dni) ||
      (r.rof_email && c.email === r.rof_email)
    );
    if (!existe && r.rof_apellido) {
      clientes.push({
        id: nextClienteId++,
        nombre:        r.rof_nombre  || '',
        apellido:      r.rof_apellido || '',
        dni:           r.rof_dni     || '',
        tel:           r.rof_tel     || '',
        email:         r.rof_email   || '',
        domicilio:     r.rof_domicilio || '',
        tipo:          'comprador',
        presupuesto:   '',
        notas:         'Importado automáticamente desde reserva.',
        fecha_ingreso: r.fecha || new Date().toLocaleDateString('es-AR'),
      });
    }
  });
}

/* ─── Init: se llama desde doLogin() en auth.js ─── */
function initClientes() {
  sincronizarClientesDesdeReservas();
  renderClientes();
}
