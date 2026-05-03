/* ═══════════════════════════════════════
   UTILS — Toast y helpers globales
═══════════════════════════════════════ */

let toastTimer;

/**
 * Muestra un toast de notificación.
 * @param {string} msg   Texto a mostrar
 * @param {string} type  'success' | 'warning' | 'info' | ''
 */
function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'show ' + type;

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.classList.remove('show');
  }, 4000);
}
