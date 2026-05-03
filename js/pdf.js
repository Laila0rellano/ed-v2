/* ═══════════════════════════════════════
   PDF — Generación y Vista Previa
═══════════════════════════════════════ */

function verPDF(id) {
  abrirPDF(id);
}

function abrirPDF(id) {
  const r = reservas.find(x => x.id === id);
  if (!r) return;

  const hoy = new Date().toLocaleDateString('es-AR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
  const lugar = r.rp_lugar_firma || 'Córdoba';

  // ── Página 1 ──
  setPDF('pdf-fecha',           hoy);
  setPDF('pdf-agente',          currentAgent.name);
  setPDF('pdf-oferente-nombre', `${r.rof_nombre} ${r.rof_apellido}`);
  setPDF('pdf-oferente-dni',    r.rof_dni);
  setPDF('pdf-oferente-domicilio', r.rof_domicilio);
  setPDF('pdf-oferente-contacto',
    [r.rof_tel, r.rof_email].filter(Boolean).join(' / ')
  );
  setPDF('pdf-inmueble-dir',    r.rin_direccion);
  setPDF('pdf-inmueble-loc',    r.rin_localidad);
  setPDF('pdf-inmueble-mat',    r.rin_matricula);
  setPDF('pdf-inmueble-nom',    r.rin_nomenclatura);
  setPDF('pdf-inmueble-ter',    r.rin_sup_terreno);
  setPDF('pdf-inmueble-cub',    r.rin_sup_cubierta);
  setPDF('pdf-precio',          r.rp_precio_num);
  setPDF('pdf-precio-letras',   r.rp_precio_letras);
  setPDF('pdf-reserva-monto',   r.rres_monto_num);
  setPDF('pdf-reserva-tipo',    r.rres_tipo_doc);
  setPDF('pdf-plazo',           r.rp_plazo_escritura);
  setPDF('pdf-escribania',      r.rp_escribania);
  setPDF('pdf-vendedor-nombre', r.rv_nombre);
  setPDF('pdf-vendedor-dni',    r.rv_dni);
  setPDF('pdf-vendedor-dom',    r.rv_domicilio);
  setPDF('pdf-obs',             r.rp_comentarios_extra);
  setPDF('pdf-clausula-agente', currentAgent.name + ' — Edifica Inmobiliaria');
  setPDF('pdf-firma-oferente',  `${r.rof_nombre} ${r.rof_apellido} — DNI ${r.rof_dni}`);
  setPDF('pdf-firma-vendedor',  `${r.rv_nombre} — DNI ${r.rv_dni}`);
  setPDF('pdf-firma-agente',    currentAgent.name + ' — ' + currentAgent.mat);

  // ── Página 2 ──
  setPDF('pdf2-inmueble',       r.rin_direccion);
  setPDF('pdf2-vendedor',       r.rv_nombre);
  setPDF('pdf2-dir',            r.rin_direccion);
  setPDF('pdf2-oferente',       `${r.rof_nombre} ${r.rof_apellido}`);
  setPDF('pdf2-lugfecha',       `${lugar}, ${hoy}`);
  setPDF('pdf2-firma-vendedor', `${r.rv_nombre} — DNI ${r.rv_dni}`);
  setPDF('pdf2-firma-agente',   currentAgent.name + ' — ' + currentAgent.mat);

  document.getElementById('modal-pdf').classList.add('open');
}

function closePdf() {
  document.getElementById('modal-pdf').classList.remove('open');
}

/** Helper: setea textContent, fallback a '—' */
function setPDF(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val || '—';
}
