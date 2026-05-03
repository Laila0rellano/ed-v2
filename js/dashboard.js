/* ═══════════════════════════════════════
   DASHBOARD — Render
═══════════════════════════════════════ */

function renderDashboard() {
  // Contadores de estado
  const counts = { activa: 0, reservada: 0, vendida: 0, alquilada: 0 };
  PROPIEDADES.forEach(p => counts[p.status]++);

  document.getElementById('stat-activas').textContent        = counts.activa;
  document.getElementById('stat-vendidas').textContent       = counts.vendida;
  document.getElementById('stat-reservas-count').textContent = reservas.length;

  // Mini propiedades
  const mp = document.getElementById('dash-props-mini');
  mp.innerHTML = PROPIEDADES.slice(0, 4).map(p => `
    <div class="prop-mini">
      <div class="prop-mini-img">${p.emoji}</div>
      <div class="prop-mini-info">
        <strong>${p.titulo}</strong>
        <span>${p.direccion}</span>
      </div>
      <div class="prop-mini-price">${p.precio}</div>
    </div>
  `).join('');

  // Mini reservas
  const mr = document.getElementById('dash-res-mini');
  if (!reservas.length) {
    mr.innerHTML = '<div class="empty-state" style="padding:24px"><p>No hay reservas aún.</p></div>';
    return;
  }
  mr.innerHTML = [...reservas].slice(-3).reverse().map(r => `
    <div class="prop-mini">
      <div class="prop-mini-img">📄</div>
      <div class="prop-mini-info">
        <strong>${r.rof_apellido}, ${r.rof_nombre}</strong>
        <span>${r.rin_direccion}</span>
      </div>
      <div class="prop-mini-price" style="font-size:12px;color:var(--c-muted)">${r.fecha}</div>
    </div>
  `).join('');
}
