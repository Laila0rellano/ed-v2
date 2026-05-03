/* ═══════════════════════════════════════
   PROPIEDADES — Render y Estado
═══════════════════════════════════════ */

const STATUS_COLORES = {
  activa:    'badge-activa',
  reservada: 'badge-reservada',
  vendida:   'badge-vendida',
  alquilada: 'badge-alquilada',
};

const STATUS_LABELS = {
  activa:    'Activa',
  reservada: 'Reservada',
  vendida:   'Vendida',
  alquilada: 'Alquilada',
};

function renderPropiedades() {
  const grid = document.getElementById('props-grid');
  grid.innerHTML = PROPIEDADES.map(p => {
    // ¿Tiene reserva vinculada?
    const reservaVinculada = reservas.find(r => r.prop_id === p.id);
    const bloqueado = !!reservaVinculada && p.status !== 'activa';

    const controlEstado = bloqueado
      ? `<span class="status-locked ${p.status}" title="Estado bloqueado — eliminá la reserva para modificarlo">
           🔒 ${STATUS_LABELS[p.status]}
         </span>`
      : `<select class="status-select-inline ${p.status}"
           onchange="cambiarEstado(${p.id}, this)">
           <option value="activa"    ${p.status === 'activa'    ? 'selected' : ''}>Activa</option>
           <option value="reservada" ${p.status === 'reservada' ? 'selected' : ''}>Reservada</option>
           <option value="vendida"   ${p.status === 'vendida'   ? 'selected' : ''}>Vendida</option>
           <option value="alquilada" ${p.status === 'alquilada' ? 'selected' : ''}>Alquilada</option>
         </select>`;

    return `
    <div class="prop-card">
      <div class="prop-card-img">
        <div class="prop-badge ${STATUS_COLORES[p.status]}">${STATUS_LABELS[p.status]}</div>
        <span style="font-size:52px;z-index:1;position:relative;">${p.emoji}</span>
      </div>
      <div class="prop-card-body">
        <div class="prop-card-title">${p.titulo}</div>
        <div class="prop-card-addr">📍 ${p.direccion} — ${p.localidad}</div>
        <div class="prop-card-footer">
          <div class="prop-price">${p.precio}</div>
          ${controlEstado}
        </div>
      </div>
    </div>`;
  }).join('');
}

function cambiarEstado(id, sel) {
  const p = PROPIEDADES.find(x => x.id === id);
  if (!p) return;

  // Bloquear si tiene reserva vinculada y no está activa
  const reservaVinculada = reservas.find(r => r.prop_id === id);
  if (reservaVinculada && p.status !== 'activa') {
    showToast('⚠️ Estado bloqueado — eliminá la reserva para modificarlo', 'warning');
    sel.value = p.status; // revertir
    return;
  }

  p.status = sel.value;
  sel.className = `status-select-inline ${sel.value}`;

  renderPropiedades();
  renderDashboard();
  showToast(`✓ Estado actualizado: ${p.titulo} → ${STATUS_LABELS[sel.value]}`, 'success');
}
