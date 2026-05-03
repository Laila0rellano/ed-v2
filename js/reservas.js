/* ═══════════════════════════════════════
   RESERVAS — Lista, Formulario, CRUD
═══════════════════════════════════════ */

let editingReservaId = null;

/* ─── LISTA ─── */

function renderReservas() {
  const tbody = document.getElementById('reservas-tbody');

  if (!reservas.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;padding:48px;color:var(--c-muted);">
          No hay reservas registradas. Creá la primera.
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = [...reservas].reverse().map(r => `
    <tr>
      <td>
        <div class="r-offerente">${r.rof_apellido}, ${r.rof_nombre}</div>
        <div class="r-dir">${r.rof_email}</div>
      </td>
      <td>
        <div style="font-weight:600;font-size:13px;">${r.rin_direccion}</div>
        <div class="r-dir">${r.rin_localidad}</div>
      </td>
      <td><div class="r-monto">${r.rres_monto_num}</div></td>
      <td><span class="chip amber">${r.rres_tipo_doc}</span></td>
      <td><div class="r-fecha">${r.fecha}</div></td>
      <td>
        <div class="act-btns">
          <button class="act-btn" onclick="editarReserva(${r.id})" title="Editar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="act-btn" onclick="verPDF(${r.id})" title="Ver PDF">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </button>
          <button class="act-btn danger" onclick="eliminarReserva(${r.id})" title="Eliminar">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v2"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

function eliminarReserva(id) {
  if (!confirm('¿Eliminar esta reserva?')) return;

  // Liberar la propiedad vinculada (volver a activa)
  const r = reservas.find(x => x.id === id);
  if (r && r.prop_id) {
    const p = PROPIEDADES.find(x => x.id === r.prop_id);
    if (p && p.status !== 'activa') {
      p.status = 'activa';
    }
  }

  reservas = reservas.filter(r => r.id !== id);
  renderReservas();
  renderPropiedades();
  renderDashboard();
  showToast('Reserva eliminada — propiedad liberada', 'warning');
}

function editarReserva(id) {
  showView('reservas', null);
  showReservaForm(id);
}

/* ─── FORMULARIO ─── */

function showReservaForm(reservaId) {
  editingReservaId = reservaId;

  // Poblar selector — solo propiedades activas (o la ya vinculada si estamos editando)
  const sel = document.getElementById('prop-selector');
  const propIdActual = reservaId !== null
    ? (reservas.find(x => x.id === reservaId) || {}).prop_id || null
    : null;

  const opcionesDisponibles = PROPIEDADES.filter(p =>
    p.status === 'activa' || p.id === propIdActual
  );

  sel.innerHTML = '<option value="">— Seleccionar propiedad del agente —</option>' +
    opcionesDisponibles.map(p => {
      const etiqueta = p.status !== 'activa' ? ` (${STATUS_LABELS[p.status]})` : '';
      return `<option value="${p.id}">${p.titulo} — ${p.direccion}${etiqueta}</option>`;
    }).join('');

  resetForm();

  if (reservaId !== null) {
    const r = reservas.find(x => x.id === reservaId);
    if (r) {
      document.getElementById('form-reserva-title').textContent = 'Editar Reserva';
      loadFormData(r);
      if (r.prop_id) sel.value = r.prop_id;
    }
  } else {
    document.getElementById('form-reserva-title').textContent = 'Nueva Reserva';
  }

  document.getElementById('reservas-list-view').style.display = 'none';
  document.getElementById('reservas-form-view').style.display = 'block';
  window.scrollTo(0, 0);
}

function backToReservasList() {
  document.getElementById('reservas-form-view').style.display = 'none';
  document.getElementById('reservas-list-view').style.display = 'block';
}

function resetForm() {
  const fields = [
    'rof_nombre','rof_apellido','rof_dni','rof_domicilio','rof_tel','rof_email',
    'rin_direccion','rin_localidad','rin_rentas','rin_matricula','rin_nomenclatura',
    'rin_sup_terreno','rin_sup_cubierta','rin_estado',
    'rp_precio_num','rp_precio_letras','rp_plazo_escritura',
    'rres_monto_num','rres_monto_letras',
    'rp_lugar_firma','rp_escribania','rp_comentarios_extra',
    'rv_nombre','rv_dni','rv_domicilio','ra_porcentaje'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  document.getElementById('rres_tipo_doc').value   = 'EFECTIVO';
  document.getElementById('ra_usa_credito').checked = false;
  document.getElementById('ra_monto_extra').value  = '';
  toggleAnexo();
}

function loadFormData(r) {
  Object.keys(r).forEach(k => {
    const el = document.getElementById(k);
    if (!el) return;
    if (el.type === 'checkbox') el.checked = r[k];
    else el.value = r[k];
  });
  toggleAnexo();
}

function cargarDesdePropiedad() {
  const sel = document.getElementById('prop-selector');
  if (!sel.value) return;

  const p = PROPIEDADES.find(x => x.id == sel.value);
  if (!p) return;

  const mapa = {
    rin_direccion:    p.direccion,
    rin_localidad:    p.localidad,
    rin_rentas:       p.rentas,
    rin_matricula:    p.matricula,
    rin_nomenclatura: p.nomenclatura,
    rin_sup_terreno:  p.sup_terreno,
    rin_sup_cubierta: p.sup_cubierta,
    rv_nombre:        p.propietario_nombre,
    rv_dni:           p.propietario_dni,
    rv_domicilio:     p.propietario_domicilio,
    rp_precio_num:    p.precio,
  };

  Object.entries(mapa).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  });

  showToast('✓ Datos cargados desde: ' + p.titulo, 'success');
}

function toggleAnexo() {
  const chk = document.getElementById('ra_usa_credito');
  document.getElementById('anexo-body').style.display = chk.checked ? 'block' : 'none';
}

function collectFormData() {
  const fields = [
    'rof_nombre','rof_apellido','rof_dni','rof_domicilio','rof_tel','rof_email',
    'rin_direccion','rin_localidad','rin_rentas','rin_matricula','rin_nomenclatura',
    'rin_sup_terreno','rin_sup_cubierta','rin_estado',
    'rp_precio_num','rp_precio_letras','rp_plazo_escritura',
    'rres_tipo_doc','rres_monto_num','rres_monto_letras',
    'rp_lugar_firma','rp_escribania','rp_comentarios_extra',
    'rv_nombre','rv_dni','rv_domicilio',
    'ra_porcentaje','ra_monto_extra'
  ];

  const data = {};
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) data[id] = el.value;
  });

  data.ra_usa_credito = document.getElementById('ra_usa_credito').checked;

  const propSel = document.getElementById('prop-selector');
  data.prop_id = propSel ? parseInt(propSel.value) || null : null;

  return data;
}

function guardarReserva(andPrint) {
  const data = collectFormData();

  if (!data.rof_apellido) {
    showToast('Completá al menos el apellido del oferente', 'warning');
    return;
  }

  const hoy = new Date().toLocaleDateString('es-AR');
  let propReservada = false;

  // Auto-reservar propiedad vinculada
  if (data.prop_id) {
    const p = PROPIEDADES.find(x => x.id === data.prop_id);
    if (p && p.status === 'activa') {
      p.status = 'reservada';
      propReservada = true;
    }
  }

  if (editingReservaId !== null) {
    const idx = reservas.findIndex(r => r.id === editingReservaId);
    if (idx !== -1) {
      reservas[idx] = { ...reservas[idx], ...data };
    }
    showToast('✓ Reserva actualizada', 'success');
  } else {
    const nueva = { id: nextReservaId++, fecha: hoy, ...data };
    reservas.push(nueva);
    editingReservaId = nueva.id;

    const msg = propReservada
      ? '✅ Reserva guardada — Propiedad marcada como RESERVADA automáticamente'
      : '✓ Reserva guardada correctamente';
    showToast(msg, 'success');
  }

  renderReservas();
  renderDashboard();
  renderPropiedades();

  if (andPrint) {
    setTimeout(() => abrirPDF(editingReservaId), 300);
  } else {
    backToReservasList();
  }
}
