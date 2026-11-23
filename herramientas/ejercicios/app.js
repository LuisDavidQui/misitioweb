// -------------------------------------------------------------
// CARTILLA DIGITAL DE MECÁNICA DE FLUIDOS - LÓGICA DE CONTROL
// -------------------------------------------------------------

// Estado de la Aplicación
const state = {
  currentExerciseId: null,       // null muestra la portada de la cartilla
  filter: 'all',                 // filtro de tema activo
  searchQuery: '',               // búsqueda de texto activa
  studiedList: [],               // IDs de ejercicios estudiados (guardado en localStorage)
  theme: 'light',                // tema activo: 'light' o 'dark'
  exerciseInputs: {}             // Almacena valores actuales de inputs de cada ejercicio (id -> {name: value})
};

// Carga Inicial de Datos desde LocalStorage
function initApp() {
  // Cargar lista de estudiados
  const savedStudied = localStorage.getItem('fluid_studied_list');
  if (savedStudied) {
    try {
      state.studiedList = JSON.parse(savedStudied);
    } catch (e) {
      state.studiedList = [];
    }
  }

  // Cargar tema guardado o preferencia del sistema
  const savedTheme = localStorage.getItem('fluid_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  state.theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcons();

  // Inicializar inputs predeterminados para todos los ejercicios
  EXERCISES.forEach(ex => {
    state.exerciseInputs[ex.id] = {};
    ex.inputs.forEach(inp => {
      state.exerciseInputs[ex.id][inp.name] = inp.value;
    });
  });

  // Enlazar Eventos Globales
  setupEventListeners();

  // Renderizar la Interfaz Inicial
  updateProgressWidget();
  renderSidebar();
  renderContent();
}

// -------------------------------------------------------------
// VINCULACIÓN DE EVENTOS DE INTERFAZ
// -------------------------------------------------------------
function setupEventListeners() {
  // Toggle de Tema
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Botón de Impresión
  document.getElementById('print-page').addEventListener('click', () => {
    // Abrir todos los acordeones del ejercicio activo antes de imprimir
    const steps = document.querySelectorAll('.step-card');
    steps.forEach(step => step.classList.add('active'));
    window.print();
  });

  // Buscador de Ejercicios
  const searchInput = document.getElementById('exercise-search');
  searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderSidebar();
  });

  // Filtros por Categoría
  const filterTabs = document.querySelectorAll('.filter-tab');
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.filter = tab.getAttribute('data-filter');
      renderSidebar();
    });
  });

  // Botón de volver en móvil
  const mobileBackBtn = document.getElementById('mobile-back');
  mobileBackBtn.addEventListener('click', () => {
    state.currentExerciseId = null;
    document.querySelector('.app-sidebar').classList.remove('mobile-visible');
    renderContent();
  });
}

// -------------------------------------------------------------
// LÓGICA DE TEMA (CLARO / OSCURO)
// -------------------------------------------------------------
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('fluid_theme', state.theme);
  updateThemeIcons();
}

function updateThemeIcons() {
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  if (state.theme === 'light') {
    sunIcon.style.display = 'block';
    moonIcon.style.display = 'none';
  } else {
    sunIcon.style.display = 'none';
    moonIcon.style.display = 'block';
  }
}

// -------------------------------------------------------------
// CONTROL DE PROGRESO DE ESTUDIO
// -------------------------------------------------------------
function toggleStudied(exerciseId, event) {
  if (event) {
    event.stopPropagation(); // Evita abrir el ejercicio al hacer click en el check
  }
  
  const id = Number(exerciseId);
  const index = state.studiedList.indexOf(id);

  if (index === -1) {
    state.studiedList.push(id);
  } else {
    state.studiedList.splice(index, 1);
  }

  localStorage.setItem('fluid_studied_list', JSON.stringify(state.studiedList));
  updateProgressWidget();
  renderSidebar();

  // Si estamos en la página del ejercicio actual, actualizar botón de cabecera
  const checkBtn = document.getElementById('exercise-check-action');
  if (checkBtn && state.currentExerciseId === id) {
    const isChecked = state.studiedList.includes(id);
    checkBtn.textContent = isChecked ? '✓ Estudiado' : 'Marcar como estudiado';
    if (isChecked) {
      checkBtn.classList.remove('btn-outline');
      checkBtn.classList.add('btn-primary');
    } else {
      checkBtn.classList.remove('btn-primary');
      checkBtn.classList.add('btn-outline');
    }
  }
}

function updateProgressWidget() {
  const count = state.studiedList.length;
  const total = EXERCISES.length;
  const ratioText = `${count}/${total}`;
  const pct = (count / total) * 100;

  document.getElementById('progress-ratio').textContent = ratioText;
  document.getElementById('progress-fill').style.width = `${pct}%`;
}

