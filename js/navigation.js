/* ═══════════════════════════════════════
   NAVEGACIÓN — Views y Topbar
═══════════════════════════════════════ */

const VIEW_TITLES = {
  dashboard:   ['Resumen',      'Resumen de actividad'],
  propiedades: ['Propiedades',  'Gestión de cartera'],
  reservas:    ['Reservas',     'Documentos de reserva'],
};

function showView(name, navEl) {
  // Activar view
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + name).classList.add('active');

  // Activar nav item
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navEl) {
    navEl.classList.add('active');
  } else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if (n.textContent.trim().toLowerCase().includes(name)) {
        n.classList.add('active');
      }
    });
  }

  // Actualizar topbar
  const t = VIEW_TITLES[name] || [name, ''];
  document.getElementById('topbar-title').textContent = t[0];
  document.getElementById('topbar-sub').textContent   = t[1];
}

function updateDate() {
  const d = new Date();
  const fecha = d.toLocaleDateString('es-AR', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const el = document.getElementById('topbar-date');
  if (el) el.textContent = fecha;
}

document.addEventListener('DOMContentLoaded', updateDate);
