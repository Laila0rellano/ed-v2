/* ═══════════════════════════════════════
   AUTH — Login / Logout / Agente
═══════════════════════════════════════ */

let currentAgent = {
  name: 'Martina Luzenti',
  initials: 'ML',
  mat: 'MAT. 3421'
};

function selectAgent(el, name, mat) {
  document.querySelectorAll('.agent-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  currentAgent = {
    name,
    mat,
    initials: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  };
}

function doLogin() {
  const pass = document.getElementById('login-pass').value;
  if (pass !== 'demo1234') {
    showToast('Contraseña incorrecta. Usá: demo1234', 'warning');
    return;
  }

  // Actualizar topbar con datos del agente
  document.getElementById('topbar-agent-name').textContent = currentAgent.name;
  document.getElementById('topbar-agent-mat').textContent  = currentAgent.mat;
  document.getElementById('topbar-avatar').textContent     = currentAgent.initials;

  // Dashboard saludo
  document.getElementById('dash-agente').textContent = currentAgent.name.split(' ')[0];

  // Cambiar pantalla
  document.getElementById('screen-login').classList.remove('active');
  document.getElementById('screen-portal').classList.add('active');

  // Renderizar vistas
  renderDashboard();
  renderPropiedades();
  renderReservas();
  updateDate();
}

function doLogout() {
  document.getElementById('screen-portal').classList.remove('active');
  document.getElementById('screen-login').classList.add('active');
}