// -------------------------------------------------------------
// RENDERIZADO DEL PANEL LATERAL (SIDEBAR)
// -------------------------------------------------------------
function renderSidebar() {
  const container = document.getElementById('exercise-list-container');
  container.innerHTML = '';

  const filtered = EXERCISES.filter(ex => {
    // Filtro por categoría
    const matchesCat = state.filter === 'all' || ex.category === state.filter;
    // Búsqueda por texto (título, concepto o enunciados)
    const matchesSearch = ex.title.toLowerCase().includes(state.searchQuery) ||
                          ex.concept.toLowerCase().includes(state.searchQuery) ||
                          ex.category.toLowerCase().includes(state.searchQuery);
    return matchesCat && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<p class="sidebar-empty">No se encontraron ejercicios.</p>`;
    return;
  }

  filtered.forEach(ex => {
    const isChecked = state.studiedList.includes(ex.id);
    const isActive = state.currentExerciseId === ex.id;
    
    const item = document.createElement('div');
    item.className = `exercise-item ${isActive ? 'active' : ''}`;
    item.setAttribute('data-cat', ex.category);
    item.addEventListener('click', () => selectExercise(ex.id));

    item.innerHTML = `
      <div class="exercise-checkbox-btn ${isChecked ? 'checked' : ''}" onclick="toggleStudied(${ex.id}, event)" title="Marcar como estudiado">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" style="display: ${isChecked ? 'block' : 'none'}">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
      <div class="exercise-item-info">
        <div class="exercise-item-meta">
          <span>${ex.category}</span>
          <span>${ex.difficulty}</span>
        </div>
        <span class="exercise-item-title">${ex.id}. ${ex.title}</span>
      </div>
    `;

    container.appendChild(item);
  });
}

function selectExercise(id) {
  state.currentExerciseId = id;
  // Ocultar barra lateral en móvil al seleccionar ejercicio
  if (window.innerWidth <= 600) {
    document.querySelector('.app-sidebar').classList.remove('mobile-visible');
  }
  renderSidebar();
  renderContent();
}

// -------------------------------------------------------------
// RENDERIZADO DEL PANEL DE DETALLE
// -------------------------------------------------------------
function renderContent() {
  const container = document.getElementById('booklet-page-view');
  container.innerHTML = '';

  // Ocultar botón volver por defecto en escritorio
  const mobileBackBtn = document.getElementById('mobile-back');
  mobileBackBtn.style.display = state.currentExerciseId ? 'inline-flex' : 'none';

  if (state.currentExerciseId === null) {
    renderBookletCover(container);
    return;
  }

  const ex = EXERCISES.find(e => e.id === state.currentExerciseId);
  if (!ex) return;

  const isChecked = state.studiedList.includes(ex.id);

  // Maquetar la Vista del Ejercicio
  const view = document.createElement('div');
  view.className = 'exercise-view';

  view.innerHTML = `
    <!-- Navegación de Ejercicio -->
    <div class="exercise-header-nav no-print">
      <div class="exercise-meta-info">
        <span class="category-tag" data-cat="${ex.category}">${ex.category}</span>
        <span class="difficulty-badge">${ex.difficulty}</span>
      </div>
      <div class="exercise-actions">
        <button id="exercise-check-action" class="btn ${isChecked ? 'btn-primary' : 'btn-outline'}">
          ${isChecked ? '✓ Estudiado' : 'Marcar como estudiado'}
        </button>
      </div>
    </div>

    <!-- Título principal -->
    <h2 class="exercise-main-title">${ex.id}. ${ex.title}</h2>

    <!-- Grid de Dos Columnas -->
    <div class="exercise-grid">
      
      <!-- Columna Izquierda: El problema y la teoría -->
      <div class="exercise-left-col">
        
        <!-- Enunciado -->
        <div class="booklet-card">
          <h3 class="card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            Enunciado del Problema
          </h3>
          <p class="statement-text">${ex.statement}</p>
        </div>

        <!-- Esquema Físico -->
        <div class="booklet-card">
          <h3 class="card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            Esquema Físico
          </h3>
          <div class="diagram-container" id="svg-diagram-wrapper">
            <!-- Cargado dinámicamente -->
          </div>
        </div>

        <!-- Concepto Clave -->
        <div class="booklet-card">
          <h3 class="card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9.663 17h4.673M12 3v1m6.364.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
            Concepto Clave (Cartilla Escolar)
          </h3>
          <p class="concept-text">${ex.concept}</p>
        </div>

      </div>

      <!-- Columna Derecha: Fórmula y Solución Dinámica -->
      <div class="exercise-right-col">
        
        <!-- Caja de Fórmulas -->
        <div class="booklet-card">
          <h3 class="card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20M4 19.5V3A2.5 2.5 0 0 1 6.5 0.5H20v16.5H6.5a2.5 2.5 0 0 0-2.5 2.5z"/>
            </svg>
            Fórmulas de Trabajo
          </h3>
          <div class="formula-display">
            $${ex.formula}$$
          </div>
        </div>

        <!-- Solución y Pasos -->
        <div class="booklet-card">
          <h3 class="card-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            Solución Detallada
          </h3>
          
          <div class="solution-steps" id="solution-steps-wrapper">
            <!-- Cargado dinámicamente -->
          </div>
        </div>

        <!-- Panel de Simulación / Calculadora -->
        <div class="booklet-card simulator-panel no-print">
          <h3 class="card-title simulator-title">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
              <line x1="9" y1="22" x2="15" y2="22"/>
              <line x1="8" y1="6" x2="16" y2="6"/>
              <line x1="16" y1="14" x2="16" y2="18"/>
            </svg>
            Calculadora Interactiva
          </h3>
          <form class="simulator-form" id="simulator-form-element" onsubmit="event.preventDefault();">
            <!-- Inputs dinámicos -->
          </form>
          <div class="simulator-actions">
            <button id="reset-inputs" class="btn btn-outline" title="Restaurar valores de fábrica">Restablecer</button>
            <button id="copy-summary" class="btn btn-primary" title="Copiar resultados al portapapeles">Copiar Resultados</button>
          </div>
        </div>

      </div>

    </div>
  `;

  container.appendChild(view);

  // Vincular check de estudiado dentro de la vista
  document.getElementById('exercise-check-action').addEventListener('click', () => {
    toggleStudied(ex.id);
  });

  // Generar campos de la calculadora
  buildCalculatorForm(ex);

  // Cargar cálculos por primera vez
  updateCalculations(ex);

  // Botón Restablecer
  document.getElementById('reset-inputs').addEventListener('click', () => {
    ex.inputs.forEach(inp => {
      state.exerciseInputs[ex.id][inp.name] = inp.value;
    });
    buildCalculatorForm(ex);
    updateCalculations(ex);
  });

  // Botón Copiar Solución
  document.getElementById('copy-summary').addEventListener('click', () => {
    const calc = ex.calculate(state.exerciseInputs[ex.id]);
    const textToCopy = `Ejercicio ${ex.id}: ${ex.title}\n\nEnunciado: ${ex.statement}\n\nDatos de entrada:\n${ex.inputs.map(inp => `- ${inp.label}: ${state.exerciseInputs[ex.id][inp.name]} ${inp.unit}`).join('\n')}\n\nResultado Final: ${calc.result.summary.replace(/\*\*/g, '')}`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      const btn = document.getElementById('copy-summary');
      const originalText = btn.innerHTML;
      btn.innerHTML = '¡Copiado! ✓';
      setTimeout(() => { btn.innerHTML = originalText; }, 2000);
    });
  });
}

// -------------------------------------------------------------
// RENDERIZADO DE LA PORTADA DEL LIBRO
// -------------------------------------------------------------
function renderBookletCover(container) {
  const cover = document.createElement('div');
  cover.className = 'booklet-cover';
  
  cover.innerHTML = `
    <span class="cover-badge">Mecánica de Fluidos</span>
    <h2 class="cover-title">Dinámica de Fluidos</h2>
    <p class="cover-subtitle">Guía de Aprendizaje e Investigación con 20 Ejercicios Resueltos e Interactivos paso a paso</p>
    
    <!-- Gráfico central en SVG -->
    <svg class="cover-graphic" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 21 3c-1.5 4-2 5.5-3.1 11.2A7 7 0 0 1 11 20z" />
      <path d="M9 22L11 20" />
      <path d="M11 20c2-3 4.5-5.5 7.5-7.5" />
    </svg>
    
    <div style="max-width: 600px; text-align: left; margin: 0 auto 30px auto; z-index: 2;">
      <h3 style="font-family: var(--font-serif); margin-bottom: 12px; font-size: 1.1rem; color: var(--color-primary);">¿Cómo usar esta cartilla digital?</h3>
      <p style="font-size: 0.88rem; color: var(--color-text-muted);">
        1. Explora el <strong>índice de ejercicios</strong> en el menú lateral. Están clasificados por tema y ordenados por su orden didáctico.
        <br>2. Cada ejercicio cuenta con un **esquema dinámico**, la fórmula de trabajo y la solución desglosada paso a paso.
        <br>3. Usa la **calculadora de simulación** para modificar los datos iniciales. Toda la solución y la animación física se recalcularán en tiempo real.
        <br>4. Puedes marcar los temas dominados como estudiados para monitorizar tu progreso o imprimir la guía como un cuadernillo impreso.
      </p>
    </div>
    
    <div class="cover-footer">
      Edición Educativa • Dinámica de Fluidos
    </div>
  `;
  
  container.appendChild(cover);
}

// -------------------------------------------------------------
// CONSTRUCCIÓN DEL FORMULARIO DE ENTRADA
// -------------------------------------------------------------
function buildCalculatorForm(exercise) {
  const form = document.getElementById('simulator-form-element');
  form.innerHTML = '';

  const values = state.exerciseInputs[exercise.id];

  exercise.inputs.forEach(inp => {
    const currentVal = values[inp.name];
    const group = document.createElement('div');
    group.className = 'input-group';

    group.innerHTML = `
      <div class="input-label-row">
        <label for="inp-${inp.name}">${inp.label}</label>
      </div>
      <div class="input-with-unit">
        <input type="number" id="num-${inp.name}" value="${currentVal}" min="${inp.min}" max="${inp.max}" step="${inp.step}">
        <span class="input-unit-label">${inp.unit}</span>
      </div>
      <input type="range" class="input-range" id="rng-${inp.name}" value="${currentVal}" min="${inp.min}" max="${inp.max}" step="${inp.step}">
    `;

    form.appendChild(group);

    // Sincronizar Número -> Slider e Historial
    const numInput = group.querySelector(`#num-${inp.name}`);
    const rngInput = group.querySelector(`#rng-${inp.name}`);

    numInput.addEventListener('input', (e) => {
      let val = Number(e.target.value);
      if (val < inp.min) val = inp.min;
      if (val > inp.max) val = inp.max;
      rngInput.value = val;
      state.exerciseInputs[exercise.id][inp.name] = val;
      updateCalculations(exercise);
    });

    // Sincronizar Slider -> Número e Historial
    rngInput.addEventListener('input', (e) => {
      const val = Number(e.target.value);
      numInput.value = val;
      state.exerciseInputs[exercise.id][inp.name] = val;
      updateCalculations(exercise);
    });
  });
}

