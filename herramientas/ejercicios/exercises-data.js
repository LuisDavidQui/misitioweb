// Base de datos de ejercicios de Mecánica de Fluidos (Dinámica de Fluidos)
// Estructurado para el renderizado dinámico y recálculo en la cartilla escolar interactiva.

const EXERCISES = [
  // ==========================================
  // BLOQUE A: ECUACIÓN DE CONTINUIDAD (1 - 5)
  // ==========================================
  {
    id: 1,
    category: "continuidad",
    title: "Reducción de Tubería de Agua",
    difficulty: "Fácil",
    concept: "La masa de fluido que entra en un tubo debe ser igual a la que sale (conservación de la masa). Si la sección transversal disminuye, la velocidad debe aumentar proporcionalmente para mantener el mismo caudal.",
    formula: "A_1 \\cdot v_1 = A_2 \\cdot v_2",
    statement: "El agua fluye por una tubería de sección circular con un diámetro inicial $D_1$ a una velocidad $v_1$. Si la tubería se reduce a un diámetro menor $D_2$, calcula la velocidad de salida del agua $v_2$.",
    inputs: [
      { name: "d1", label: "Diámetro Entrada (D₁)", value: 4.0, unit: "cm", min: 0.5, max: 20.0, step: 0.1 },
      { name: "v1", label: "Velocidad Entrada (v₁)", value: 1.5, unit: "m/s", min: 0.1, max: 10.0, step: 0.1 },
      { name: "d2", label: "Diámetro Salida (D₂)", value: 2.0, unit: "cm", min: 0.2, max: 19.9, step: 0.1 }
    ],
    calculate: (inputs) => {
      const d1 = Number(inputs.d1);
      const v1 = Number(inputs.v1);
      const d2 = Number(inputs.d2);

      const r1 = (d1 / 100) / 2; // m
      const r2 = (d2 / 100) / 2; // m
      const a1 = Math.PI * r1 * r1; // m2
      const a2 = Math.PI * r2 * r2; // m2
      const v2 = (a1 * v1) / a2; // m/s
      const q = a1 * v1; // m3/s
      const qLpm = q * 1000 * 60; // L/min

      return {
        steps: [
          {
            title: "1. Identificación y Conversión al S.I.",
            description: `Convertimos los diámetros a metros y calculamos los radios:
            <br>• $D_1 = ${d1} \\text{ cm} = ${(d1/100).toFixed(4)} \\text{ m}$ $\\rightarrow r_1 = ${r1.toFixed(4)} \\text{ m}$
            <br>• $D_2 = ${d2} \\text{ cm} = ${(d2/100).toFixed(4)} \\text{ m}$ $\\rightarrow r_2 = ${r2.toFixed(4)} \\text{ m}$`
          },
          {
            title: "2. Cálculo de Áreas Transversales ($A = \\pi r^2$)",
            description: `Calculamos las áreas circulares para cada sección de la tubería:
            <br>• $A_1 = \\pi \\cdot (${r1.toFixed(4)} \\text{ m})^2 = ${a1.toExponential(4)} \\text{ m}^2$
            <br>• $A_2 = \\pi \\cdot (${r2.toFixed(4)} \\text{ m})^2 = ${a2.toExponential(4)} \\text{ m}^2$`
          },
          {
            title: "3. Aplicación de la Ecuación de Continuidad",
            description: `A partir de la ecuación de continuidad $A_1 v_1 = A_2 v_2$, despejamos $v_2$:
            <br>$$v_2 = \\frac{A_1 \\cdot v_1}{A_2}$$
            <br>Sustituyendo los valores numéricos:
            <br>$$v_2 = \\frac{(${a1.toExponential(4)} \\text{ m}^2) \\cdot (${v1.toFixed(2)} \\text{ m/s})}{${a2.toExponential(4)} \\text{ m}^2}$$
            <br>$$v_2 = ${v2.toFixed(3)} \\text{ m/s}$$`
          },
          {
            title: "4. Caudal Volumétrico de Control (Opcional)",
            description: `El caudal circulante ($Q$) que permanece constante es:
            <br>$$Q = A_1 \\cdot v_1 = (${a1.toExponential(4)} \\text{ m}^2) \\cdot (${v1.toFixed(2)} \\text{ m/s}) = ${q.toExponential(4)} \\text{ m}^3/s \\approx ${qLpm.toFixed(2)} \\text{ L/min}$$`
          }
        ],
        result: {
          value: v2.toFixed(2),
          unit: "m/s",
          summary: `La velocidad de salida del fluido en la sección reducida es de **${v2.toFixed(2)} m/s**.`
        },
        diagramData: { d1, d2, v1, v2 }
      };
    },
    svgTemplate: (data) => {
      const d1H = Math.min(80, Math.max(30, data.d1 * 10));
      const d2H = Math.min(80, Math.max(15, data.d2 * 10));
      const speedFactor = Math.min(5, Math.max(0.5, data.v2 / data.v1));
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <defs>
            <linearGradient id="blueFluid" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--color-primary-light)" stop-opacity="0.3"/>
              <stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.5"/>
            </linearGradient>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 2 L 10 5 L 0 8 z" fill="var(--color-primary)" />
            </marker>
          </defs>
          <path d="M 50 ${80 - d1H/2} L 180 ${80 - d1H/2} C 220 ${80 - d1H/2}, 220 ${80 - d2H/2}, 260 ${80 - d2H/2} L 350 ${80 - d2H/2} 
                   L 350 ${80 + d2H/2} C 220 ${80 + d2H/2}, 220 ${80 + d1H/2}, 180 ${80 + d1H/2} L 50 ${80 + d1H/2} Z" 
                fill="url(#blueFluid)" stroke="var(--color-border-dark)" stroke-width="2.5" />
          <path d="M 60 80 L 330 80" stroke="var(--color-primary-dark)" stroke-width="2.5" stroke-dasharray="10 12" marker-end="url(#arrow)">
            <animate attributeName="stroke-dashoffset" values="220;0" dur="${4/speedFactor}s" repeatCount="indefinite" />
          </path>
          <text x="60" y="${80 - d1H/2 - 10}" fill="var(--color-text)" font-weight="600" font-size="12">D₁ = ${data.d1} cm</text>
          <text x="60" y="${80 + d1H/2 + 20}" fill="var(--color-primary-dark)" font-size="12" font-style="italic">v₁ = ${data.v1} m/s</text>
          <text x="270" y="${80 - d2H/2 - 10}" fill="var(--color-text)" font-weight="600" font-size="12">D₂ = ${data.d2} cm</text>
          <text x="270" y="${80 + d2H/2 + 20}" fill="var(--color-primary-dark)" font-size="12" font-style="italic">v₂ = ${data.v2.toFixed(2)} m/s</text>
        </svg>`;
    }
  },
  {
    id: 2,
    category: "continuidad",
    title: "Jeringa Hipodérmica",
    difficulty: "Fácil",
    concept: "Debido a la gran diferencia entre el área del émbolo y el área de la aguja, una velocidad de empuje muy lenta del émbolo genera una gran velocidad de chorro en el extremo de la aguja.",
    formula: "A_e \\cdot v_e = A_a \\cdot v_a",
    statement: "Un enfermero empuja el émbolo de una jeringa de diámetro $D_e$ con una velocidad constante de $v_e$. La jeringa termina en una aguja de diámetro interno $D_a$. Calcula la velocidad $v_a$ con la que sale la solución salina por la aguja.",
    inputs: [
      { name: "de", label: "Diámetro Émbolo (Dₑ)", value: 1.2, unit: "cm", min: 0.5, max: 3.0, step: 0.1 },
      { name: "ve", label: "Velocidad Émbolo (vₑ)", value: 1.0, unit: "cm/s", min: 0.1, max: 5.0, step: 0.1 },
      { name: "da", label: "Diámetro Aguja (Dₐ)", value: 0.8, unit: "mm", min: 0.2, max: 2.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const de = Number(inputs.de); // cm
      const ve = Number(inputs.ve) / 100; // m/s
      const da = Number(inputs.da) / 1000; // m

      const re = (de / 100) / 2; // m
      const ra = da / 2; // m
      const ae = Math.PI * re * re; // m2
      const aa = Math.PI * ra * ra; // m2
      const va = (ae * ve) / aa; // m/s

      return {
        steps: [
          {
            title: "1. Conversiones Básicas al S.I.",
            description: `Convertimos dimensiones y velocidades a metros y segundos:
            <br>• $D_e = ${de} \\text{ cm} = ${(de/100).toFixed(4)} \\text{ m}$ (Radio $r_e = ${re.toFixed(4)} \\text{ m}$)
            <br>• $v_e = ${inputs.ve} \\text{ cm/s} = ${ve.toFixed(4)} \\text{ m/s}$
            <br>• $D_a = ${inputs.da} \\text{ mm} = ${da.toFixed(5)} \\text{ m}$ (Radio $r_a = ${ra.toFixed(5)} \\text{ m}$)`
          },
          {
            title: "2. Áreas Seccionales ($A = \\pi r^2$)",
            description: `Calculamos la sección transversal del cuerpo de la jeringa ($A_e$) y del capilar de la aguja ($A_a$):
            <br>• $A_e = \\pi \\cdot (${re.toFixed(4)})^2 = ${ae.toExponential(4)} \\text{ m}^2$
            <br>• $A_a = \\pi \\cdot (${ra.toFixed(5)})^2 = ${aa.toExponential(4)} \\text{ m}^2$`
          },
          {
            title: "3. Obtención de la Velocidad en la Aguja",
            description: `Aplicando la continuidad:
            <br>$$v_a = \\frac{A_e \\cdot v_e}{A_a} = \\frac{(${ae.toExponential(4)} \\text{ m}^2) \\cdot (${ve.toFixed(4)} \\text{ m/s})}{${aa.toExponential(4)} \\text{ m}^2}$$
            <br>$$v_a = ${va.toFixed(3)} \\text{ m/s}$$`
          }
        ],
        result: {
          value: va.toFixed(2),
          unit: "m/s",
          summary: `La velocidad del chorro saliendo de la aguja es de **${va.toFixed(2)} m/s** (unos ${(va * 3.6).toFixed(1)} km/h).`
        },
        diagramData: { de, da, ve: Number(inputs.ve), va }
      };
    },
    svgTemplate: (data) => {
      const we = Math.min(60, Math.max(25, data.de * 20));
      const wa = Math.max(4, data.da * 6);
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <defs>
            <linearGradient id="saline" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#e0f7fa" stop-opacity="0.5"/>
              <stop offset="100%" stop-color="#80deea" stop-opacity="0.7"/>
            </linearGradient>
          </defs>
          <!-- Cuerpo de la Jeringa -->
          <rect x="50" y="${80 - we/2}" width="160" height="${we}" fill="url(#saline)" stroke="var(--color-border-dark)" stroke-width="2" />
          <!-- Émbolo móvil -->
          <rect x="25" y="${80 - we/2 + 2}" width="25" height="${we - 4}" fill="#ccc" stroke="#888" />
          <line x1="10" y1="80" x2="25" y2="80" stroke="#888" stroke-width="6" />
          <!-- Reducción y aguja -->
          <path d="M 210 ${80 - we/2} L 240 ${80 - wa/2} L 310 ${80 - wa/2} L 310 ${80 + wa/2} L 240 ${80 + wa/2} L 210 ${80 + we/2} Z" fill="url(#saline)" stroke="var(--color-border-dark)" stroke-width="2" />
          <!-- Aguja metálica -->
          <rect x="310" y="${80 - wa/2}" width="50" height="${wa}" fill="#b0bec5" stroke="#546e7a" stroke-width="0.5"/>
          <!-- Chorro de agua -->
          <path d="M 360 80 Q 380 80 400 95" stroke="#00e5ff" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/>
          <text x="70" y="${80 - we/2 - 10}" fill="var(--color-text)" font-size="11">Jeringa Dₑ = ${data.de} cm</text>
          <text x="310" y="${80 - 10}" fill="var(--color-text)" font-size="10">Dₐ = ${data.da} mm</text>
          <text x="120" y="${80 + we/2 + 20}" fill="var(--color-primary)" font-size="11" font-weight="bold">vₐ = ${data.va.toFixed(2)} m/s</text>
        </svg>`;
    }
  },
  {
    id: 3,
    category: "continuidad",
    title: "Boquilla para Manguera de Riego",
    difficulty: "Fácil",
    concept: "Al colocar el dedo o una boquilla estrecha en una manguera de jardín, bloqueamos parte del área de flujo. Para mantener constante el caudal que viene de la red de agua, la velocidad del chorro debe aumentar.",
    formula: "v_2 = v_1 \\cdot \\left(\\frac{D_1}{D_2}\\right)^2",
    statement: "Una manguera de jardín con diámetro interno $D_1$ transporta agua a una velocidad de $v_1$. Para regar plantas lejanas se conecta una boquilla cónica con un diámetro de salida de $D_2$. Determina la velocidad del chorro a la salida de la boquilla.",
    inputs: [
      { name: "d1", label: "Diámetro Manguera (D₁)", value: 2.0, unit: "cm", min: 1.0, max: 5.0, step: 0.1 },
      { name: "v1", label: "Velocidad Manguera (v₁)", value: 1.2, unit: "m/s", min: 0.1, max: 5.0, step: 0.1 },
      { name: "d2", label: "Diámetro Boquilla (D₂)", value: 0.6, unit: "cm", min: 0.2, max: 1.8, step: 0.1 }
    ],
    calculate: (inputs) => {
      const d1 = Number(inputs.d1);
      const v1 = Number(inputs.v1);
      const d2 = Number(inputs.d2);

      const ratio = d1 / d2;
      const v2 = v1 * ratio * ratio;
      const a1 = Math.PI * Math.pow((d1/200), 2);
      const q = a1 * v1; // m3/s
      const qLpm = q * 60000;

      return {
        steps: [
          {
            title: "1. Simplificación Algebraica",
            description: `Si sustituimos las expresiones de área circulares ($A = \\pi D^2 / 4$) en la ecuación de continuidad:
            <br>$$\\frac{\\pi D_1^2}{4} v_1 = \\frac{\\pi D_2^2}{4} v_2$$
            <br>Simplificando las constantes $\\pi$ y $4$, nos queda:
            <br>$$D_1^2 \\cdot v_1 = D_2^2 \\cdot v_2$$
            <br>$$v_2 = v_1 \\cdot \\left(\\frac{D_1}{D_2}\\right)^2$$
            <br>Esta forma nos evita calcular las áreas si ambos diámetros tienen la misma unidad.`
          },
          {
            title: "2. Sustitución de Valores",
            description: `Sustituimos el diámetro de entrada $D_1 = ${d1}\\text{ cm}$ y el de salida $D_2 = ${d2}\\text{ cm}$:
            <br>$$v_2 = ${v1.toFixed(2)} \\text{ m/s} \\cdot \\left(\\frac{${d1} \\text{ cm}}{${d2} \\text{ cm}}\\right)^2$$
            <br>$$v_2 = ${v1.toFixed(2)} \\text{ m/s} \\cdot (${ratio.toFixed(3)})^2$$
            <br>$$v_2 = ${v1.toFixed(2)} \\cdot ${Math.pow(ratio, 2).toFixed(3)} = ${v2.toFixed(3)} \\text{ m/s}$$`
          },
          {
            title: "3. Caudal de riego",
            description: `El caudal suministrado es constante e igual a:
            <br>$$Q = A_1 v_1 = \\pi \\cdot (${(d1/200).toFixed(4)} \\text{ m})^2 \\cdot ${v1.toFixed(2)} \\text{ m/s} = ${q.toExponential(4)} \\text{ m}^3/s \\approx ${qLpm.toFixed(2)} \\text{ L/min}$$`
          }
        ],
        result: {
          value: v2.toFixed(2),
          unit: "m/s",
          summary: `El agua se acelera en la boquilla alcanzando los **${v2.toFixed(2)} m/s**.`
        },
        diagramData: { d1, d2, v1, v2 }
      };
    },
    svgTemplate: (data) => {
      const h1 = Math.min(65, Math.max(30, data.d1 * 18));
      const h2 = Math.min(30, Math.max(10, data.d2 * 18));
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <path d="M 50 ${80 - h1/2} L 220 ${80 - h1/2} L 260 ${80 - h2/2} L 300 ${80 - h2/2} 
                   L 300 ${80 + h2/2} L 260 ${80 + h2/2} L 220 ${80 + h1/2} L 50 ${80 + h1/2} Z" 
                fill="rgba(33, 150, 243, 0.4)" stroke="var(--color-text)" stroke-width="2.5" />
          <path d="M 300 80 Q 340 75 390 100" stroke="#0288d1" stroke-width="2.5" fill="none" stroke-dasharray="3 3"/>
          <path d="M 300 ${80 - h2/4} Q 330 ${85 - h2/4} 380 90" stroke="#0288d1" stroke-width="1.5" fill="none" stroke-dasharray="3 3"/>
          <text x="60" y="${80 - h1/2 - 10}" fill="var(--color-text)" font-size="11">Manguera D₁ = ${data.d1} cm</text>
          <text x="240" y="${80 - h2/2 - 12}" fill="var(--color-text)" font-size="11">Salida D₂ = ${data.d2} cm</text>
          <text x="120" y="85" fill="var(--color-text)" font-size="11">v₁ = ${data.v1} m/s</text>
          <text x="310" y="65" fill="var(--color-primary)" font-weight="bold" font-size="12">v₂ = ${data.v2.toFixed(2)} m/s</text>
        </svg>`;
    }
  },
  {
    id: 4,
    category: "continuidad",
    title: "Ramificación Capilar de la Aorta",
    difficulty: "Media",
    concept: "La sangre bombeada por el corazón viaja por una única gran arteria (la aorta). Aunque cada capilar individual es microscópico, el número de ellos es tan inmenso que el área total sumada es muy grande, lo que ralentiza la sangre para permitir el intercambio de nutrientes.",
    formula: "A_{aorta} \\cdot v_{aorta} = N \\cdot A_{capilar} \\cdot v_{capilar} = A_{total} \\cdot v_{capilar}",
    statement: "La arteria aorta de una persona adulta tiene un radio interior $R_a$. La sangre circula por ella con una velocidad de $v_a$. Esta arteria se ramifica finalmente en millones de capilares microscópicos que en conjunto presentan un área transversal total sumada de $A_{tot}$. Determina la velocidad media $v_c$ a la que viaja la sangre en la red capilar.",
    inputs: [
      { name: "ra", label: "Radio de Aorta (Rₐ)", value: 1.0, unit: "cm", min: 0.5, max: 2.0, step: 0.1 },
      { name: "va", label: "Velocidad Aorta (vₐ)", value: 30.0, unit: "cm/s", min: 10.0, max: 80.0, step: 1.0 },
      { name: "atot", label: "Área Capilar Total (A_tot)", value: 2000.0, unit: "cm²", min: 500.0, max: 5000.0, step: 50.0 }
    ],
    calculate: (inputs) => {
      const ra = Number(inputs.ra); // cm
      const va = Number(inputs.va) / 100; // m/s
      const atot = Number(inputs.atot) / 10000; // m2

      const raM = ra / 100;
      const aaorta = Math.PI * raM * raM;
      const vc = (aaorta * va) / atot; // m/s
      const vcCms = vc * 100; // cm/s

      return {
        steps: [
          {
            title: "1. Cálculo de la Sección Transversal de la Aorta",
            description: `El radio de la aorta es de $R_a = ${ra} \\text{ cm} = ${raM.toFixed(3)} \\text{ m}$. Su área transversal circular es:
            <br>$$A_{aorta} = \\pi \\cdot R_a^2 = \\pi \\cdot (${raM.toFixed(3)} \\text{ m})^2 = ${aaorta.toExponential(4)} \\text{ m}^2$$`
          },
          {
            title: "2. Conversión del Área Total de los Capilares",
            description: `El área sumada de toda la red capilar está expresada en $\\text{cm}^2$. Recordando que $1 \\text{ m}^2 = 10,000 \\text{ cm}^2$:
            <br>$$A_{tot} = ${inputs.atot} \\text{ cm}^2 = \\frac{${inputs.atot}}{10000} \\text{ m}^2 = ${atot.toFixed(4)} \\text{ m}^2$$`
          },
          {
            title: "3. Igualación del Caudal Sanguíneo",
            description: `El caudal total que pasa por la aorta es el mismo que se distribuye por todos los capilares a la vez:
            <br>$$Q = A_{aorta} \\cdot v_{aorta} = A_{tot} \\cdot v_{capilar}$$
            <br>Despejamos la velocidad en los capilares $v_{capilar}$:
            <br>$$v_{capilar} = \\frac{A_{aorta} \\cdot v_{aorta}}{A_{tot}}$$
            <br>$$v_{capilar} = \\frac{(${aaorta.toExponential(4)} \\text{ m}^2) \\cdot (${va.toFixed(2)} \\text{ m/s})}{${atot.toFixed(4)} \\text{ m}^2} = ${vc.toExponential(4)} \\text{ m/s}$$
            <br>Convertido a milímetros por segundo:
            <br>$$v_{capilar} = ${(vc * 1000).toFixed(3)} \\text{ mm/s} \\approx ${vcCms.toFixed(3)} \\text{ cm/s}$$`
          }
        ],
        result: {
          value: (vc * 1000).toFixed(2),
          unit: "mm/s",
          summary: `La velocidad media de la sangre en los capilares disminuye hasta **${(vc * 1000).toFixed(2)} mm/s**.`
        },
        diagramData: { ra, va: Number(inputs.va), atot: Number(inputs.atot), vcCms }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <defs>
            <linearGradient id="blood" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#d32f2f" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#f44336" stop-opacity="0.6"/>
            </linearGradient>
          </defs>
          <!-- Arteria principal -->
          <rect x="40" y="60" width="100" height="40" fill="url(#blood)" stroke="#b71c1c" stroke-width="2"/>
          <text x="45" y="50" fill="var(--color-text)" font-size="11">Aorta (R=${data.ra} cm)</text>
          <!-- Ramificaciones -->
          <path d="M 140 60 C 180 60, 200 30, 240 30" stroke="#b71c1c" stroke-width="4" fill="none"/>
          <path d="M 140 80 C 180 80, 200 80, 240 80" stroke="#b71c1c" stroke-width="4" fill="none"/>
          <path d="M 140 100 C 180 100, 200 130, 240 130" stroke="#b71c1c" stroke-width="4" fill="none"/>
          <!-- Capilares diminutos -->
          <line x1="240" y1="30" x2="330" y2="20" stroke="#f44336" stroke-width="1.5"/>
          <line x1="240" y1="30" x2="330" y2="40" stroke="#f44336" stroke-width="1.5"/>
          <line x1="240" y1="80" x2="330" y2="70" stroke="#f44336" stroke-width="1.5"/>
          <line x1="240" y1="80" x2="330" y2="90" stroke="#f44336" stroke-width="1.5"/>
          <line x1="240" y1="130" x2="330" y2="120" stroke="#f44336" stroke-width="1.5"/>
          <line x1="240" y1="130" x2="330" y2="140" stroke="#f44336" stroke-width="1.5"/>
          
          <text x="240" y="15" fill="var(--color-text)" font-size="11">Red Capilar Total</text>
          <text x="240" y="105" fill="var(--color-primary)" font-weight="bold" font-size="11">v_cap ≈ ${data.vcCms.toFixed(3)} cm/s</text>
        </svg>`;
    }
  },
  {
    id: 5,
    category: "continuidad",
    title: "Canal Rectangular de Irrigación",
    difficulty: "Media",
    concept: "La ecuación de continuidad también se aplica a canales abiertos. En este caso, el área de flujo rectangular depende del ancho del canal y de la profundidad del agua. Si el canal se estrecha y el nivel baja, la velocidad del caudal de agua aumenta drásticamente.",
    formula: "w_1 \\cdot h_1 \\cdot v_1 = w_2 \\cdot h_2 \\cdot v_2",
    statement: "Un canal rectangular de irrigación conduce agua de riego. En una sección, el canal tiene un ancho $w_1$ y el agua una profundidad $h_1$, moviéndose a una velocidad $v_1$. Río abajo, el canal se estrecha a un ancho $w_2$ y la profundidad disminuye a $h_2$. Encuentra la velocidad del agua $v_2$ en la segunda sección.",
    inputs: [
      { name: "w1", label: "Ancho Inicial (w₁)", value: 3.0, unit: "m", min: 1.0, max: 10.0, step: 0.1 },
      { name: "h1", label: "Profundidad Inicial (h₁)", value: 1.2, unit: "m", min: 0.2, max: 5.0, step: 0.1 },
      { name: "v1", label: "Velocidad Inicial (v₁)", value: 0.5, unit: "m/s", min: 0.1, max: 4.0, step: 0.1 },
      { name: "w2", label: "Ancho Final (w₂)", value: 1.5, unit: "m", min: 0.5, max: 9.0, step: 0.1 },
      { name: "h2", label: "Profundidad Final (h₂)", value: 0.8, unit: "m", min: 0.1, max: 4.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const w1 = Number(inputs.w1);
      const h1 = Number(inputs.h1);
      const v1 = Number(inputs.v1);
      const w2 = Number(inputs.w2);
      const h2 = Number(inputs.h2);

      const a1 = w1 * h1;
      const a2 = w2 * h2;
      const v2 = (a1 * v1) / a2;
      const q = a1 * v1;

      return {
        steps: [
          {
            title: "1. Cálculo de las Áreas Rectangulares ($A = w \\cdot h$)",
            description: `El área de flujo en canales abiertos es la sección transversal del líquido (ancho por profundidad):
            <br>• $A_1 = w_1 \\cdot h_1 = ${w1.toFixed(1)} \\text{ m} \\cdot ${h1.toFixed(1)} \\text{ m} = ${a1.toFixed(2)} \\text{ m}^2$
            <br>• $A_2 = w_2 \\cdot h_2 = ${w2.toFixed(1)} \\text{ m} \\cdot ${h2.toFixed(1)} \\text{ m} = ${a2.toFixed(2)} \\text{ m}^2$`
          },
          {
            title: "2. Aplicación de la Conservación de Caudal",
            description: `El caudal volumétrico ($Q$) es constante:
            <br>$$Q = A_1 \\cdot v_1 = ${a1.toFixed(2)} \\text{ m}^2 \\cdot ${v1.toFixed(2)} \\text{ m/s} = ${q.toFixed(2)} \\text{ m}^3/s$$
            <br>Igualando para la segunda sección:
            <br>$$A_1 v_1 = A_2 v_2 \\rightarrow v_2 = \\frac{Q}{A_2}$$
            <br>$$v_2 = \\frac{${q.toFixed(2)} \\text{ m}^3/s}{${a2.toFixed(2)} \\text{ m}^2} = ${v2.toFixed(3)} \\text{ m/s}$$`
          }
        ],
        result: {
          value: v2.toFixed(2),
          unit: "m/s",
          summary: `La velocidad del agua en el tramo angosto del canal es de **${v2.toFixed(2)} m/s**.`
        },
        diagramData: { w1, h1, w2, h2, v1, v2 }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Entrada Canal -->
          <polygon points="40,110 160,110 160,40 40,40" fill="#e0f2f1" stroke="#00796b" stroke-width="1.5"/>
          <line x1="40" y1="110" x2="160" y2="110" stroke="#004d40" stroke-width="3"/>
          <text x="45" y="35" fill="var(--color-text)" font-size="10">Entrada: ${data.w1}m x ${data.h1}m</text>
          
          <!-- Unión / Conector -->
          <polygon points="160,110 240,120 240,70 160,40" fill="rgba(0, 150, 136, 0.15)" stroke="#00796b" stroke-dasharray="2 2"/>
          
          <!-- Salida Canal -->
          <polygon points="240,120 340,120 340,70 240,70" fill="#b2dfdb" stroke="#00796b" stroke-width="1.5"/>
          <line x1="240" y1="120" x2="340" y2="120" stroke="#004d40" stroke-width="3"/>
          <text x="235" y="65" fill="var(--color-text)" font-size="10">Salida: ${data.w2}m x ${data.h2}m</text>

          <text x="60" y="80" fill="var(--color-primary-dark)" font-size="11">v₁ = ${data.v1} m/s</text>
          <text x="250" y="100" fill="var(--color-primary-dark)" font-weight="bold" font-size="11">v₂ = ${data.v2.toFixed(2)} m/s</text>
        </svg>`;
    }
  },

  // ==========================================
  // BLOQUE B: ECUACIÓN DE BERNOULLI (6 - 10)
  // ==========================================
  {
    id: 6,
    category: "bernoulli",
    title: "Presión en Tubo Horizontal",
    difficulty: "Media",
    concept: "Para un tubo perfectamente horizontal, las alturas son iguales. La ecuación de Bernoulli demuestra que en el estrechamiento donde la velocidad aumenta, la presión debe disminuir. Esto se conoce como la paradoja de la presión hidrodinámica.",
    formula: "P_1 + \\frac{1}{2}\\rho v_1^2 = P_2 + \\frac{1}{2}\\rho v_2^2",
    statement: "Por una tubería horizontal fluye agua (densidad $\\rho = 1000 \\text{ kg/m}^3$). En la sección 1, de diámetro $D_1$, la velocidad es $v_1$ y la presión manométrica es $P_1$. En la sección 2, el diámetro se reduce a $D_2$. Determina la presión manométrica $P_2$ en este estrechamiento.",
    inputs: [
      { name: "d1", label: "Diámetro Entrada (D₁)", value: 10.0, unit: "cm", min: 2.0, max: 50.0, step: 0.5 },
      { name: "v1", label: "Velocidad Entrada (v₁)", value: 2.0, unit: "m/s", min: 0.2, max: 10.0, step: 0.1 },
      { name: "p1", label: "Presión Entrada (P₁)", value: 150.0, unit: "kPa", min: 50.0, max: 500.0, step: 5.0 },
      { name: "d2", label: "Diámetro Estrecho (D₂)", value: 5.0, unit: "cm", min: 1.0, max: 49.0, step: 0.5 }
    ],
    calculate: (inputs) => {
      const rho = 1000; // kg/m3 (agua)
      const d1 = Number(inputs.d1);
      const v1 = Number(inputs.v1);
      const p1 = Number(inputs.p1) * 1000; // Pa
      const d2 = Number(inputs.d2);

      // Continuidad para sacar v2
      const a1 = Math.PI * Math.pow((d1/200), 2);
      const a2 = Math.PI * Math.pow((d2/200), 2);
      const v2 = (a1 * v1) / a2;

      // Bernoulli: P2 = P1 + 0.5*rho*(v1^2 - v2^2)
      const p2 = p1 + 0.5 * rho * (v1*v1 - v2*v2);
      const p2Kpa = p2 / 1000;

      return {
        steps: [
          {
            title: "1. Cálculo de la Velocidad de Salida ($v_2$)",
            description: `Utilizando la ecuación de continuidad:
            <br>$$v_2 = v_1 \\cdot \\left(\\frac{D_1}{D_2}\\right)^2 = ${v1.toFixed(2)} \\cdot \\left(\\frac{${d1}}{${d2}}\\right)^2 = ${v1.toFixed(2)} \\cdot ${(d1/d2).toFixed(2)}^2 = ${v2.toFixed(3)} \\text{ m/s}$$`
          },
          {
            title: "2. Planteamiento de la Ecuación de Bernoulli",
            description: `Como la tubería es horizontal, las alturas son iguales ($h_1 = h_2$). La ecuación de energía se reduce a:
            <br>$$P_1 + \\frac{1}{2}\\rho v_1^2 = P_2 + \\frac{1}{2}\\rho v_2^2$$
            <br>Despejamos la presión final $P_2$:
            <br>$$P_2 = P_1 + \\frac{1}{2}\\rho (v_1^2 - v_2^2)$$`
          },
          {
            title: "3. Sustitución y Cálculo de Presión",
            description: `Sustituimos la densidad del agua $\\rho = 1000 \\text{ kg/m}^3$ y $P_1 = ${inputs.p1} \\text{ kPa} = ${p1.toFixed(0)} \\text{ Pa}$:
            <br>$$P_2 = ${p1.toFixed(0)} + \\frac{1}{2}(1000) \\cdot [(${v1.toFixed(2)})^2 - (${v2.toFixed(3)})^2]$$
            <br>$$P_2 = ${p1.toFixed(0)} + 500 \\cdot [${(v1*v1).toFixed(2)} - ${(v2*v2).toFixed(2)}]$$
            <br>$$P_2 = ${p1.toFixed(0)} + 500 \\cdot [${(v1*v1 - v2*v2).toFixed(2)}]$$
            <br>$$P_2 = ${p1.toFixed(0)} + (${(0.5 * rho * (v1*v1 - v2*v2)).toFixed(0)}) = ${p2.toFixed(0)} \\text{ Pa}$$
            <br>Convertido a kilopascales (kPa):
            <br>$$P_2 = \\frac{${p2.toFixed(0)}}{100} \\text{ kPa} = ${p2Kpa.toFixed(2)} \\text{ kPa}$$`
          }
        ],
        result: {
          value: p2Kpa.toFixed(2),
          unit: "kPa",
          summary: `La presión en el tramo reducido disminuye hasta **${p2Kpa.toFixed(2)} kPa**.`
        },
        diagramData: { d1, d2, v1, v2, p1: inputs.p1, p2: p2Kpa }
      };
    },
    svgTemplate: (data) => {
      const d1H = Math.min(80, Math.max(30, data.d1 * 6));
      const d2H = Math.min(80, Math.max(15, data.d2 * 6));
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <path d="M 50 ${80 - d1H/2} L 170 ${80 - d1H/2} C 210 ${80 - d1H/2}, 210 ${80 - d2H/2}, 250 ${80 - d2H/2} L 350 ${80 - d2H/2} 
                   L 350 ${80 + d2H/2} C 210 ${80 + d2H/2}, 210 ${80 + d1H/2}, 170 ${80 + d1H/2} L 50 ${80 + d1H/2} Z" 
                fill="rgba(33, 150, 243, 0.3)" stroke="var(--color-text)" stroke-width="2.5" />
          
          <!-- Manómetro entrada -->
          <line x1="110" y1="${80 - d1H/2}" x2="110" y2="20" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="110" cy="20" r="12" fill="#fff" stroke="var(--color-text)" stroke-width="2"/>
          <text x="104" y="24" fill="#000" font-size="10" font-weight="bold">P₁</text>
          
          <!-- Manómetro salida -->
          <line x1="290" y1="${80 - d2H/2}" x2="290" y2="20" stroke="var(--color-text)" stroke-width="2"/>
          <circle cx="290" cy="20" r="12" fill="#fff" stroke="var(--color-text)" stroke-width="2"/>
          <text x="284" y="24" fill="#000" font-size="10" font-weight="bold">P₂</text>

          <text x="70" y="${80 + d1H/2 + 15}" fill="var(--color-text)" font-size="11">P₁ = ${data.p1} kPa</text>
          <text x="250" y="${80 + d2H/2 + 15}" fill="var(--color-primary)" font-weight="bold" font-size="11">P₂ = ${data.p2.toFixed(1)} kPa</text>
        </svg>`;
    }
  },
  {
    id: 7,
    category: "bernoulli",
    title: "Bomba de Elevación de Agua",
    difficulty: "Difícil",
    concept: "Al bombear agua verticalmente a un piso superior, la bomba debe superar dos factores: el cambio de energía potencial gravitatoria (altura) y el cambio de energía cinética. Por tanto, la presión sufre un descenso debido a la altura ganada y la mayor velocidad.",
    formula: "P_1 + \\frac{1}{2}\\rho v_1^2 + \\rho g h_1 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2",
    statement: "Una bomba impulsa agua ($\\rho = 1000 \\text{ kg/m}^3$) desde el nivel del suelo ($h_1 = 0$) hasta un piso elevado a una altura $h_2$. En el suelo, la tubería tiene un diámetro $D_1$, una velocidad $v_1$ y una presión manométrica de $P_1$. En el piso elevado, el diámetro se reduce a $D_2$. Calcula la presión manométrica final $P_2$ en el punto superior.",
    inputs: [
      { name: "h2", label: "Altura del Piso (h₂)", value: 12.0, unit: "m", min: 1.0, max: 40.0, step: 0.5 },
      { name: "d1", label: "Diámetro Inferior (D₁)", value: 8.0, unit: "cm", min: 2.0, max: 30.0, step: 0.5 },
      { name: "v1", label: "Velocidad Inferior (v₁)", value: 1.0, unit: "m/s", min: 0.1, max: 5.0, step: 0.1 },
      { name: "p1", label: "Presión Inferior (P₁)", value: 300.0, unit: "kPa", min: 150.0, max: 1000.0, step: 10.0 },
      { name: "d2", label: "Diámetro Superior (D₂)", value: 4.0, unit: "cm", min: 1.0, max: 29.5, step: 0.5 }
    ],
    calculate: (inputs) => {
      const rho = 1000;
      const g = 9.81;
      const h2 = Number(inputs.h2);
      const d1 = Number(inputs.d1);
      const v1 = Number(inputs.v1);
      const p1 = Number(inputs.p1) * 1000;
      const d2 = Number(inputs.d2);

      // Continuidad: v2
      const v2 = v1 * Math.pow(d1 / d2, 2);

      // Bernoulli: P2 = P1 - rho*g*h2 + 0.5*rho*(v1^2 - v2^2)
      const termHeight = rho * g * h2;
      const termKinetic = 0.5 * rho * (v1*v1 - v2*v2);
      const p2 = p1 - termHeight + termKinetic;
      const p2Kpa = p2 / 1000;

      return {
        steps: [
          {
            title: "1. Cálculo de la Velocidad Superior ($v_2$)",
            description: `Mediante la relación de diámetros de continuidad:
            <br>$$v_2 = v_1 \\cdot \\left(\\frac{D_1}{D_2}\\right)^2 = ${v1.toFixed(2)} \\cdot \\left(\\frac{${d1}}{${d2}}\\right)^2 = ${v2.toFixed(3)} \\text{ m/s}$$`
          },
          {
            title: "2. Planteamiento de la Ecuación de Bernoulli completa",
            description: `Considerando el nivel de referencia en la base ($h_1 = 0 \\text{ m}$):
            <br>$$P_1 + \\frac{1}{2}\\rho v_1^2 = P_2 + \\frac{1}{2}\\rho v_2^2 + \\rho g h_2$$
            <br>Despejando $P_2$:
            <br>$$P_2 = P_1 - \\rho g h_2 + \\frac{1}{2}\\rho (v_1^2 - v_2^2)$$`
          },
          {
            title: "3. Evaluación de cada pérdida de energía",
            description: `• Pérdida por altura (Presión hidrostática):
            <br>$$\\rho g h_2 = 1000 \\cdot 9.81 \\cdot ${h2} = ${termHeight.toFixed(0)} \\text{ Pa} = ${(termHeight/1000).toFixed(1)} \\text{ kPa}$$
            <br>• Efecto del cambio de velocidad (Presión dinámica):
            <br>$$\\frac{1}{2}\\rho (v_1^2 - v_2^2) = 500 \\cdot (1^2 - ${v2.toFixed(2)}^2) = ${termKinetic.toFixed(0)} \\text{ Pa} = ${(termKinetic/1000).toFixed(1)} \\text{ kPa}$$`
          },
          {
            title: "4. Resultado Final",
            description: `Sustituimos en la ecuación despejada:
            <br>$$P_2 = ${p1.toFixed(0)} - ${termHeight.toFixed(0)} + (${termKinetic.toFixed(0)}) = ${p2.toFixed(0)} \\text{ Pa}$$
            <br>$$P_2 = ${p2Kpa.toFixed(2)} \\text{ kPa}$$`
          }
        ],
        result: {
          value: p2Kpa.toFixed(2),
          unit: "kPa",
          summary: `La presión del agua al llegar a la altura de ${h2} m es de **${p2Kpa.toFixed(2)} kPa**.`
        },
        diagramData: { h2, d1, d2, v1, v2, p1: inputs.p1, p2: p2Kpa }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 180" class="physics-diagram">
          <!-- Suelo -->
          <line x1="20" y1="160" x2="380" y2="160" stroke="#777" stroke-width="2"/>
          
          <!-- Tubería ascendente -->
          <path d="M 50 160 L 50 120 C 50 80, 100 80, 140 80 L 250 80" stroke="rgba(33,150,243,0.3)" stroke-width="12" fill="none"/>
          <path d="M 50 160 L 50 120 C 50 80, 100 80, 140 80 L 250 80" stroke="var(--color-text)" stroke-width="2" fill="none"/>
          
          <!-- Representación conceptual del cambio de altura -->
          <rect x="50" y="130" width="30" height="30" fill="none" stroke="var(--color-text)" stroke-width="1.5"/>
          <rect x="250" y="40" width="20" height="20" fill="none" stroke="var(--color-text)" stroke-width="1.5"/>
          
          <!-- Elevador de agua -->
          <path d="M 60 160 L 60 110 C 60 90, 200 90, 200 50 L 300 50" fill="none" stroke="var(--color-primary)" stroke-width="8" stroke-opacity="0.5"/>
          
          <!-- Acotación altura -->
          <line x1="330" y1="160" x2="330" y2="50" stroke="var(--color-text)" stroke-width="1" stroke-dasharray="3 3"/>
          <polygon points="330,160 327,152 333,152" fill="var(--color-text)"/>
          <polygon points="330,50 327,58 333,58" fill="var(--color-text)"/>
          <text x="340" y="110" fill="var(--color-text)" font-size="11">h₂ = ${data.h2} m</text>
          
          <!-- Puntos -->
          <circle cx="60" cy="140" r="4" fill="red"/>
          <text x="75" y="145" fill="var(--color-text)" font-size="10">P₁ = ${data.p1} kPa</text>
          
          <circle cx="280" cy="50" r="4" fill="red"/>
          <text x="240" y="35" fill="var(--color-primary-dark)" font-weight="bold" font-size="10">P₂ = ${data.p2.toFixed(1)} kPa</text>
        </svg>`;
    }
  },
  {
    id: 8,
    category: "bernoulli",
    title: "Sustentación de Ala de Avión",
    difficulty: "Media",
    concept: "La geometría del ala de un avión obliga al aire que pasa por la superficie superior curvada a viajar a mayor velocidad que el aire que pasa por debajo. Por Bernoulli, a mayor velocidad corresponde menor presión, creando una fuerza neta ascendente (sustentación).",
    formula: "\\Delta P = \\frac{1}{2}\\rho \\left(v_{sup}^2 - v_{inf}^2\\right)",
    statement: "Un avión vuela en condiciones donde la densidad del aire es $\\rho$. La velocidad del flujo de aire sobre el ala superior es $v_{sup}$ y bajo el ala inferior es $v_{inf}$. Calcula la diferencia de presión $\\Delta P$ entre el lado inferior y superior, y la fuerza de sustentación neta si el ala tiene un área $A$.",
    inputs: [
      { name: "rho", label: "Densidad del Aire (ρ)", value: 1.2, unit: "kg/m³", min: 0.1, max: 1.4, step: 0.05 },
      { name: "vsup", label: "Velocidad Superior (v_sup)", value: 120.0, unit: "m/s", min: 30.0, max: 300.0, step: 2.0 },
      { name: "vinf", label: "Velocidad Inferior (v_inf)", value: 100.0, unit: "m/s", min: 20.0, max: 298.0, step: 2.0 },
      { name: "area", label: "Área del Ala (A)", value: 25.0, unit: "m²", min: 1.0, max: 150.0, step: 1.0 }
    ],
    calculate: (inputs) => {
      const rho = Number(inputs.rho);
      const vsup = Number(inputs.vsup);
      const vinf = Number(inputs.vinf);
      const area = Number(inputs.area);

      const deltaP = 0.5 * rho * (vsup*vsup - vinf*vinf); // Pa
      const force = deltaP * area; // N
      const forceKn = force / 1000; // kN

      return {
        steps: [
          {
            title: "1. Ecuación de Bernoulli sobre perfiles de corriente",
            description: `Escribimos Bernoulli para la corriente superior e inferior (ignorando la pequeña diferencia de espesor del ala, $h_{sup} \\approx h_{inf}$):
            <br>$$P_{inf} + \\frac{1}{2}\\rho v_{inf}^2 = P_{sup} + \\frac{1}{2}\\rho v_{sup}^2$$
            <br>Despejamos la diferencia de presión $\\Delta P = P_{inf} - P_{sup}$:
            <br>$$\\Delta P = \\frac{1}{2}\\rho (v_{sup}^2 - v_{inf}^2)$$`
          },
          {
            title: "2. Sustitución de Valores de Presión",
            description: `Planteamos las variables con $\\rho = ${rho} \\text{ kg/m}^3$:
            <br>$$\\Delta P = 0.5 \\cdot ${rho} \\cdot [(${vsup})^2 - (${vinf})^2]$$
            <br>$$\\Delta P = ${(0.5 * rho).toFixed(2)} \\cdot [${vsup*vsup} - ${vinf*vinf}]$$
            <br>$$\\Delta P = ${(0.5 * rho).toFixed(2)} \\cdot [${vsup*vsup - vinf*vinf}] = ${deltaP.toFixed(2)} \\text{ Pa}$$`
          },
          {
            title: "3. Fuerza de Sustentación ($F_s = \\Delta P \\cdot A$)",
            description: `Multiplicamos la diferencia de presión promedio por el área superficial del ala ($A = ${area} \\text{ m}^2$):
            <br>$$F_s = ${deltaP.toFixed(2)} \\text{ Pa} \\cdot ${area} \\text{ m}^2 = ${force.toFixed(1)} \\text{ N} \\approx ${forceKn.toFixed(2)} \\text{ kN}$$`
          }
        ],
        result: {
          value: deltaP.toFixed(1),
          unit: "Pa",
          summary: `La diferencia de presión es de **${deltaP.toFixed(1)} Pa** (N/m²), generando una fuerza de sustentación de **${forceKn.toFixed(2)} kN**.`
        },
        diagramData: { vsup, vinf, deltaP, forceKn }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <defs>
            <marker id="arrowUp" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 5 10 L 5 0 L 2 3 M 5 0 L 8 3" stroke="var(--color-primary-dark)" stroke-width="2" fill="none" />
            </marker>
          </defs>
          <!-- Perfil del ala (Aerofoil) -->
          <path d="M 60 90 C 120 40, 260 40, 320 90 C 260 95, 120 95, 60 90 Z" fill="#cfd8dc" stroke="#37474f" stroke-width="2" />
          
          <!-- Flujo de aire arriba (rápido) -->
          <path d="M 30 75 Q 160 15 370 70" fill="none" stroke="var(--color-primary)" stroke-width="2.5" stroke-dasharray="10 8">
            <animate attributeName="stroke-dashoffset" values="100;0" dur="0.8s" repeatCount="indefinite" />
          </path>
          <text x="140" y="30" fill="var(--color-primary-dark)" font-size="11">Rápido: v_sup = ${data.vsup} m/s (Baja Presión)</text>
          
          <!-- Flujo de aire abajo (lento) -->
          <path d="M 30 110 Q 160 110 370 110" fill="none" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="10 8">
            <animate attributeName="stroke-dashoffset" values="100;0" dur="1.5s" repeatCount="indefinite" />
          </path>
          <text x="140" y="130" fill="var(--color-primary-dark)" font-size="11">Lento: v_inf = ${data.vinf} m/s (Alta Presión)</text>
          
          <!-- Vectores de fuerza de sustentación -->
          <line x1="120" y1="115" x2="120" y2="75" stroke="var(--color-primary-dark)" stroke-width="2.5" marker-end="url(#arrowUp)"/>
          <line x1="200" y1="115" x2="200" y2="75" stroke="var(--color-primary-dark)" stroke-width="2.5" marker-end="url(#arrowUp)"/>
          <line x1="280" y1="115" x2="280" y2="75" stroke="var(--color-primary-dark)" stroke-width="2.5" marker-end="url(#arrowUp)"/>
          
          <text x="170" y="70" fill="var(--color-primary-dark)" font-weight="bold" font-size="12">F_s = ${data.forceKn.toFixed(1)} kN</text>
        </svg>`;
    }
  },
  {
    id: 9,
    category: "bernoulli",
    title: "Sifón de Drenaje",
    difficulty: "Difícil",
    concept: "Un sifón utiliza la presión atmosférica para obligar a un fluido a subir por encima del nivel de un tanque y drenarlo. La velocidad de salida es idéntica a la caída libre desde la superficie hasta el punto de salida (Torricelli). Sin embargo, la presión en el punto superior es inferior a la atmosférica.",
    formula: "P_{cima} = P_{atm} - \\rho g (h_{cima} - h_{sup}) - \\frac{1}{2}\\rho v^2",
    statement: "Un sifón se utiliza para vaciar un depósito de agua. La cima del tubo está a una altura $y_c$ sobre la superficie libre del agua y el extremo de descarga libre está a una profundidad $y_d$ bajo la superficie. Determina la velocidad de salida del chorro $v$ y la presión absoluta en la cima del tubo $P_{cima}$. (Considera $P_{atm} = 101300 \\text{ Pa}$ y $g = 9.81 \\text{ m/s}^2$).",
    inputs: [
      { name: "yc", label: "Altura Cima s/ Nivel (y_c)", value: 1.5, unit: "m", min: 0.2, max: 5.0, step: 0.1 },
      { name: "yd", label: "Profundidad Salida (y_d)", value: 2.0, unit: "m", min: 0.2, max: 7.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const rho = 1000;
      const g = 9.81;
      const patm = 101300;
      const yc = Number(inputs.yc);
      const yd = Number(inputs.yd);

      // Velocidad salida por Torricelli/Bernoulli del nivel a la descarga
      const v = Math.sqrt(2 * g * yd);

      // Bernoulli entre superficie (1) y cima (c):
      // P1/rho + g*h1 + 0.5*v1^2 = Pc/rho + g*hc + 0.5*vc^2
      // v1 ≈ 0, P1 = Patm, h1 = 0
      // hc = yc, vc = v
      // Pc = Patm - rho*g*yc - 0.5*rho*v^2
      const termHeight = rho * g * yc;
      const termKinetic = 0.5 * rho * v * v; // que es igual a rho*g*yd
      const pcima = patm - termHeight - termKinetic;
      const pcimaKpa = pcima / 1000;

      return {
        steps: [
          {
            title: "1. Velocidad de Salida en la Descarga",
            description: `Aplicando Bernoulli entre la superficie libre (Punto A, $v_A \\approx 0$, $P_A = P_{atm}$, $h_A = 0$) y la salida del tubo (Punto B, $P_B = P_{atm}$, $h_B = -y_d$):
            <br>$$P_{atm} = P_{atm} - \\rho g y_d + \\frac{1}{2}\\rho v^2$$
            <br>Se simplifica a la ecuación de Torricelli:
            <br>$$v = \\sqrt{2g y_d} = \\sqrt{2 \\cdot 9.81 \\cdot ${yd}} = ${v.toFixed(3)} \\text{ m/s}$$`
          },
          {
            title: "2. Ecuación de Bernoulli en la Cima del Sifón",
            description: `Relacionamos la superficie (Punto A) con la cima (Punto C, $h_C = y_c$, $v_C = v$ debido al diámetro constante del tubo):
            <br>$$P_{atm} = P_{cima} + \\rho g y_c + \\frac{1}{2}\\rho v^2$$
            <br>Despejamos la presión absoluta en la cima $P_{cima}$:
            <br>$$P_{cima} = P_{atm} - \\rho g y_c - \\frac{1}{2}\\rho v^2$$`
          },
          {
            title: "3. Cálculo Numérico",
            description: `Sustituimos los términos correspondientes:
            <br>• Presión hidrostática de elevación: $\\rho g y_c = 1000 \\cdot 9.81 \\cdot ${yc} = ${termHeight.toFixed(0)} \\text{ Pa}$
            <br>• Presión dinámica: $\\frac{1}{2}\\rho v^2 = 500 \\cdot (${v.toFixed(3)})^2 = ${termKinetic.toFixed(0)} \\text{ Pa}$
            <br>Sustituyendo en la ecuación de presión absoluta:
            <br>$$P_{cima} = 101,300 - ${termHeight.toFixed(0)} - ${termKinetic.toFixed(0)} = ${pcima.toFixed(0)} \\text{ Pa}$$
            <br>$$P_{cima} = ${pcimaKpa.toFixed(2)} \\text{ kPa}$$`
          }
        ],
        result: {
          value: pcimaKpa.toFixed(2),
          unit: "kPa",
          summary: `La velocidad de descarga es **${v.toFixed(2)} m/s** y la presión absoluta en el tope del sifón es de **${pcimaKpa.toFixed(2)} kPa**.`
        },
        diagramData: { yc, yd, v, pcimaKpa }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 180" class="physics-diagram">
          <!-- Tanque -->
          <rect x="50" y="80" width="120" height="90" fill="#e3f2fd" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="50" y1="80" x2="170" y2="80" stroke="#0d47a1" stroke-width="3"/>
          
          <!-- Sifón invertido en U -->
          <path d="M 100 130 L 100 50 A 30 30 0 0 1 160 50 L 160 170" fill="none" stroke="rgba(33,150,243,0.4)" stroke-width="12" />
          <path d="M 100 130 L 100 50 A 30 30 0 0 1 160 50 L 160 170" fill="none" stroke="var(--color-text)" stroke-width="1.5" />
          
          <!-- Descarga de agua -->
          <path d="M 160 170 Q 160 180 180 180" fill="none" stroke="#2196f3" stroke-width="8"/>
          
          <!-- Acotación yc -->
          <line x1="210" y1="80" x2="210" y2="20" stroke="var(--color-text)" stroke-dasharray="2 2"/>
          <text x="215" y="55" fill="var(--color-text)" font-size="10">yc = ${data.yc} m</text>
          
          <!-- Acotación yd -->
          <line x1="210" y1="80" x2="210" y2="170" stroke="var(--color-text)" stroke-dasharray="2 2"/>
          <text x="215" y="130" fill="var(--color-text)" font-size="10">yd = ${data.yd} m</text>
          
          <circle cx="130" cy="20" r="4" fill="red"/>
          <text x="100" y="12" fill="var(--color-primary-dark)" font-weight="bold" font-size="10">P_cima = ${data.pcimaKpa.toFixed(1)} kPa</text>
          <text x="175" y="160" fill="var(--color-text)" font-size="11">v = ${data.v.toFixed(2)} m/s</text>
        </svg>`;
    }
  },
  {
    id: 10,
    category: "bernoulli",
    title: "Efecto de Succión en Chimenea",
    difficulty: "Fácil",
    concept: "Cuando el viento sopla a gran velocidad por encima de la boca de una chimenea abierta, genera una zona de baja presión de acuerdo con la ley de Bernoulli. Dado que el aire dentro de la casa está en reposo y a mayor presión, se establece una succión que arrastra el humo hacia afuera.",
    formula: "P_{drop} = \\frac{1}{2}\\rho_{aire} v_{viento}^2",
    statement: "El viento sopla a una velocidad de $v_{wind}$ sobre el tope de una chimenea vertical abierta. El aire dentro de la chimenea está quieto a presión atmosférica estándar ($101300 \\text{ Pa}$). Calcula la caída de presión en la salida y la diferencia resultante que ayuda a succionar los gases de combustión. (Considera la densidad del aire caliente de combustión en $\\rho = 1.2 \\text{ kg/m}^3$).",
    inputs: [
      { name: "vwind", label: "Velocidad Viento (v_wind)", value: 15.0, unit: "m/s", min: 1.0, max: 45.0, step: 1.0 },
      { name: "rho", label: "Densidad Aire (ρ)", value: 1.2, unit: "kg/m³", min: 0.9, max: 1.3, step: 0.05 }
    ],
    calculate: (inputs) => {
      const vwind = Number(inputs.vwind);
      const rho = Number(inputs.rho);

      // Bernoulli entre reposo interior (1) y corriente de aire superior (2)
      // P1 + 0 = P2 + 0.5 * rho * v^2
      // P1 - P2 = 0.5 * rho * v^2
      const deltaP = 0.5 * rho * vwind * vwind;

      return {
        steps: [
          {
            title: "1. Planteamiento físico del problema",
            description: `Definimos dos puntos a la misma elevación en la boca superior de la chimenea:
            <br>• Punto 1 (Interior de la chimenea): El aire está en reposo relativo ($v_1 \\approx 0$) a presión $P_1$.
            <br>• Punto 2 (Exterior afectado por el viento): El aire se mueve a velocidad $v_2 = v_{wind}$ a presión $P_2$.`
          },
          {
            title: "2. Aplicación de la Ecuación de Bernoulli",
            description: `$$P_1 + \\frac{1}{2}\\rho v_1^2 = P_2 + \\frac{1}{2}\\rho v_2^2$$
            <br>Como $v_1 = 0$, la ecuación queda:
            <br>$$P_1 = P_2 + \\frac{1}{2}\\rho v_{wind}^2$$
            <br>La caída o diferencia de presión responsable de la succión es:
            <br>$$\\Delta P = P_1 - P_2 = \\frac{1}{2}\\rho v_{wind}^2$$`
          },
          {
            title: "3. Cálculo Matemático",
            description: `Sustituimos los valores seleccionados para el viento:
            <br>$$\\Delta P = 0.5 \\cdot ${rho} \\text{ kg/m}^3 \\cdot (${vwind} \\text{ m/s})^2$$
            <br>$$\\Delta P = 0.5 \\cdot ${rho} \\cdot ${vwind * vwind} = ${deltaP.toFixed(2)} \\text{ Pa}$$`
          }
        ],
        result: {
          value: deltaP.toFixed(1),
          unit: "Pa",
          summary: `La caída de presión en la boca de la chimenea es de **${deltaP.toFixed(1)} Pa**, facilitando la evacuación natural del humo.`
        },
        diagramData: { vwind, deltaP }
      };
    },
    svgTemplate: (data) => {
      const speed = Math.max(1, data.vwind / 8);
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Chimenea -->
          <rect x="170" y="70" width="60" height="90" fill="#cfd8dc" stroke="#37474f" stroke-width="2"/>
          <line x1="170" y1="70" x2="230" y2="70" stroke="none" />
          
          <!-- Viento superior -->
          <path d="M 30 45 L 370 45" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="10 10">
            <animate attributeName="stroke-dashoffset" values="100;0" dur="${2/speed}s" repeatCount="indefinite"/>
          </path>
          <path d="M 30 30 L 370 30" stroke="var(--color-primary)" stroke-width="1.5" stroke-dasharray="10 10">
            <animate attributeName="stroke-dashoffset" values="120;0" dur="${1.8/speed}s" repeatCount="indefinite"/>
          </path>
          
          <!-- Humo subiendo -->
          <path d="M 200 150 Q 190 110 200 70 Q 210 50 240 45" stroke="#78909c" stroke-width="4" stroke-opacity="0.6" fill="none" stroke-dasharray="5 5">
            <animate attributeName="stroke-dashoffset" values="50;0" dur="2s" repeatCount="indefinite"/>
          </path>
          
          <text x="40" y="20" fill="var(--color-text)" font-size="11">Viento v = ${data.vwind} m/s</text>
          <text x="240" y="80" fill="var(--color-primary-dark)" font-weight="bold" font-size="11">ΔP = ${data.deltaP.toFixed(1)} Pa</text>
          <text x="90" y="120" fill="var(--color-text)" font-size="10">Aire en reposo (P_atm)</text>
        </svg>`;
    }
  },

  // ==========================================
  // BLOQUE C: TEOREMA DE TORRICELLI (11 - 14)
  // ==========================================
  {
    id: 11,
    category: "torricelli",
    title: "Velocidad de Escape de un Tanque Abierto",
    difficulty: "Fácil",
    concept: "El teorema de Torricelli es una consecuencia directa de Bernoulli. Demuestra que la velocidad con la que sale un líquido por el orificio de un tanque abierto es idéntica a la velocidad que alcanzaría un objeto cayendo libremente desde la misma altura.",
    formula: "v = \\sqrt{2 \\cdot g \\cdot h}",
    statement: "Un gran depósito abierto de agua contiene líquido hasta una profundidad total de $H$. Si se abre una pequeña grieta en una de las paredes laterales a una profundidad $h$ por debajo de la superficie del agua, calcula la velocidad de escape del chorro.",
    inputs: [
      { name: "h", label: "Profundidad del Orificio (h)", value: 3.0, unit: "m", min: 0.1, max: 20.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const g = 9.81;
      const h = Number(inputs.h);
      const v = Math.sqrt(2 * g * h);

      return {
        steps: [
          {
            title: "1. Concepto Físico y Teorema de Torricelli",
            description: `Para un orificio pequeño en un recipiente muy grande y abierto a la atmósfera, la velocidad de descenso del nivel superior es prácticamente cero. La presión en la superficie y en la salida del chorro es la presión atmosférica. Esto reduce Bernoulli a:
            <br>$$v = \\sqrt{2 \\cdot g \\cdot h}$$
            <br>Donde $h$ representa la profundidad medida desde la superficie del líquido.`
          },
          {
            title: "2. Sustitución de Constantes",
            description: `Utilizando la aceleración de la gravedad estándar $g = 9.81 \\text{ m/s}^2$ y la profundidad seleccionada de $h = ${h} \\text{ m}$:
            <br>$$v = \\sqrt{2 \\cdot (9.81 \\text{ m/s}^2) \\cdot ${h} \\text{ m}}$$
            <br>$$v = \\sqrt{${(2 * g * h).toFixed(3)} \\text{ m}^2/\\text{s}^2}$$
            <br>$$v = ${v.toFixed(3)} \\text{ m/s}$$`
          }
        ],
        result: {
          value: v.toFixed(2),
          unit: "m/s",
          summary: `El agua escapa por el orificio a una velocidad de **${v.toFixed(2)} m/s**.`
        },
        diagramData: { h, v }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Tanque -->
          <rect x="60" y="20" width="140" height="120" fill="#e3f2fd" stroke="var(--color-text)" stroke-width="2"/>
          
          <!-- Orificio lateral derecho -->
          <rect x="200" y="90" width="10" height="10" fill="#e3f2fd" stroke="none" />
          <line x1="200" y1="20" x2="200" y2="90" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="200" y1="100" x2="200" y2="140" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="60" y1="140" x2="200" y2="140" stroke="var(--color-text)" stroke-width="2"/>
          
          <!-- Nivel del agua superior -->
          <line x1="60" y1="40" x2="200" y2="40" stroke="#1565c0" stroke-width="3"/>
          
          <!-- Chorro de agua saliendo -->
          <path d="M 200 95 Q 260 95 330 140" stroke="#1e88e5" stroke-width="2.5" fill="none"/>
          
          <!-- Cota profundidad -->
          <line x1="45" y1="40" x2="45" y2="95" stroke="var(--color-text)" stroke-width="1"/>
          <line x1="40" y1="40" x2="50" y2="40" stroke="var(--color-text)" stroke-width="1"/>
          <line x1="40" y1="95" x2="50" y2="95" stroke="var(--color-text)" stroke-width="1"/>
          <text x="25" y="72" fill="var(--color-text)" font-size="10">h = ${data.h} m</text>
          
          <text x="250" y="85" fill="var(--color-primary)" font-weight="bold" font-size="12">v = ${data.v.toFixed(2)} m/s</text>
        </svg>`;
    }
  },
  {
    id: 12,
    category: "torricelli",
    title: "Alcance Horizontal de un Chorro de Agua",
    difficulty: "Media",
    concept: "La distancia horizontal máxima (alcance) que logra un chorro de agua que sale lateralmente de un tanque depende tanto de su velocidad de salida horizontal como del tiempo que tarda en caer libremente hacia el suelo debido a la gravedad.",
    formula: "x = 2 \\cdot \\sqrt{h \\cdot (H - h)}",
    statement: "Un barril cilíndrico de altura total $H$ está completamente lleno de agua y apoyado sobre el suelo. Se realiza un orificio pequeño en una pared lateral a una distancia de profundidad $h$ medida desde la parte superior. Calcula la velocidad inicial del chorro y la distancia horizontal $x$ desde la base del barril donde impactará el chorro con el suelo.",
    inputs: [
      { name: "h", label: "Profundidad Orificio (h)", value: 0.8, unit: "m", min: 0.1, max: 4.9, step: 0.1 },
      { name: "H", label: "Altura Total Tanque (H)", value: 3.0, unit: "m", min: 1.0, max: 10.0, step: 0.2 }
    ],
    calculate: (inputs) => {
      const g = 9.81;
      const h = Number(inputs.h);
      const H = Number(inputs.H);

      // Validar que h no sea mayor a H
      const depth = Math.min(h, H - 0.05);
      const v = Math.sqrt(2 * g * depth);
      const t = Math.sqrt(2 * (H - depth) / g); // tiempo de caida
      const x = v * t;

      return {
        steps: [
          {
            title: "1. Velocidad de salida del líquido (Torricelli)",
            description: `La profundidad desde la superficie es $h = ${depth.toFixed(2)} \\text{ m}$.
            <br>$$v_x = \\sqrt{2gh} = \\sqrt{2 \\cdot 9.81 \\cdot ${depth.toFixed(2)}} = ${v.toFixed(3)} \\text{ m/s}$$`
          },
          {
            title: "2. Tiempo de Caída del Chorro ($y = \\frac{1}{2}gt^2$)",
            description: `La distancia vertical que el agua debe caer desde el agujero hasta el suelo es $H - h = ${H.toFixed(2)} - ${depth.toFixed(2)} = ${(H - depth).toFixed(2)} \\text{ m}$.
            <br>$$t = \\sqrt{\\frac{2(H - h)}{g}} = \\sqrt{\\frac{2 \\cdot ${(H - depth).toFixed(2)}}{9.81}} = ${t.toFixed(3)} \\text{ s}$$`
          },
          {
            title: "3. Cálculo del Alcance Horizontal Recorrido ($x = v_x \\cdot t$)",
            description: `El chorro describe una trayectoria parabólica clásica:
            <br>$$x = v_x \\cdot t = ${v.toFixed(3)} \\text{ m/s} \\cdot ${t.toFixed(3)} \\text{ s} = ${x.toFixed(3)} \\text{ m}$$
            <br>*(Nota matemática: por cinemática esto equivale directamente a la fórmula teórica $x = 2\\sqrt{h(H-h)} = 2\\sqrt{${depth.toFixed(2)} \\cdot ${(H-depth).toFixed(2)}} = ${x.toFixed(3)}\\text{ m}$)*`
          }
        ],
        result: {
          value: x.toFixed(2),
          unit: "m",
          summary: `El agua saldrá a una velocidad de **${v.toFixed(2)} m/s** e impactará a una distancia de **${x.toFixed(2)} m** de la base.`
        },
        diagramData: { h: depth, H, x }
      };
    },
    svgTemplate: (data) => {
      const topLevel = 30;
      const bottomLevel = 130;
      const tankH = bottomLevel - topLevel;
      const hPix = (data.h / data.H) * tankH;
      const holeY = topLevel + hPix;
      const scaleX = 200 / data.H; // proporcional
      const xPix = 200 + (data.x * scaleX);

      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Suelo -->
          <line x1="20" y1="${bottomLevel}" x2="380" y2="${bottomLevel}" stroke="#555" stroke-width="2"/>
          
          <!-- Tanque -->
          <rect x="70" y="${topLevel}" width="80" height="${tankH}" fill="#e3f2fd" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="150" y1="${holeY - 4}" x2="150" y2="${holeY + 4}" stroke="none"/>
          
          <!-- Nivel del agua superior -->
          <line x1="70" y1="${topLevel}" x2="150" y2="${topLevel}" stroke="#1565c0" stroke-width="3"/>
          
          <!-- Chorro de agua saliendo -->
          <path d="M 150 ${holeY} Q ${150 + (xPix - 150)*0.5} ${holeY} ${Math.min(370, xPix)} ${bottomLevel}" stroke="#1e88e5" stroke-width="2" fill="none"/>
          
          <!-- Cotas -->
          <line x1="60" y1="${topLevel}" x2="60" y2="${bottomLevel}" stroke="var(--color-text)" stroke-width="0.8"/>
          <text x="40" y="85" fill="var(--color-text)" font-size="10">H=${data.H}m</text>
          
          <!-- Acotación x -->
          <line x1="150" y1="145" x2="${Math.min(370, xPix)}" y2="145" stroke="var(--color-primary)" stroke-width="1"/>
          <text x="${150 + (xPix-150)/3}" y="157" fill="var(--color-primary-dark)" font-size="10" font-weight="bold">x = ${data.x.toFixed(2)} m</text>
        </svg>`;
    }
  },
  {
    id: 13,
    category: "torricelli",
    title: "Tasa de Descenso en Vaciado de Tanque",
    difficulty: "Media",
    concept: "Cuando un tanque cilíndrico se vacía por un agujero en su fondo, el caudal de salida es alto inicialmente y va disminuyendo a medida que el nivel de agua baja. Podemos calcular la rapidez con la que desciende la superficie superior usando la relación de áreas.",
    formula: "\\frac{dh}{dt} = - \\left(\\frac{r_{orificio}}{r_{tanque}}\\right)^2 \\cdot \\sqrt{2gh}",
    statement: "Un depósito de agua cilíndrico de radio $R$ tiene una altura inicial de agua $h$. En el fondo se abre una compuerta o desagüe circular de radio $r$. Calcula el caudal volumétrico inicial de vaciado $Q_{ini}$ y la rapidez inicial con la que desciende el nivel superior del agua en el depósito.",
    inputs: [
      { name: "R", label: "Radio Tanque (R)", value: 1.5, unit: "m", min: 0.5, max: 5.0, step: 0.1 },
      { name: "h", label: "Altura Inicial Agua (h)", value: 2.0, unit: "m", min: 0.2, max: 6.0, step: 0.1 },
      { name: "r", label: "Radio Orificio (r)", value: 5.0, unit: "cm", min: 1.0, max: 30.0, step: 0.5 }
    ],
    calculate: (inputs) => {
      const g = 9.81;
      const R = Number(inputs.R);
      const h = Number(inputs.h);
      const r = Number(inputs.r) / 100; // a metros

      const aTanque = Math.PI * R * R;
      const aOrificio = Math.PI * r * r;

      const vSalida = Math.sqrt(2 * g * h);
      const qIni = aOrificio * vSalida; // m3/s
      const dhdt = -(aOrificio / aTanque) * vSalida; // m/s
      const dhdtMm = Math.abs(dhdt) * 1000; // mm/s

      return {
        steps: [
          {
            title: "1. Cálculo de las Áreas Transversales",
            description: `Calculamos el área de la superficie libre del agua y del desagüe circular:
            <br>• Área del Tanque Cilíndrico: $A_{tanque} = \\pi R^2 = \\pi \\cdot (${R.toFixed(2)} \\text{ m})^2 = ${aTanque.toFixed(4)} \\text{ m}^2$
            <br>• Área del Orificio de Salida: $A_{desague} = \\pi r^2 = \\pi \\cdot (${r.toFixed(4)} \\text{ m})^2 = ${aOrificio.toExponential(4)} \\text{ m}^2$`
          },
          {
            title: "2. Caudal Inicial de Salida ($Q_{ini}$)",
            description: `La velocidad teórica de salida por Torricelli a la altura inicial $h = ${h.toFixed(1)} \\text{ m}$ es:
            <br>$$v = \\sqrt{2gh} = \\sqrt{2 \\cdot 9.81 \\cdot ${h}} = ${vSalida.toFixed(3)} \\text{ m/s}$$
            <br>Por lo tanto, el caudal inicial de salida es:
            <br>$$Q_{ini} = A_{desague} \\cdot v = (${aOrificio.toExponential(4)} \\text{ m}^2) \\cdot (${vSalida.toFixed(3)} \\text{ m/s}) = ${qIni.toExponential(4)} \\text{ m}^3/s \\approx ${(qIni * 1000).toFixed(2)} \\text{ L/s}$$`
          },
          {
            title: "3. Rapidez de Descenso del Nivel del Agua ($\\frac{dh}{dt}$)",
            description: `Por la ecuación de continuidad:
            <br>$$A_{tanque} \\cdot \\left(-\\frac{dh}{dt}\\right) = A_{desague} \\cdot v_{salida}$$
            <br>$$\\frac{dh}{dt} = -\\left(\\frac{A_{desague}}{A_{tanque}}\\right) \\cdot v_{salida}$$
            <br>$$\\frac{dh}{dt} = -\\left(\\frac{${aOrificio.toExponential(4)}}{${aTanque.toFixed(4)}}\\right) \\cdot ${vSalida.toFixed(3)}$$
            <br>$$\\frac{dh}{dt} = -${Math.abs(dhdt).toExponential(4)} \\text{ m/s} = -${dhdtMm.toFixed(3)} \\text{ mm/s}$$`
          }
        ],
        result: {
          value: dhdtMm.toFixed(2),
          unit: "mm/s",
          summary: `El nivel desciende inicialmente a razón de **${dhdtMm.toFixed(2)} mm/s** con un caudal de **${(qIni * 1000).toFixed(1)} L/s**.`
        },
        diagramData: { R, h, r: Number(inputs.r), dhdtMm }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Tanque cilíndrico -->
          <rect x="100" y="30" width="200" height="110" fill="#e3f2fd" stroke="var(--color-text)" stroke-width="2" />
          
          <!-- Orificio en el fondo -->
          <rect x="190" y="140" width="20" height="10" fill="#e3f2fd" stroke="none" />
          <line x1="100" y1="140" x2="190" y2="140" stroke="var(--color-text)" stroke-width="2" />
          <line x1="210" y1="140" x2="300" y2="140" stroke="var(--color-text)" stroke-width="2" />
          
          <!-- Chorro de salida cayendo verticalmente -->
          <path d="M 195 140 Q 195 160 197 180" stroke="#1e88e5" stroke-width="4" fill="none"/>
          <path d="M 205 140 Q 205 160 203 180" stroke="#1e88e5" stroke-width="4" fill="none"/>
          
          <!-- Nivel del agua descendiendo -->
          <line x1="100" y1="60" x2="300" y2="60" stroke="#0d47a1" stroke-dasharray="4 4" stroke-width="2"/>
          <path d="M 200 45 L 200 58" stroke="red" stroke-width="1.5" marker-end="url(#arrow)"/>
          
          <text x="210" y="52" fill="red" font-size="10">dh/dt = -${data.dhdtMm.toFixed(2)} mm/s</text>
          <text x="110" y="90" fill="var(--color-text)" font-size="11">R = ${data.R} m</text>
          <text x="220" y="130" fill="var(--color-text)" font-size="10">r = ${data.r} cm</text>
        </svg>`;
    }
  },
  {
    id: 14,
    category: "torricelli",
    title: "Vaciado de Tanque Presurizado",
    difficulty: "Difícil",
    concept: "Si un tanque de almacenamiento está cerrado y sellado con aire comprimido a alta presión sobre la superficie del fluido, el chorro sale a una velocidad muy superior que en un tanque abierto. Debemos sumar la diferencia de presiones a la energía potencial.",
    formula: "v = \\sqrt{2gh + \\frac{2(P_{gas} - P_{atm})}{\\rho}}",
    statement: "Un gran tanque hermético contiene agua de densidad $\\rho = 1000 \\text{ kg/m}^3$ hasta una profundidad $h$. El aire sobre el agua está presurizado a una presión manométrica $P_{man}$. Si se abre un orificio en la base, calcula la velocidad de escape del agua.",
    inputs: [
      { name: "h", label: "Altura del Agua (h)", value: 3.0, unit: "m", min: 0.5, max: 10.0, step: 0.1 },
      { name: "pman", label: "Presión Manométrica Aire (P_man)", value: 2.0, unit: "atm", min: 0.0, max: 6.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const rho = 1000;
      const g = 9.81;
      const patm = 101325; // Pa
      const h = Number(inputs.h);
      const pmanAtm = Number(inputs.pman);
      const pmanPa = pmanAtm * 101325; // presión manométrica en Pa

      // Torricelli modificado: v = sqrt(2gh + 2*Pman/rho)
      const termHeight = 2 * g * h;
      const termPressure = (2 * pmanPa) / rho;
      const v = Math.sqrt(termHeight + termPressure);

      return {
        steps: [
          {
            title: "1. Explicación de la ecuación de Bernoulli modificada",
            description: `Planteamos Bernoulli entre la superficie del agua (Punto 1, $P_1 = P_{atm} + P_{man}$, $v_1 \\approx 0$, $h_1 = h$) y el orificio de salida (Punto 2, $P_2 = P_{atm}$, $h_2 = 0$):
            <br>$$P_{atm} + P_{man} + \\rho g h = P_{atm} + \\frac{1}{2}\\rho v^2$$
            <br>Simplificamos la presión atmosférica $P_{atm}$ en ambos lados:
            <br>$$P_{man} + \\rho g h = \\frac{1}{2}\\rho v^2$$
            <br>Despejamos la velocidad de salida $v$:
            <br>$$v = \\sqrt{2gh + \\frac{2P_{man}}{\\rho}}$$`
          },
          {
            title: "2. Conversión de Unidades de Presión",
            description: `La presión manométrica del gas es $P_{man} = ${pmanAtm.toFixed(1)} \\text{ atm}$. Convertida a pascales (S.I.):
            <br>$$P_{man} = ${pmanAtm.toFixed(1)} \\cdot 101,325 \\text{ Pa} = ${pmanPa.toFixed(0)} \\text{ Pa}$$`
          },
          {
            title: "3. Sustitución y Resolución",
            description: `Evaluamos los dos componentes de energía:
            <br>• Aporte gravitatorio ($2gh$): $2 \\cdot 9.81 \\cdot ${h} = ${termHeight.toFixed(2)} \\text{ m}^2/\\text{s}^2$
            <br>• Aporte de presión ($2P_{man}/\\rho$): $\\frac{2 \\cdot ${pmanPa.toFixed(0)}}{1000} = ${termPressure.toFixed(2)} \\text{ m}^2/\\text{s}^2$
            <br>Sumando ambos aportes y extrayendo la raíz cuadrada:
            <br>$$v = \\sqrt{${termHeight.toFixed(2)} + ${termPressure.toFixed(2)}} = \\sqrt{${(termHeight + termPressure).toFixed(2)}} = ${v.toFixed(3)} \\text{ m/s}$$`
          }
        ],
        result: {
          value: v.toFixed(2),
          unit: "m/s",
          summary: `El agua presurizada sale disparada del tanque a una velocidad de **${v.toFixed(2)} m/s**.`
        },
        diagramData: { h, pmanAtm, v }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Tanque Sellado -->
          <rect x="70" y="20" width="130" height="120" fill="none" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="70" y1="20" x2="200" y2="20" stroke="var(--color-text)" stroke-width="3"/>
          
          <!-- Agua -->
          <rect x="71" y="60" width="128" height="80" fill="#e3f2fd" stroke="none"/>
          <line x1="71" y1="60" x2="199" y2="60" stroke="#1565c0" stroke-width="2"/>
          
          <!-- Aire Comprimido Superior -->
          <rect x="71" y="21" width="128" height="39" fill="rgba(255,152,0,0.15)" stroke="none"/>
          <text x="85" y="42" fill="#e65100" font-weight="bold" font-size="11">Aire: P_man = ${data.pmanAtm} atm</text>
          
          <!-- Orificio lateral inferior -->
          <rect x="200" y="115" width="10" height="10" fill="#e3f2fd" stroke="none" />
          <line x1="200" y1="20" x2="200" y2="115" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="200" y1="125" x2="200" y2="140" stroke="var(--color-text)" stroke-width="2"/>
          <line x1="70" y1="140" x2="200" y2="140" stroke="var(--color-text)" stroke-width="2"/>
          
          <!-- Chorro de agua saliendo (gran parábola) -->
          <path d="M 200 120 Q 280 120 350 140" stroke="#1e88e5" stroke-width="3" fill="none"/>
          
          <text x="230" y="105" fill="var(--color-primary)" font-weight="bold" font-size="12">v = ${data.v.toFixed(2)} m/s</text>
          <text x="110" y="95" fill="var(--color-text)" font-size="10">h = ${data.h} m</text>
        </svg>`;
    }
  },

  // ==========================================
  // BLOQUE D: EFECTO VENTURI (15 - 17)
  // ==========================================
  {
    id: 15,
    category: "venturi",
    title: "Medidor de Caudal Venturi",
    difficulty: "Media",
    concept: "Un tubo Venturi tiene un estrechamiento (garganta) intermedio. Al medir la diferencia de presión hidrodinámica entre la entrada ancha y la garganta estrecha, podemos determinar con precisión el caudal volumétrico de agua sin necesidad de un medidor mecánico complejo.",
    formula: "Q = A_1 \\cdot \\sqrt{\\frac{2 \\Delta P}{\\rho ((A_1/A_2)^2 - 1)}}",
    statement: "Un medidor de Venturi conduce agua de densidad $\\rho = 1000 \\text{ kg/m}^3$. El diámetro del tramo principal es $D_1$ y el de la garganta es $D_2$. Si un sensor registra una diferencia de presión de $\\Delta P$ entre ambos puntos, calcula el caudal volumétrico $Q$ en litros por minuto.",
    inputs: [
      { name: "d1", label: "Diámetro Principal (D₁)", value: 20.0, unit: "cm", min: 4.0, max: 60.0, step: 1.0 },
      { name: "d2", label: "Diámetro Garganta (D₂)", value: 10.0, unit: "cm", min: 2.0, max: 29.0, step: 0.5 },
      { name: "dp", label: "Dif. de Presión (ΔP)", value: 20.0, unit: "kPa", min: 1.0, max: 150.0, step: 1.0 }
    ],
    calculate: (inputs) => {
      const rho = 1000;
      const d1 = Number(inputs.d1) / 100;
      const d2 = Number(inputs.d2) / 100;
      const dp = Number(inputs.dp) * 1000; // Pa

      const a1 = Math.PI * (d1*d1) / 4;
      const a2 = Math.PI * (d2*d2) / 4;

      const areaRatio = a1 / a2;
      const termDenom = (areaRatio * areaRatio) - 1;
      const v1 = Math.sqrt((2 * dp) / (rho * termDenom));
      const q = a1 * v1; // m3/s
      const qLpm = q * 60000; // L/min

      return {
        steps: [
          {
            title: "1. Áreas transversales y relación geométrica",
            description: `Calculamos las secciones circulares del tubo principal y del estrechamiento:
            <br>• $A_1 = \\frac{\\pi D_1^2}{4} = \\frac{\\pi (${d1.toFixed(2)} \\text{ m})^2}{4} = ${a1.toExponential(4)} \\text{ m}^2$
            <br>• $A_2 = \\frac{\\pi D_2^2}{4} = \\frac{\\pi (${d2.toFixed(2)} \\text{ m})^2}{4} = ${a2.toExponential(4)} \\text{ m}^2$
            <br>Relación de áreas ($A_1/A_2$):
            <br>$$\\frac{A_1}{A_2} = \\frac{${a1.toExponential(4)}}{${a2.toExponential(4)}} = ${areaRatio.toFixed(3)}$$
            <br>Factor geométrico cuadrático: $\\left(\\frac{A_1}{A_2}\\right)^2 - 1 = ${(areaRatio*areaRatio).toFixed(3)} - 1 = ${termDenom.toFixed(3)}$`
          },
          {
            title: "2. Aplicación de la Ecuación combinada de Venturi",
            description: `La ecuación combinada de Bernoulli y continuidad despeja el caudal $Q$:
            <br>$$Q = A_1 \\cdot v_1 = A_1 \\cdot \\sqrt{\\frac{2 \\Delta P}{\\rho \\left[\\left(\\frac{A_1}{A_2}\\right)^2 - 1\\right]}}$$`
          },
          {
            title: "3. Sustitución de Datos y Caudal",
            description: `Sustituimos la densidad $\\rho = 1000 \\text{ kg/m}^3$ y $\\Delta P = ${inputs.dp} \\text{ kPa} = ${dp} \\text{ Pa}$:
            <br>$$v_1 = \\sqrt{\\frac{2 \\cdot ${dp}}{1000 \\cdot ${termDenom.toFixed(3)}}} = \\sqrt{\\frac{${2*dp}}{${(1000*termDenom).toFixed(1)}}} = ${v1.toFixed(3)} \\text{ m/s}$$
            <br>Por lo tanto:
            <br>$$Q = (${a1.toExponential(4)} \\text{ m}^2) \\cdot (${v1.toFixed(3)} \\text{ m/s}) = ${q.toExponential(4)} \\text{ m}^3/s$$
            <br>Convertimos a litros por minuto ($1 \\text{ m}^3/s = 60,000 \\text{ L/min}$):
            <br>$$Q = ${q.toExponential(4)} \\cdot 60,000 = ${qLpm.toFixed(2)} \\text{ L/min}$$`
          }
        ],
        result: {
          value: qLpm.toFixed(1),
          unit: "L/min",
          summary: `El caudal volumétrico registrado por el tubo de Venturi es de **${qLpm.toFixed(1)} L/min**.`
        },
        diagramData: { d1: Number(inputs.d1), d2: Number(inputs.d2), dp: Number(inputs.dp), qLpm }
      };
    },
    svgTemplate: (data) => {
      const h1 = Math.min(65, Math.max(30, data.d1 * 2.5));
      const h2 = Math.min(30, Math.max(10, data.d2 * 2.5));
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Tubo Venturi -->
          <path d="M 40 ${80 - h1/2} L 150 ${80 - h1/2} C 180 ${80 - h1/2}, 180 ${80 - h2/2}, 200 ${80 - h2/2} C 220 ${80 - h2/2}, 220 ${80 - h1/2}, 250 ${80 - h1/2} L 360 ${80 - h1/2}
                   L 360 ${80 + h1/2} C 250 ${80 + h1/2}, 220 ${80 + h1/2}, 220 ${80 + h2/2} C 180 ${80 + h2/2}, 180 ${80 + h1/2}, 150 ${80 + h1/2} L 40 ${80 + h1/2} Z" 
                fill="rgba(33, 150, 243, 0.25)" stroke="var(--color-text)" stroke-width="2" />
          
          <!-- Diferencia de presión conceptual (columnas manométricas verticales) -->
          <line x1="90" y1="${80 - h1/2}" x2="90" y2="20" stroke="var(--color-text)" stroke-width="1.5"/>
          <line x1="200" y1="${80 - h2/2}" x2="200" y2="40" stroke="var(--color-text)" stroke-width="1.5"/>
          
          <!-- Columnas agua en manómetro -->
          <rect x="87" y="35" width="6" height="${80 - h1/2 - 35}" fill="#2196f3" opacity="0.6"/>
          <rect x="197" y="55" width="6" height="${80 - h2/2 - 55}" fill="#2196f3" opacity="0.6"/>
          
          <line x1="80" y1="35" x2="210" y2="35" stroke="red" stroke-width="1" stroke-dasharray="2 2"/>
          <line x1="190" y1="55" x2="210" y2="55" stroke="red" stroke-width="1" stroke-dasharray="2 2"/>
          <text x="215" y="48" fill="red" font-size="10">ΔP = ${data.dp} kPa</text>
          
          <text x="50" y="${80 + h1/2 + 15}" fill="var(--color-text)" font-size="10">D₁ = ${data.d1} cm</text>
          <text x="175" y="${80 + h2/2 + 20}" fill="var(--color-text)" font-size="10">D₂ = ${data.d2} cm</text>
          <text x="270" y="${80 + h1/2 + 15}" fill="var(--color-primary)" font-weight="bold" font-size="11">Q = ${data.qLpm.toFixed(1)} L/min</text>
        </svg>`;
    }
  },
  {
    id: 16,
    category: "venturi",
    title: "Tubo Venturi con Manómetro de Mercurio",
    difficulty: "Difícil",
    concept: "Al conectar un manómetro de tubo en U que contiene un líquido pesado como el mercurio, la diferencia en el nivel de las columnas es una medida directa de la diferencia de presión. Esto nos permite determinar la velocidad del flujo de agua.",
    formula: "v_1 = \\sqrt{\\frac{2g \\Delta h (\\rho_{Hg} - \\rho_{H2O})}{\\rho_{H2O} ((D_1/D_2)^4 - 1)}}",
    statement: "Un tubo Venturi transporta agua (densidad $\\rho_{agua} = 1000 \\text{ kg/m}^3$) y tiene instalado un manómetro diferencial de tubo en U con mercurio (densidad $\\rho_{Hg} = 13600 \\text{ kg/m}^3$). El diámetro principal es $D_1$ y el de la garganta es $D_2$. Si la diferencia de altura de las columnas de mercurio es $\\Delta h$, determina la velocidad $v_1$ en el tramo principal.",
    inputs: [
      { name: "d1", label: "Diámetro Principal (D₁)", value: 15.0, unit: "cm", min: 3.0, max: 40.0, step: 0.5 },
      { name: "d2", label: "Diámetro Garganta (D₂)", value: 7.5, unit: "cm", min: 1.0, max: 14.5, step: 0.5 },
      { name: "dh", label: "Diferencia Mercurio (Δh)", value: 12.0, unit: "cm", min: 1.0, max: 80.0, step: 0.5 }
    ],
    calculate: (inputs) => {
      const rhoWater = 1000;
      const rhoHg = 13600;
      const g = 9.81;
      const d1 = Number(inputs.d1);
      const d2 = Number(inputs.d2);
      const dh = Number(inputs.dh) / 100; // m

      // Relación de diámetros
      const diamRatio = d1 / d2;
      const diamRatio4 = Math.pow(diamRatio, 4);

      // Presión hidrostática de manómetro: ΔP = (ρHg - ρH2O) * g * Δh
      const dp = (rhoHg - rhoWater) * g * dh;
      const dpKpa = dp / 1000;

      // Velocidad v1
      const v1 = Math.sqrt((2 * dp) / (rhoWater * (diamRatio4 - 1)));
      const v2 = v1 * diamRatio * diamRatio;

      return {
        steps: [
          {
            title: "1. Cálculo de la Diferencia de Presión ($\\Delta P$)",
            description: `La columna de mercurio de altura $\\Delta h = ${inputs.dh} \\text{ cm} = ${dh.toFixed(3)} \\text{ m}$ equilibra la diferencia de presiones entre los puntos 1 y 2:
            <br>$$\\Delta P = P_1 - P_2 = (\\rho_{Hg} - \\rho_{agua}) \\cdot g \\cdot \\Delta h$$
            <br>$$\\Delta P = (13,600 - 1000) \\cdot 9.81 \\cdot ${dh.toFixed(3)}$$
            <br>$$\\Delta P = 12,600 \\cdot 9.81 \\cdot ${dh.toFixed(3)} = ${dp.toFixed(1)} \\text{ Pa} \\approx ${dpKpa.toFixed(2)} \\text{ kPa}$$`
          },
          {
            title: "2. Planteamiento de Continuidad y Bernoulli",
            description: `Sabemos que $v_2 = v_1 \\cdot (D_1/D_2)^2$. Sustituimos en la ecuación horizontal de Bernoulli:
            <br>$$P_1 - P_2 = \\frac{1}{2}\\rho_{agua} (v_2^2 - v_1^2)$$
            <br>$$\\Delta P = \\frac{1}{2}\\rho_{agua} \\cdot v_1^2 \\left[ \\left(\\frac{D_1}{D_2}\\right)^4 - 1 \\right]$$
            <br>Despejamos $v_1$:
            <br>$$v_1 = \\sqrt{\\frac{2 \\Delta P}{\\rho_{agua} \\left[ \\left(\\frac{D_1}{D_2}\\right)^4 - 1 \\right]}}$$`
          },
          {
            title: "3. Cálculo Numérico",
            description: `Relación de diámetros: $D_1/D_2 = ${d1} / ${d2} = ${diamRatio.toFixed(2)}$
            <br>Elevando a la cuarta potencia: $(${diamRatio.toFixed(2)})^4 = ${diamRatio4.toFixed(3)}$
            <br>Factor del denominador: $${diamRatio4.toFixed(3)} - 1 = ${(diamRatio4 - 1).toFixed(3)}$
            <br>Sustituyendo en la raíz:
            <br>$$v_1 = \\sqrt{\\frac{2 \\cdot ${dp.toFixed(1)}}{1000 \\cdot ${(diamRatio4 - 1).toFixed(3)}}} = \\sqrt{\\frac{${(2*dp).toFixed(1)}}{${(1000 * (diamRatio4 - 1)).toFixed(1)}}} = ${v1.toFixed(3)} \\text{ m/s}$$`
          }
        ],
        result: {
          value: v1.toFixed(2),
          unit: "m/s",
          summary: `La velocidad del agua en el tramo principal del tubo es de **${v1.toFixed(2)} m/s** (garganta $v_2$ = ${v2.toFixed(2)} m/s).`
        },
        diagramData: { d1, d2, dh: Number(inputs.dh), v1, dpKpa }
      };
    },
    svgTemplate: (data) => {
      const w1 = Math.min(50, Math.max(25, data.d1 * 2.5));
      const w2 = Math.min(25, Math.max(8, data.d2 * 2.5));
      const dhPix = Math.min(40, Math.max(10, data.dh * 0.4));
      return `
        <svg viewBox="0 0 400 180" class="physics-diagram">
          <!-- Tubo Venturi -->
          <path d="M 50 ${60 - w1/2} L 150 ${60 - w1/2} C 180 ${60 - w1/2}, 180 ${60 - w2/2}, 200 ${60 - w2/2} C 220 ${60 - w2/2}, 220 ${60 - w1/2}, 250 ${60 - w1/2} L 350 ${60 - w1/2}
                   L 350 ${60 + w1/2} L 250 ${60 + w1/2} C 220 ${60 + w1/2}, 220 ${60 + w2/2}, 200 ${60 + w2/2} C 180 ${60 + w2/2}, 180 ${60 + w1/2}, 150 ${60 + w1/2} L 50 ${60 + w1/2} Z" 
                fill="rgba(33, 150, 243, 0.2)" stroke="var(--color-text)" stroke-width="2"/>
          
          <!-- Manómetro de tubo en U -->
          <path d="M 120 ${60 + w1/2} L 120 140 A 15 15 0 0 0 150 140 L 150 130 A 15 15 0 0 0 180 130 L 180 ${60 + w2/2}" fill="none" stroke="var(--color-text)" stroke-width="10" stroke-linecap="square"/>
          <path d="M 120 ${60 + w1/2} L 120 140 A 15 15 0 0 0 150 140 L 150 130 A 15 15 0 0 0 180 130 L 180 ${60 + w2/2}" fill="none" stroke="#e0e0e0" stroke-width="6" stroke-linecap="square"/>
          
          <!-- Mercurio (Gris oscuro pesado en el fondo y lados desiguales) -->
          <!-- Columna izquierda: menor presión -> empuja mercurio hacia arriba. Espera, P1 > P2, por lo que P1 empuja mercurio hacia abajo, P2 sube -->
          <path d="M 120 115 L 120 140 A 15 15 0 0 0 150 140 L 150 130 A 15 15 0 0 0 180 130 L 180 ${115 - dhPix}" fill="none" stroke="#757575" stroke-width="6" stroke-linecap="square"/>

          <line x1="110" y1="115" x2="190" y2="115" stroke="red" stroke-width="0.8" stroke-dasharray="2 2"/>
          <line x1="170" y1="${115 - dhPix}" x2="190" y2="${115 - dhPix}" stroke="red" stroke-width="0.8" stroke-dasharray="2 2"/>
          
          <text x="195" y="${118 - dhPix/2}" fill="red" font-size="10">Δh = ${data.dh} cm</text>
          
          <text x="60" y="30" fill="var(--color-text)" font-size="10">D₁ = ${data.d1} cm</text>
          <text x="210" y="30" fill="var(--color-text)" font-size="10">D₂ = ${data.d2} cm</text>
          <text x="250" y="${60 + w1/2 + 20}" fill="var(--color-primary)" font-weight="bold" font-size="11">v₁ = ${data.v1.toFixed(2)} m/s</text>
        </svg>`;
    }
  },
  {
    id: 17,
    category: "venturi",
    title: "Pulverizador de Perfume",
    difficulty: "Media",
    concept: "Al presionar la bomba de un atomizador, soplamos aire horizontalmente a gran velocidad sobre un capilar vertical. La baja presión creada por la velocidad succiona el perfume del fondo del frasco. Una vez que llega arriba, la misma corriente de aire rompe el líquido en diminutas microgotas.",
    formula: "h_{succion} = \\frac{\\rho_{aire} \\cdot v_{aire}^2}{2 \\cdot \\rho_{liq} \\cdot g}",
    statement: "Un atomizador de perfume funciona inyectando aire horizontal (densidad $\\rho_{aire} = 1.2 \\text{ kg/m}^3$) a una velocidad de $v_{air}$ sobre el extremo superior de un capilar vertical sumergido en perfume (densidad $\\rho_{liq} = 950 \\text{ kg/m}^3$). Calcula a qué altura máxima $h$ puede ascender la columna de perfume por efecto de la succión.",
    inputs: [
      { name: "vair", label: "Velocidad Aire (v_aire)", value: 25.0, unit: "m/s", min: 5.0, max: 60.0, step: 1.0 },
      { name: "rholiq", label: "Densidad Perfume (ρ_liq)", value: 950.0, unit: "kg/m³", min: 800.0, max: 1100.0, step: 10.0 }
    ],
    calculate: (inputs) => {
      const rhoAir = 1.2;
      const rhoLiq = Number(inputs.rholiq);
      const g = 9.81;
      const vair = Number(inputs.vair);

      // Presión dinámica aire: 0.5 * rhoAir * v^2 = ΔP = P_atm - P_tubo
      const dp = 0.5 * rhoAir * vair * vair; // Pa

      // Equilibrio hidrostático en el tubo vertical: ΔP = ρliq * g * h
      const h = dp / (rhoLiq * g); // m
      const hCm = h * 100; // cm

      return {
        steps: [
          {
            title: "1. Presión Dinámica del Flujo de Aire",
            description: `El aire comprimido soplado a velocidad $v = ${vair} \\text{ m/s}$ disminuye la presión por encima del capilar. Calculamos la caída de presión $\\Delta P$ usando Bernoulli para el aire:
            <br>$$\\Delta P = P_{atm} - P_{cima} = \\frac{1}{2} \\rho_{aire} v_{aire}^2$$
            <br>$$\\Delta P = 0.5 \\cdot 1.2 \\text{ kg/m}^3 \\cdot (${vair} \\text{ m/s})^2$$
            <br>$$\\Delta P = 0.6 \\cdot ${vair*vair} = ${dp.toFixed(1)} \\text{ Pa}$$`
          },
          {
            title: "2. Elevación Hidrostática del Perfume",
            description: `Para que el perfume suba por el tubo hasta la boca superior, la succión debe equilibrar la columna de líquido estático de altura $h$:
            <br>$$\\Delta P = \\rho_{liq} \\cdot g \\cdot h$$
            <br>Despejamos la altura de ascenso $h$:
            <br>$$h = \\frac{\\Delta P}{\\rho_{liq} \\cdot g}$$`
          },
          {
            title: "3. Sustitución de Valores",
            description: `Sustituimos la densidad del perfume $\\rho_{liq} = ${rhoLiq} \\text{ kg/m}^3$ y $g = 9.81 \\text{ m/s}^2$:
            <br>$$h = \\frac{${dp.toFixed(1)} \\text{ Pa}}{${rhoLiq} \\text{ kg/m}^3 \\cdot 9.81 \\text{ m/s}^2}$$
            <br>$$h = \\frac{${dp.toFixed(1)}}{${(rhoLiq * g).toFixed(1)}} = ${h.toFixed(4)} \\text{ m}$$
            <br>Convertido a centímetros:
            <br>$$h = ${hCm.toFixed(2)} \\text{ cm}$$`
          }
        ],
        result: {
          value: hCm.toFixed(2),
          unit: "cm",
          summary: `El perfume es succionado y asciende una altura de hasta **${hCm.toFixed(2)} cm** antes de atomizarse.`
        },
        diagramData: { vair, rholiq: rhoLiq, hCm }
      };
    },
    svgTemplate: (data) => {
      const hPix = Math.min(75, Math.max(10, data.hCm * 5));
      const speed = Math.max(1, data.vair / 12);
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Frasco de perfume -->
          <rect x="150" y="80" width="80" height="70" rx="10" fill="rgba(233,30,99,0.15)" stroke="#ad1457" stroke-width="2"/>
          <rect x="152" y="110" width="76" height="38" rx="2" fill="rgba(233,30,99,0.3)" stroke="none"/>
          
          <!-- Capilar vertical -->
          <rect x="187" y="50" width="6" height="80" fill="none" stroke="var(--color-text)" stroke-width="1"/>
          <!-- Columna líquida subiendo por el capilar -->
          <rect x="188.5" y="${130 - hPix}" width="3" height="${hPix}" fill="#e91e63" stroke="none" />
          
          <!-- Boquilla de aire horizontal -->
          <rect x="110" y="44" width="70" height="8" fill="#9e9e9e" stroke="#616161"/>
          <!-- Aire saliendo -->
          <path d="M 180 48 L 290 48" stroke="var(--color-primary)" stroke-width="2" stroke-dasharray="10 8">
            <animate attributeName="stroke-dashoffset" values="100;0" dur="${1.5/speed}s" repeatCount="indefinite"/>
          </path>
          
          <!-- Microgotas a la salida -->
          <circle cx="210" cy="48" r="1.5" fill="#e91e63"/>
          <circle cx="230" cy="46" r="1" fill="#e91e63"/>
          <circle cx="250" cy="50" r="1.2" fill="#e91e63"/>
          <circle cx="270" cy="45" r="0.8" fill="#e91e63"/>
          
          <text x="40" y="30" fill="var(--color-text)" font-size="11">Corriente de Aire: ${data.vair} m/s</text>
          <text x="210" y="105" fill="var(--color-primary-dark)" font-weight="bold" font-size="11">h = ${data.hCm.toFixed(1)} cm</text>
        </svg>`;
    }
  },

  // ==========================================
  // BLOQUE E: VISCOSIDAD Y LEY DE POISEUILLE (18 - 20)
  // ==========================================
  {
    id: 18,
    category: "poiseuille",
    title: "Flujo de Sangre en un Vaso Capilar",
    difficulty: "Fácil",
    concept: "La ley de Poiseuille rige los fluidos reales que tienen viscosidad (fricción interna). Al ser la sangre viscosa, requiere una diferencia de presión constante a lo largo del vaso capilar para mantener su flujo. La resistencia es extremadamente sensible al radio del vaso capilar (elevado a la cuarta potencia).",
    formula: "Q = \\frac{\\pi \\cdot R^4 \\cdot \\Delta P}{8 \\cdot \\eta \\cdot L}",
    statement: "La sangre (viscosidad $\\eta = 0.003 \\text{ Pa}\\cdot\\text{s}$) fluye a lo largo de un pequeño capilar sanguíneo de longitud $L$ y radio interno $R$. Si la caída de presión manométrica entre los extremos del capilar es $\\Delta P$, calcula el caudal de sangre $Q$ en metros cúbicos por segundo y litros por día.",
    inputs: [
      { name: "R", label: "Radio Capilar (R)", value: 4.0, unit: "μm", min: 1.0, max: 20.0, step: 0.5 },
      { name: "L", label: "Longitud Capilar (L)", value: 1.0, unit: "mm", min: 0.1, max: 5.0, step: 0.1 },
      { name: "dp", label: "Diferencia de Presión (ΔP)", value: 2.0, unit: "kPa", min: 0.5, max: 10.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const eta = 0.003; // Pa s
      const R = Number(inputs.R) / 1000000; // μm a m
      const L = Number(inputs.L) / 1000; // mm a m
      const dp = Number(inputs.dp) * 1000; // Pa

      // Poiseuille: Q = (pi * R^4 * dp) / (8 * eta * L)
      const r4 = Math.pow(R, 4);
      const numer = Math.PI * r4 * dp;
      const denom = 8 * eta * L;
      const q = numer / denom; // m3/s

      // Conversión a litros por día: 1 m3/s = 1e3 L/s * 3600s/h * 24h/d = 8.64e7 L/día
      const qLpd = q * 1000 * 3600 * 24;

      return {
        steps: [
          {
            title: "1. Conversiones de variables al Sistema Internacional",
            description: `Convertimos las dimensiones microscópicas y presiones:
            <br>• Radio capilar: $R = ${inputs.R} \\text{ }\\mu\\text{m} = ${R.toExponential(4)} \\text{ m}$
            <br>• Longitud: $L = ${inputs.L} \\text{ mm} = ${L.toExponential(4)} \\text{ m}$
            <br>• Caída de presión: $\\Delta P = ${inputs.dp} \\text{ kPa} = ${dp.toFixed(0)} \\text{ Pa}$
            <br>• Viscosidad de la sangre: $\\eta = 0.003 \\text{ Pa}\\cdot\\text{s}$`
          },
          {
            title: "2. Aplicación de la Ley de Poiseuille",
            description: `Para flujo laminar viscoso continuo en conductos cilíndricos:
            <br>$$Q = \\frac{\\pi R^4 \\Delta P}{8 \\eta L}$$
            <br>Calculamos el término de potencia cuarta del radio:
            <br>$$R^4 = (${R.toExponential(4)} \\text{ m})^4 = ${r4.toExponential(4)} \\text{ m}^4$$`
          },
          {
            title: "3. Resolución Matemática del Caudal",
            description: `Sustituimos todos los valores numéricos:
            <br>$$Q = \\frac{\\pi \\cdot (${r4.toExponential(4)}) \\cdot ${dp.toFixed(0)}}{8 \\cdot 0.003 \\cdot ${L.toExponential(4)}}$$
            <br>$$Q = \\frac{${numer.toExponential(4)}}{${denom.toExponential(4)}} = ${q.toExponential(4)} \\text{ m}^3/s$$
            <br>Convertido a unidades útiles diarias (litros por día):
            <br>$$Q_{dia} = ${q.toExponential(4)} \\cdot (1000 \\text{ L/m}^3) \\cdot (86,400 \\text{ s/día}) = ${qLpd.toExponential(4)} \\text{ L/día} \\approx ${qLpd.toFixed(5)} \\text{ L/día}$$`
          }
        ],
        result: {
          value: q.toExponential(3),
          unit: "m³/s",
          summary: `El caudal en el capilar es de **${q.toExponential(3)} m³/s** (aproximadamente **${qLpd.toFixed(4)} litros al día**).`
        },
        diagramData: { R: Number(inputs.R), L: Number(inputs.L), q }
      };
    },
    svgTemplate: (data) => {
      const radiusH = Math.min(30, Math.max(6, data.R * 4));
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Vaso capilar -->
          <rect x="50" y="${80 - radiusH}" width="280" height="${radiusH * 2}" fill="rgba(244,67,54,0.15)" stroke="#d32f2f" stroke-width="2"/>
          
          <!-- Flujo parabólico (Ley de Poiseuille: la velocidad en los bordes es cero y máxima en el centro) -->
          <path d="M 80 ${80 - radiusH + 2} Q 130 80 80 ${80 + radiusH - 2}" fill="none" stroke="#d32f2f" stroke-width="1.5" />
          <path d="M 140 ${80 - radiusH + 4} Q 210 80 140 ${80 + radiusH - 4}" fill="none" stroke="#d32f2f" stroke-width="2" />
          <path d="M 200 ${80 - radiusH + 6} Q 290 80 200 ${80 + radiusH - 6}" fill="none" stroke="#d32f2f" stroke-width="2.5" />
          
          <!-- Flecha de empuje central -->
          <line x1="60" y1="80" x2="330" y2="80" stroke="#c62828" stroke-width="1.5" marker-end="url(#arrow)">
            <animate attributeName="stroke-dashoffset" values="50;0" dur="2s" repeatCount="indefinite"/>
          </line>
          
          <text x="60" y="35" fill="var(--color-text)" font-size="11">Capilar: L = ${data.L} mm</text>
          <text x="60" y="140" fill="var(--color-text)" font-size="10">Radio R = ${data.R} μm</text>
          <text x="220" y="140" fill="var(--color-primary)" font-weight="bold" font-size="11">Q = ${data.q.toExponential(2)} m³/s</text>
        </svg>`;
    }
  },
  {
    id: 19,
    category: "poiseuille",
    title: "Pérdida de Presión en Oleoducto de Crudo",
    difficulty: "Difícil",
    concept: "El petróleo crudo es un fluido sumamente viscoso. Al bombearlo a través de kilómetros de tubería, la resistencia viscosa por fricción genera una enorme caída de presión que exige la instalación de potentes estaciones de bombeo intermitentes para mantener el flujo constante.",
    formula: "\\Delta P = \\frac{8 \\cdot \\eta \\cdot L \\cdot Q}{\\pi \\cdot R^4}",
    statement: "Se bombea petróleo pesado (viscosidad $\\eta = 0.20 \\text{ Pa}\\cdot\\text{s}$) a lo largo de un oleoducto de longitud $L$ y diámetro interno $D$ a razón de un caudal de $Q$. Calcula la diferencia de presión $\\Delta P$ requerida entre los extremos del tubo para vencer la fricción viscosa.",
    inputs: [
      { name: "L", label: "Longitud Tubo (L)", value: 5.0, unit: "km", min: 0.5, max: 25.0, step: 0.5 },
      { name: "d", label: "Diámetro Interno (D)", value: 30.0, unit: "cm", min: 10.0, max: 100.0, step: 2.0 },
      { name: "qLps", label: "Caudal (Q)", value: 40.0, unit: "L/s", min: 5.0, max: 500.0, step: 5.0 }
    ],
    calculate: (inputs) => {
      const eta = 0.20; // Pa s
      const L = Number(inputs.L) * 1000; // a metros
      const d = Number(inputs.d) / 100; // a metros
      const R = d / 2;
      const q = Number(inputs.qLps) / 1000; // L/s a m3/s

      // Poiseuille despejando ΔP: ΔP = (8 * eta * L * Q) / (pi * R^4)
      const r4 = Math.pow(R, 4);
      const numer = 8 * eta * L * q;
      const denom = Math.PI * r4;
      const dp = numer / denom; // Pa
      const dpKpa = dp / 1000; // kPa

      return {
        steps: [
          {
            title: "1. Adecuación de Variables al S.I.",
            description: `Convertimos unidades a metros, pascales y metros cúbicos:
            <br>• Longitud del tramo de oleoducto: $L = ${inputs.L} \\text{ km} = ${L} \\text{ m}$
            <br>• Radio interno: $R = \\frac{D}{2} = \\frac{${inputs.d} \\text{ cm}}{2} = 15 \\text{ cm} = ${R.toFixed(3)} \\text{ m}$
            <br>• Caudal volumétrico de flujo: $Q = ${inputs.qLps} \\text{ L/s} = ${q.toFixed(4)} \\text{ m}^3/s$
            <br>• Viscosidad dinámica del crudo: $\\eta = 0.20 \\text{ Pa}\\cdot\\text{s}$`
          },
          {
            title: "2. Formulación y Cálculo del Denominador",
            description: `Utilizando la ecuación de caída de presión de Poiseuille:
            <br>$$\\Delta P = \\frac{8 \\eta L Q}{\\pi R^4}$$
            <br>Evaluamos la potencia cuarta del radio en metros:
            <br>$$R^4 = (${R.toFixed(3)} \\text{ m})^4 = ${r4.toExponential(4)} \\text{ m}^4$$
            <br>El denominador es: $\\pi \\cdot R^4 = \\pi \\cdot (${r4.toExponential(4)}) = ${denom.toExponential(4)} \\text{ m}^4$`
          },
          {
            title: "3. Evaluación y Resultado",
            description: `Sustituimos el numerador y efectuamos la división:
            <br>$$\\Delta P = \\frac{8 \\cdot 0.20 \\cdot ${L} \\cdot ${q.toFixed(4)}}{${denom.toExponential(4)}}$$
            <br>$$\\Delta P = \\frac{${numer.toFixed(2)}}{${denom.toExponential(4)}} = ${dp.toFixed(1)} \\text{ Pa}$$
            <br>Convertido a kilopascales (kPa) para una mejor comprensión práctica:
            <br>$$\\Delta P = \\frac{${dp.toFixed(1)} \\text{ Pa}}{1000} = ${dpKpa.toFixed(2)} \\text{ kPa}$$`
          }
        ],
        result: {
          value: dpKpa.toFixed(1),
          unit: "kPa",
          summary: `Se requiere una diferencia de presión manométrica de **${dpKpa.toFixed(1)} kPa** (aprox. ${(dpKpa/101.3).toFixed(2)} atm) entre los extremos del tramo.`
        },
        diagramData: { L, d: Number(inputs.d), qLps: Number(inputs.qLps), dpKpa }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 160" class="physics-diagram">
          <!-- Tubería de oleoducto gruesa -->
          <rect x="40" y="65" width="320" height="30" fill="none" stroke="var(--color-text)" stroke-width="3"/>
          <rect x="40" y="66.5" width="320" height="27" fill="rgba(121,85,72,0.2)" stroke="none"/>
          
          <!-- Fluido espeso marrón de petróleo -->
          <rect x="40" y="70" width="320" height="20" fill="#4e342e" opacity="0.8"/>
          
          <!-- Estación bomba inicial -->
          <rect x="60" y="45" width="40" height="20" fill="#3e2723" stroke="var(--color-text)"/>
          <text x="65" y="58" fill="#fff" font-size="10">BOMBA</text>
          
          <!-- Cotas e información -->
          <text x="60" y="115" fill="var(--color-text)" font-size="11">Oleoducto: L = ${(data.L/1000).toFixed(1)} km</text>
          <text x="60" y="132" fill="var(--color-text)" font-size="10">Diámetro D = ${data.d} cm</text>
          <text x="210" y="132" fill="var(--color-primary)" font-weight="bold" font-size="11">ΔP Requerida = ${data.dpKpa.toFixed(1)} kPa</text>
        </svg>`;
    }
  },
  {
    id: 20,
    category: "poiseuille",
    title: "Gotero de Suero Intravenoso",
    difficulty: "Difícil",
    concept: "La administración de suero intravenoso se realiza por gravedad. Elevando la botella de suero sobre el brazo del paciente se genera la presión suficiente para vencer la resistencia viscosa de la aguja muy delgada y la propia presión arterial interna del paciente.",
    formula: "Q = \\frac{\\pi \\cdot r^4 \\cdot (\\rho g h - P_{arterial})}{8 \\cdot \\eta \\cdot L}",
    statement: "A un paciente se le administra solución salina (viscosidad $\\eta = 0.001 \\text{ Pa}\\cdot\\text{s}$, densidad $\\rho = 1000 \\text{ kg/m}^3$) mediante gravedad. La botella está colgada a una altura $h$ sobre el brazo del paciente. La aguja insertada tiene una longitud de $L$ y un radio interior $r$. Suponiendo que la presión venosa en el brazo es $P_{vena}$, calcula el caudal $Q$ en centímetros cúbicos por minuto ($cm^3/min$).",
    inputs: [
      { name: "h", label: "Altura Botella (h)", value: 1.0, unit: "m", min: 0.2, max: 2.5, step: 0.1 },
      { name: "L", label: "Longitud Aguja (L)", value: 4.0, unit: "cm", min: 1.0, max: 6.0, step: 0.5 },
      { name: "r", label: "Radio Aguja (r)", value: 0.25, unit: "mm", min: 0.1, max: 1.0, step: 0.05 },
      { name: "pven", label: "Presión Venosa (P_vena)", value: 1.5, unit: "kPa", min: 0.5, max: 5.0, step: 0.1 }
    ],
    calculate: (inputs) => {
      const eta = 0.001; // Pa s
      const rho = 1000;
      const g = 9.81;
      
      const h = Number(inputs.h);
      const L = Number(inputs.L) / 100; // cm a m
      const r = Number(inputs.r) / 1000; // mm a m
      const pven = Number(inputs.pven) * 1000; // Pa

      // Presión hidrostática de la columna de suero: P = rho * g * h
      const pcol = rho * g * h;

      // Presión efectiva útil: Pcol - Pvena
      const pef = pcol - pven;

      let q = 0;
      let qCcm = 0;
      let errorState = false;

      if (pef <= 0) {
        errorState = true;
      } else {
        // Poiseuille: Q = (pi * r^4 * Pef) / (8 * eta * L)
        const r4 = Math.pow(r, 4);
        q = (Math.PI * r4 * pef) / (8 * eta * L); // m3/s
        qCcm = q * 1000000 * 60; // cm3/min o mL/min
      }

      return {
        steps: [
          {
            title: "1. Cálculo de la Presión Hidrostática por Gravedad ($P_{columna}$)",
            description: `La altura de elevación de la botella es $h = ${h.toFixed(2)} \\text{ m}$. La presión que ejerce la columna de suero es:
            <br>$$P_{columna} = \\rho g h = 1000 \\text{ kg/m}^3 \\cdot 9.81 \\text{ m/s}^2 \\cdot ${h.toFixed(2)} \\text{ m} = ${pcol.toFixed(0)} \\text{ Pa} = ${(pcol/1000).toFixed(2)} \\text{ kPa}$$`
          },
          {
            title: "2. Presión Efectiva de Empuje ($P_{efective}$)",
            description: `Debemos restar la presión contraria que ejerce la vena del brazo ($P_{vena} = ${inputs.pven} \\text{ kPa} = ${pven} \\text{ Pa}$):
            <br>$$P_{efectiva} = P_{columna} - P_{vena} = ${pcol.toFixed(0)} \\text{ Pa} - ${pven} \\text{ Pa} = ${pef.toFixed(0)} \\text{ Pa}$$
            ${errorState ? `<br><span class="warning-text">⚠️ <strong>Advertencia:</strong> La presión de la columna no supera la presión de la vena. La sangre fluiría de vuelta hacia el tubo. Aumente la altura de la botella.</span>` : ""}`
          },
          {
            title: "3. Aplicación de la Ley de Poiseuille en la Aguja",
            description: `Convertimos las dimensiones de la aguja:
            <br>• Radio interno de la aguja: $r = ${inputs.r} \\text{ mm} = ${r.toExponential(2)} \\text{ m}$
            <br>• Longitud de la aguja: $L = ${inputs.L} \\text{ cm} = ${L.toFixed(3)} \\text{ m}$
            <br>Aplicando la fórmula de Poiseuille si $P_{efectiva} > 0$:
            <br>$$Q = \\frac{\\pi r^4 P_{efectiva}}{8 \\eta L}$$
            <br>$$Q = \\frac{\\pi \\cdot (${r.toExponential(2)} \\text{ m})^4 \\cdot ${pef.toFixed(0)} \\text{ Pa}}{8 \\cdot 0.001 \\cdot ${L.toFixed(3)}}$$
            <br>$$Q = ${q.toExponential(4)} \\text{ m}^3/s$$`
          },
          {
            title: "4. Conversión a Centímetros Cúbicos por Minuto ($cm^3/min$)",
            description: `Dado que $1 \\text{ m}^3/s = 6.0 \\cdot 10^7 \\text{ cm}^3/min$ (o mL/min):
            <br>$$Q = ${q.toExponential(4)} \\cdot 60,000,000 = ${qCcm.toFixed(2)} \\text{ cm}^3/min \\text{ (mL/min)}$$`
          }
        ],
        result: {
          value: errorState ? "0.00" : qCcm.toFixed(2),
          unit: "mL/min",
          summary: errorState ? 
            "**Flujo nulo o inverso** (la botella está demasiado baja para superar la presión de la vena)." : 
            `El flujo del gotero es de **${qCcm.toFixed(2)} mL/min** (equivalente a unas ${(qCcm * 20).toFixed(0)} gotas/min).`
        },
        diagramData: { h, L: Number(inputs.L), r: Number(inputs.r), qCcm, errorState }
      };
    },
    svgTemplate: (data) => {
      return `
        <svg viewBox="0 0 400 180" class="physics-diagram">
          <!-- Botella de suero -->
          <rect x="80" y="15" width="30" height="50" rx="5" fill="rgba(3,169,244,0.15)" stroke="#0288d1" stroke-width="1.5"/>
          <line x1="95" y1="65" x2="95" y2="135" stroke="#0288d1" stroke-width="2"/>
          
          <!-- Brazo paciente -->
          <rect x="220" y="125" width="140" height="30" rx="8" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.5"/>
          <text x="250" y="145" fill="#e65100" font-size="10" font-weight="bold">Vena Brazo</text>
          
          <!-- Conexión aguja -->
          <line x1="95" y1="135" x2="225" y2="135" stroke="#757575" stroke-width="1"/>
          <polygon points="225,135 220,133 220,137" fill="#555"/>
          
          <!-- Acotación Altura -->
          <line x1="50" y1="15" x2="50" y2="135" stroke="var(--color-text)" stroke-width="0.8" stroke-dasharray="2 2"/>
          <text x="35" y="80" fill="var(--color-text)" font-size="10">h = ${data.h}m</text>
          
          <!-- Resultados descriptivos -->
          <text x="140" y="40" fill="var(--color-text)" font-size="10">Aguja L = ${data.L}cm, r = ${data.r}mm</text>
          <text x="140" y="55" fill="var(--color-primary)" font-weight="bold" font-size="11">
            ${data.errorState ? "¡Aumentar Altura!" : `Q = ${data.qCcm.toFixed(2)} mL/min`}
          </text>
        </svg>`;
    }
  }
];
