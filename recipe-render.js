/* =========================================================================
   MangoIA — Renderizado compartido del DETALLE DE RECETA + generación de QR
   Usado tanto por el modal "Ver receta completa" en scanner.html como por
   la página independiente receta.html (a la que apunta cada código QR).

   Requiere que ya estén cargados en la página:
     - recetas-data.js   (window.RECETAS_DB)
     - la librería QRCode (https://cdn.jsdelivr.net/npm/qrcode@.../qrcode.min.js)
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
 * Devuelve el HTML completo del detalle de una receta (imagen ilustrativa,
 * descripción, datos generales, ingredientes, utensilios y procedimiento).
 * No incluye el contenedor del QR: eso se agrega e inicializa aparte con
 * generarQRparaReceta(), porque requiere un <canvas> ya insertado en el DOM.
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

  return `
    <div class="recipe-detail" style="--recipe-color:${receta.colorCategoria}">
      <div class="recipe-detail__cover" style="background:linear-gradient(135deg, ${receta.colorCategoria}33, ${receta.colorCategoria}11)">
        <span class="recipe-detail__cover-emoji">${receta.emoji}</span>
        <p class="recipe-detail__cover-note">Imagen ilustrativa — sustituir por una fotografía real del platillo</p>
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
          <canvas id="qrCanvas-${receta.id}"></canvas>
        </div>
        <a class="recipe-detail__qr-link" id="qrLink-${receta.id}" href="${construirURLReceta(receta.id)}" target="_blank" rel="noopener">${construirURLReceta(receta.id)}</a>
      </div>
    </div>
  `;
}

/**
 * Genera (o regenera) el código QR de una receta dentro del <canvas>
 * correspondiente. Debe llamarse DESPUÉS de insertar el HTML de
 * renderRecipeDetailHTML() en el DOM, para que el canvas ya exista.
 */
function generarQRparaReceta(receta) {
  const canvas = document.getElementById("qrCanvas-" + receta.id);
  if (!canvas || typeof QRCode === "undefined") return;
  const url = construirURLReceta(receta.id);
  QRCode.toCanvas(canvas, url, {
    width: 168,
    margin: 1,
    color: { dark: "#1C2620", light: "#00000000" }
  }, function (err) {
    if (err) console.error("No se pudo generar el código QR:", err);
  });
}