// -------------------------------------------------------------
// LÓGICA DE RE-CÁLCULO Y RENDERIZADO MATEMÁTICO (KaTeX)
// -------------------------------------------------------------
function updateCalculations(exercise) {
  const currentValues = state.exerciseInputs[exercise.id];
  
  // Realizar cálculos físicos y matemáticos
  const calcResults = exercise.calculate(currentValues);

  // 1. Renderizar el diagrama SVG actualizado
  const diagContainer = document.getElementById('svg-diagram-wrapper');
  diagContainer.innerHTML = exercise.svgTemplate(calcResults.diagramData);

  // 2. Renderizar los pasos de solución paso a paso
  const stepsContainer = document.getElementById('solution-steps-wrapper');
  stepsContainer.innerHTML = '';

  calcResults.steps.forEach((step, idx) => {
    const isFirst = idx === 0;
    const stepCard = document.createElement('div');
    stepCard.className = `step-card ${isFirst ? 'active' : ''}`; // El primer paso se expande por defecto
    
    stepCard.innerHTML = `
      <div class="step-header">
        <span class="step-header-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--color-accent)" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          ${step.title}
        </span>
        <svg class="step-arrow-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      <div class="step-content">
        <p>${step.description}</p>
      </div>
    `;

    // Toggle expandir/colapsar
    stepCard.querySelector('.step-header').addEventListener('click', () => {
      stepCard.classList.toggle('active');
    });

    stepsContainer.appendChild(stepCard);
  });

  // 3. Agregar Tarjeta de Resultado Final
  const resultCard = document.createElement('div');
  resultCard.className = 'booklet-card result-card';
  resultCard.innerHTML = `
    <h3 class="card-title">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 11.08 20 22 4 22 2 11.08"/>
        <path d="M12 2v9"/>
      </svg>
      Resultado Final Obtenido
    </h3>
    <div class="result-value-container">
      <span class="result-number">${calcResults.result.value}</span>
      <span class="result-unit">${calcResults.result.unit}</span>
    </div>
    <p class="result-summary">${calcResults.result.summary}</p>
  `;
  stepsContainer.appendChild(resultCard);

  // 4. Invocar renderizador de LaTeX en tiempo real
  if (typeof renderMathInElement === 'function') {
    renderMathInElement(document.getElementById('booklet-page-view'), {
      delimiters: [
        {left: '$$', right: '$$', display: true},
        {left: '$', right: '$', display: false},
        {left: '\\(', right: '\\)', display: false},
        {left: '\\[', right: '\\]', display: true}
      ],
      throwOnError: false
    });
  }
}

// Inicializar la aplicación cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', initApp);
