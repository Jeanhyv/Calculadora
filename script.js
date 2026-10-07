const views = [...document.querySelectorAll('.view')];
const navButtons = [...document.querySelectorAll('[data-view]')];
const themeButtons = [document.getElementById('themeToggle'), document.getElementById('mobileThemeToggle')];
const toast = document.getElementById('toast');

function showView(viewId) {
  const target = document.getElementById(viewId);
  if (!target) return;

  views.forEach(view => view.classList.toggle('active', view === target));
  navButtons.forEach(button => button.classList.toggle('active', button.dataset.view === viewId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.title = `${target.querySelector('h1')?.textContent.trim() || 'Calculadora de Equilibrio'} · Calculadora de Equilibrio`;
}

navButtons.forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark');
  const desktopToggle = document.getElementById('themeToggle');
  desktopToggle?.setAttribute('aria-pressed', String(isDark));
  document.querySelectorAll('.theme-icon, #mobileThemeToggle').forEach(icon => { icon.textContent = isDark ? '☀' : '☾'; });
  const label = desktopToggle?.querySelector('span:nth-child(2)');
  if (label) label.textContent = isDark ? 'Modo claro' : 'Modo oscuro';
}

themeButtons.forEach(button => button?.addEventListener('click', toggleTheme));

let toastTimer;
document.querySelectorAll('.mock-action').forEach(button => button.addEventListener('click', () => {
  clearTimeout(toastTimer);
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}));

document.querySelectorAll('.filter-strip button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filter-strip button').forEach(item => item.classList.remove('active'));
  button.classList.add('active');
}));

// Interacciones ilustrativas exclusivas de la pantalla Calculadora.
const originAnalysisField = document.getElementById('originAnalysisField');
document.querySelectorAll('input[name="analysisType"]').forEach(input => input.addEventListener('change', () => {
  originAnalysisField.hidden = input.value !== 'simulation' || !input.checked;
}));

const costSuggestions = {
  'Cafetería y alimentos': ['Sugerencia para cafeterías y alimentos', 'Renta y salarios suelen clasificarse como costos fijos. Ingredientes y empaques suelen ser variables y unitarios.'],
  'Comercio minorista': ['Sugerencia para comercio minorista', 'Renta y nómina suelen ser costos fijos. Mercancía, comisiones y empaques suelen variar con cada venta.'],
  'Servicios profesionales': ['Sugerencia para servicios profesionales', 'Licencias y administración suelen ser costos fijos. Traslados e insumos por servicio pueden clasificarse como variables.'],
  'Manufactura': ['Sugerencia para manufactura', 'Maquinaria y renta suelen ser costos fijos. Materia prima y consumibles normalmente se registran como variables unitarios.']
};
document.getElementById('businessType')?.addEventListener('change', event => {
  const [title, copy] = costSuggestions[event.target.value];
  const guidance = document.getElementById('costGuidance');
  guidance.querySelector('strong').textContent = title;
  guidance.querySelector('p').textContent = copy;
});

function renumberRows(list) {
  list.querySelectorAll('.entry-index').forEach((index, position) => index.textContent = String(position + 1).padStart(2, '0'));
}

document.querySelectorAll('.add-row').forEach(button => button.addEventListener('click', () => {
  const isProduct = button.dataset.add === 'product';
  const list = document.getElementById(isProduct ? 'productList' : 'costList');
  const template = list.querySelector('.entry-row');
  const row = template.cloneNode(true);
  row.querySelectorAll('input').forEach(input => input.value = '');
  row.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
  list.appendChild(row);
  renumberRows(list);
}));

document.getElementById('calculadora')?.addEventListener('click', event => {
  const removeButton = event.target.closest('.remove-row');
  if (!removeButton) return;
  const list = removeButton.closest('.entry-list');
  if (list.querySelectorAll('.entry-row').length === 1) {
    clearTimeout(toastTimer);
    toast.textContent = 'El ejemplo conserva al menos una fila.';
    toast.classList.add('show');
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
      toast.textContent = 'Acción ilustrativa: este prototipo no procesa ni guarda datos.';
    }, 2200);
    return;
  }
  removeButton.closest('.entry-row').remove();
  renumberRows(list);
});
