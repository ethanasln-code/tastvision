/* =========================================================================
   MangoIA — Renderizado compartido del DETALLE DE RECETA + código QR
   Usado tanto por el modal "Ver receta completa" en scanner.html como por
   la página independiente receta.html (a la que apunta cada código QR).

   Requiere que ya esté cargado en la página:
     - recetas-data.js   (window.RECETAS_DB)

   NOTA SOBRE EL QR: en vez de generarlo con una librería JavaScript (que
   puede fallar si un bloqueador de anuncios o la red del colegio bloquea
   el CDN), se usa una API pública de solo-imagen (api.qrserver.com): el
   código QR es simplemente una <img>, igual que cualquier otra foto. Es
   más simple y más difícil que falle.
   ========================================================================= */

/**
 * Construye la URL absoluta de la página de una receta (a la que apuntará
 * el QR). Funciona sin importar en qué carpeta/dominio esté publicado el
 * sitio, ya que se calcula relativa a la ubicación actual de la página.
 */
function construirURLReceta(id) {
  return new URL("receta.html?id=" + encodeURIComponent(id), window.location.href).href;
}

/**
 * Devuelve la URL de la imagen del código QR (servicio público gratuito,
 * no requiere API key). El QR codifica la URL de construirURLReceta().
 */
function construirURLQR(id) {
  const destino = encodeURIComponent(construirURLReceta(id));
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${destino}`;
}

/* =========================================================================
   ILUSTRACIONES ORIGINALES (SVG) — una por cada receta, según su "tipo"
   Se generan en código (no son fotos de internet) para que el proyecto no
   dependa de imágenes externas ni de derechos de autor de terceros.
   Tipos disponibles: "ensalada", "bebida", "conserva", "postre", "botana"
   ========================================================================= */
function generarIlustracionSVG(tipo, color) {
  const claro = color + "33";
  const base = `
    <defs>
      <linearGradient id="gradTapa" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="${color}"/>
        <stop offset="100%" stop-color="${color}CC"/>
      </linearGradient>
    </defs>
  `;

  const piezaMango = (cx, cy, r, rot) => `
    <g transform="rotate(${rot} ${cx} ${cy})">
      <path d="M${cx - r},${cy} a${r},${r * 0.8} 0 1,1 ${r * 2},0 a${r},${r * 0.8} 0 1,1 -${r * 2},0 Z"
        fill="${color}" opacity="0.9"/>
    </g>
  `;

  if (tipo === "ensalada" || tipo === "botana") {
    return `
      ${base}
      <ellipse cx="90" cy="112" rx="62" ry="14" fill="#000" opacity="0.06"/>
      <path d="M28 78c0-8 6-14 14-14h96c8 0 14 6 14 14 0 26-27 44-62 44s-62-18-62-44Z" fill="${claro}" stroke="${color}" stroke-width="2.5"/>
      <ellipse cx="90" cy="78" rx="62" ry="13" fill="none" stroke="${color}" stroke-width="2.5"/>
      ${piezaMango(70, 74, 12, -15)}
      ${piezaMango(100, 70, 10, 20)}
      ${piezaMango(88, 88, 9, 5)}
      <path d="M118 60c6-10 16-13 24-9" stroke="#4CAF50" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.7"/>
    `;
  }

  if (tipo === "bebida") {
    return `
      ${base}
      <ellipse cx="90" cy="128" rx="34" ry="7" fill="#000" opacity="0.06"/>
      <path d="M58 40h64l-9 84a8 8 0 0 1-8 7H75a8 8 0 0 1-8-7L58 40Z" fill="${claro}" stroke="${color}" stroke-width="2.5"/>
      <path d="M58 40h64" stroke="${color}" stroke-width="2.5"/>
      <path d="M63 52c4 22 4 44 3 66" stroke="url(#gradTapa)" stroke-width="26" stroke-linecap="round" opacity="0.55"/>
      <rect x="100" y="16" width="7" height="34" rx="3.5" fill="${color}" transform="rotate(18 103 33)"/>
      ${piezaMango(72, 44, 8, 0)}
    `;
  }

  if (tipo === "conserva") {
    return `
      ${base}
      <ellipse cx="90" cy="128" rx="40" ry="8" fill="#000" opacity="0.06"/>
      <rect x="52" y="52" width="76" height="72" rx="10" fill="${claro}" stroke="${color}" stroke-width="2.5"/>
      <rect x="60" y="30" width="60" height="26" rx="6" fill="url(#gradTapa)" stroke="${color}" stroke-width="2.5"/>
      <rect x="66" y="82" width="48" height="30" rx="4" fill="#FFF8ED" stroke="${color}" stroke-width="1.6"/>
      ${piezaMango(78, 70, 8, -10)}
      ${piezaMango(100, 68, 7, 15)}
    `;
  }

  /* postre (por defecto) */
  return `
    ${base}
    <ellipse cx="90" cy="118" rx="46" ry="9" fill="#000" opacity="0.06"/>
    <path d="M46 70h88l-8 40a12 12 0 0 1-12 10H66a12 12 0 0 1-12-10l-8-40Z" fill="${claro}" stroke="${color}" stroke-width="2.5"/>
    <path d="M46 70a44 22 0 0 1 88 0" fill="url(#gradTapa)" stroke="${color}" stroke-width="2.5"/>
    <circle cx="90" cy="52" r="6" fill="#E4572E"/>
    ${piezaMango(70, 92, 8, -8)}
    ${piezaMango(108, 90, 7, 12)}
  `;
}

function renderIlustracionReceta(receta) {
  const tipo = receta.tipoIlustracion || "ensalada";
  return `
    <svg viewBox="0 0 180 140" class="recipe-detail__cover-svg" role="img" aria-label="Ilustración de ${receta.titulo}">
      ${generarIlustracionSVG(tipo, receta.colorCategoria)}
    </svg>
  `;
}

/**
 * Devuelve el HTML completo del detalle de una receta (ilustración,
 * descripción, datos generales, ingredientes, utensilios, procedimiento
 * y código QR). Es autosuficiente: no requiere ninguna llamada aparte
 * después de insertarlo en el DOM (el QR es una <img> normal).
 */
function renderRecipeDetailHTML(receta) {
  const ingredientesHTML = receta.ingredientes.map(ing => `
    <li class="recipe-detail__ing">
      <span class="recipe-detail__ing-cant">${ing.cantidad}${ing.unidad ? " " + ing.unidad : ""}</span>
      <span class="recipe-detail__ing-nombre">${ing.nombre}</span>
    </li>
  `).join("");

  const utensiliosHTML = receta.utensilios.map(u => `<li>${u}</li>`).join("");

  const pasosHTML = receta.pasos.map((paso, i) => `
    <li class="recipe-detail__paso">
      <span class="recipe-detail__paso-num">${i + 1}</span>
      <span>${paso}</span>
    </li>
  `).join("");

  const urlReceta = construirURLReceta(receta.id);
  const urlQR = construirURLQR(receta.id);

  return `
    <div class="recipe-detail" style="--recipe-color:${receta.colorCategoria}">
      <div class="recipe-detail__cover" style="background:linear-gradient(135deg, ${receta.colorCategoria}22, ${receta.colorCategoria}08)">
        ${renderIlustracionReceta(receta)}
      </div>

      <h2 class="recipe-detail__titulo" id="recipeModalTitle">${receta.titulo}</h2>
      <p class="recipe-detail__desc">${receta.descripcion}</p>

      <div class="recipe-detail__meta">
        <div class="recipe-detail__meta-item"><span>⏱️</span><strong>${receta.tiempo}</strong><small>Tiempo</small></div>
        <div class="recipe-detail__meta-item"><span>🍽️</span><strong>${receta.porciones}</strong><small>Porciones</small></div>
        <div class="recipe-detail__meta-item"><span>📊</span><strong>${receta.dificultad}</strong><small>Dificultad</small></div>
      </div>

      <div class="recipe-detail__grid">
        <div>
          <h3>Ingredientes</h3>
          <ul class="recipe-detail__ing-list">${ingredientesHTML}</ul>

          <h3>Materiales y utensilios</h3>
          <ul class="recipe-detail__utensilios">${utensiliosHTML}</ul>
        </div>

        <div>
          <h3>Procedimiento paso a paso</h3>
          <ol class="recipe-detail__pasos">${pasosHTML}</ol>
        </div>
      </div>

      ${receta.notas ? `<p class="recipe-detail__notas"><strong>Nota:</strong> ${receta.notas}</p>` : ""}

      <div class="recipe-detail__qr">
        <h3>Llévala en tu celular</h3>
        <p>Escanea este código QR para abrir esta misma receta completa desde tu teléfono mientras cocinas.</p>
        <div class="recipe-detail__qr-box">
          <img src="${urlQR}" alt="Código QR de la receta ${receta.titulo}" width="168" height="168"
               loading="lazy"
               onerror="this.closest('.recipe-detail__qr-box').innerHTML='<p class=&quot;recipe-detail__qr-error&quot;>No se pudo cargar el código QR. Revisa tu conexión a internet.</p>'" />
        </div>
        <a class="recipe-detail__qr-link" href="${urlReceta}" target="_blank" rel="noopener">${urlReceta}</a>
      </div>
    </div>
  `;
}

/**
 * Se mantiene por compatibilidad (ya no hace falta llamarla: el QR ahora
 * es una <img> que se genera sola dentro de renderRecipeDetailHTML). No
 * hace nada, pero evita errores si algún código anterior todavía la invoca.
 */
function generarQRparaReceta() {}
