/* =========================================================================
   MangoIA — Clasificación Inteligente de la Maduración de los Mangos
   Lógica compartida (tema, navbar, animaciones, gráficos) +
   lógica del detector con IA (Teachable Machine / TensorFlow.js).
   ========================================================================= */

/* ============================================================
   1. MODO OSCURO / CLARO  (compartido entre index.html y scanner.html)
   ============================================================ */
(function setupTheme(){
  const STORAGE_KEY = "mangoia-theme";
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === "dark") document.body.classList.add("dark");

  function syncIcons(){
    const isDark = document.body.classList.contains("dark");
    ["iconSun", "iconSun2"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = isDark ? "none" : "block"; });
    ["iconMoon", "iconMoon2"].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = isDark ? "block" : "none"; });
  }
  syncIcons();

  function toggleTheme(){
    document.body.classList.toggle("dark");
    localStorage.setItem(STORAGE_KEY, document.body.classList.contains("dark") ? "dark" : "light");
    syncIcons();
  }

  ["themeToggle", "themeToggle2"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener("click", toggleTheme);
  });
})();

/* ============================================================
   2. NAVBAR MÓVIL (hamburguesa) — solo existe en index.html
   ============================================================ */
(function setupNavbar(){
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => navLinks.classList.toggle("is-open"));
  navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("is-open")));
})();

/* ============================================================
   3. ANIMACIONES AL HACER SCROLL (fade-up)
   ============================================================ */
(function setupScrollReveal(){
  const items = document.querySelectorAll(".fade-up");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => observer.observe(el));
})();

/* ============================================================
   4. AÑO AUTOMÁTICO EN FOOTER / CRÉDITOS
   ============================================================ */
(function setupYear(){
  const year = new Date().getFullYear();
  ["footerYear", "footerYear2", "creditYear"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = year;
  });
})();

/* ============================================================
   5. GRÁFICOS DE LA SECCIÓN "RESULTADOS" (Chart.js) — solo index.html
   Datos de ejemplo: sustitúyanlos por los datos reales de su experimento.
   ============================================================ */
(function setupResultCharts(){
  if (typeof Chart === "undefined") return;

  const distEl = document.getElementById("chartDistribucion");
  if (distEl){
    new Chart(distEl, {
      type: "doughnut",
      data: {
        labels: ["Verde", "Maduro", "Sobremaduro", "Malo"],
        datasets: [{
          data: [24, 30, 22, 9],
          backgroundColor: ["#4CAF50", "#FFC727", "#FF8A3D", "#7A4B32"],
          borderWidth: 0,
        }]
      },
      options: {
        plugins: { legend: { position: "bottom", labels: { font: { family: "Plus Jakarta Sans" } } } },
        cutout: "62%",
      }
    });
  }

  const precEl = document.getElementById("chartPrecision");
  if (precEl){
    new Chart(precEl, {
      type: "bar",
      data: {
        labels: ["Verde", "Maduro", "Sobremaduro", "Malo"],
        datasets: [{
          label: "Precisión (%)",
          data: [95, 88, 91, 97],
          backgroundColor: ["#4CAF50", "#FFC727", "#FF8A3D", "#7A4B32"],
          borderRadius: 8,
          maxBarThickness: 46,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { min: 0, max: 100, grid: { color: "rgba(120,120,120,0.15)" } }, x: { grid: { display: false } } }
      }
    });
  }
})();

/* ============================================================
   6. DETECTOR CON IA — Teachable Machine + TensorFlow.js
   Esta sección solo se ejecuta en scanner.html (verifica que existan
   los elementos del DOM antes de continuar).
   ============================================================ */
(function setupScanner(){

  const elProbBars   = document.getElementById("probBars");
  if (!elProbBars) return; // No estamos en scanner.html: no hacer nada más.

  // ---- URL del modelo entrenado en Google Teachable Machine ----
  const URL = "https://teachablemachine.withgoogle.com/models/VbCLkP5Uh/";

  let model = null;
  let webcam = null;
  let maxPredictions = 0;
  let isWebcamRunning = false;
  let lastPredictTime = 0;
  const PREDICT_INTERVAL_MS = 350; // limita la frecuencia de inferencia en vivo

  // -------------------------------------------------------------
  // 6.1 CONFIGURACIÓN DE SABORES Y RECETAS — EDITEN AQUÍ
  //
  // El detector reconoce automáticamente, dentro del nombre de cada
  // clase devuelta por el modelo de Teachable Machine, las palabras
  // clave listadas en "match" (sin importar mayúsculas/tildes).
  // Si en su proyecto de Teachable Machine las clases se llaman
  // exactamente "Verde", "Maduro", "Sobremaduro" y "Malo", no necesitan
  // cambiar nada.
  //
  // "recetaIds" hace referencia a las llaves definidas en el archivo
  // recetas-data.js (window.RECETAS_DB). Cada id ahí tiene la receta
  // COMPLETA: imagen, descripción, tiempo, porciones, dificultad,
  // ingredientes con cantidades, utensilios y procedimiento paso a paso.
  // Para añadir una receta nueva: agréguenla en recetas-data.js y luego
  // sumen su id al arreglo "recetaIds" correspondiente aquí abajo.
  // -------------------------------------------------------------
  const RIPENESS_INFO = {
    verde: {
      match: ["verde"],
      titulo: "Mango Verde",
      sabor: "Ácido",
      mensaje: "Sabor ácido y firme — típico del mango sin madurar.",
      nivel: 0,
      color: "#4CAF50",
      recetaIds: ["v1", "v2", "v3"]
    },
    maduro: {
      match: ["maduro"],
      titulo: "Mango Maduro",
      sabor: "Agridulce",
      mensaje: "Equilibrio entre dulzor y acidez — ideal para comer al natural.",
      nivel: 33,
      color: "#FFC727",
      recetaIds: ["m1", "m2", "m3"]
    },
    sobremaduro: {
      match: ["sobremaduro", "sobre maduro", "sobre-maduro"],
      titulo: "Mango Sobremaduro",
      sabor: "Dulce",
      mensaje: "Pulpa muy dulce y suave — perfecto para preparaciones dulces.",
      nivel: 66,
      color: "#FF8A3D",
      recetaIds: ["s1", "s2", "s3"]
    },
    malo: {
      match: ["malo", "daño", "dañado", "podrido", "mal estado"],
      titulo: "Mango en Mal Estado",
      sabor: "No apto para consumo",
      mensaje: "El mango presenta signos de deterioro. No se recomienda su consumo.",
      nivel: 100,
      color: "#7A4B32",
      recetaIds: [],
      mensajeRecetas: "No se recomienda preparar recetas con este mango. Sugerencia: descártelo de forma segura o utilícelo como abono orgánico (compostaje)."
    },
    sin_deteccion: {
      // Clase de "fondo" que Teachable Machine entrena automáticamente cuando
      // no hay ningún mango frente a la cámara (en este modelo se llama
      // "Por favor colocar de nuevo"). Si tu modelo usa otro texto para esa
      // clase, agrégalo a este arreglo "match".
      match: ["colocar de nuevo", "coloca de nuevo", "sin mango", "no hay mango", "fondo", "ninguno"],
      titulo: "Sin mango detectado",
      sabor: "—",
      mensaje: "No se detecta un mango frente a la cámara. Acércalo, mejora la iluminación o centra el fruto en el cuadro.",
      nivel: null, // null = no participa en el cálculo del medidor de maduración
      color: "#9aa39a",
      recetaIds: [],
      mensajeRecetas: "Coloca un mango frente a la cámara para ver sugerencias de recetas."
    },
    desconocido: {
      match: [],
      titulo: "Clase no reconocida",
      sabor: "—",
      mensaje: "Esta clase del modelo no coincide con ninguna categoría configurada. Revise la configuración en script.js (RIPENESS_INFO).",
      nivel: null,
      color: "#9aa39a",
      recetaIds: [],
      mensajeRecetas: "Coloca un mango frente a la cámara para ver sugerencias de recetas."
    }
  };

  // Quita tildes y pasa a minúsculas para comparar etiquetas de forma robusta
  function normalizar(texto){
    return texto
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .trim();
  }

  // Determina a qué categoría de maduración pertenece una clase del modelo.
  // El orden de comprobación evita falsos positivos (p. ej. "sobremaduro"
  // contiene la palabra "maduro", por eso se revisa antes).
  function clasificarEtiqueta(nombreClase){
    const limpio = normalizar(nombreClase);
    if (RIPENESS_INFO.sin_deteccion.match.some(k => limpio.includes(k))) return "sin_deteccion";
    if (RIPENESS_INFO.malo.match.some(k => limpio.includes(k))) return "malo";
    if (RIPENESS_INFO.sobremaduro.match.some(k => limpio.includes(k))) return "sobremaduro";
    if (RIPENESS_INFO.maduro.match.some(k => limpio.includes(k))) return "maduro";
    if (RIPENESS_INFO.verde.match.some(k => limpio.includes(k))) return "verde";
    return "desconocido";
  }

  // ---- Referencias del DOM ----
  const btnModeCamera   = document.getElementById("btnModeCamera");
  const btnModeUpload   = document.getElementById("btnModeUpload");
  const cameraView      = document.getElementById("cameraView");
  const uploadView      = document.getElementById("uploadView");
  const webcamContainer = document.getElementById("webcamContainer");
  const cameraPlaceholder = document.getElementById("cameraPlaceholder");
  const btnStartCamera  = document.getElementById("btnStartCamera");
  const btnStopCamera   = document.getElementById("btnStopCamera");
  const btnAnalyzeUpload= document.getElementById("btnAnalyzeUpload");
  const liveIndicator   = document.getElementById("liveIndicator");
  const fileInput       = document.getElementById("fileInput");
  const uploadDrop      = document.getElementById("uploadDrop");
  const uploadedPreview = document.getElementById("uploadedPreview");
  const cameraSelectBar = document.getElementById("cameraSelectBar");
  const cameraSelect    = document.getElementById("cameraSelect");
  const btnRefreshCameras = document.getElementById("btnRefreshCameras");

  const resultEmpty     = document.getElementById("resultEmpty");
  const resultContent   = document.getElementById("resultContent");
  const resultLabel     = document.getElementById("resultLabel");
  const resultConfidence= document.getElementById("resultConfidence");
  const resultTaste     = document.getElementById("resultTaste");
  const ripenessMarker  = document.getElementById("ripenessMarker");
  const recipesList     = document.getElementById("recipesList");

  // ---- Referencias del modal "Ver receta completa" ----
  const recipeModalOverlay = document.getElementById("recipeModalOverlay");
  const recipeModalBody    = document.getElementById("recipeModalBody");
  const recipeModalClose   = document.getElementById("recipeModalClose");

  let currentUploadedImage = null;

  // -------------------------------------------------------------
  // 6.2 CARGA DEL MODELO DE TEACHABLE MACHINE
  // -------------------------------------------------------------
  async function cargarModelo(){
    if (model) return model;
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
    return model;
  }

  // -------------------------------------------------------------
  // 6.3 CAMBIO ENTRE MODO "CÁMARA" Y MODO "SUBIR IMAGEN"
  // -------------------------------------------------------------
  function activarModoCamara(){
    btnModeCamera.classList.add("is-active");
    btnModeUpload.classList.remove("is-active");
    btnModeCamera.setAttribute("aria-selected", "true");
    btnModeUpload.setAttribute("aria-selected", "false");
    cameraView.style.display = "flex";
    uploadView.style.display = "none";
    cameraSelectBar.style.display = "flex";
    btnStartCamera.style.display = "inline-flex";
    btnStopCamera.style.display = "inline-flex";
    btnAnalyzeUpload.style.display = "none";
  }

  function activarModoSubida(){
    detenerCamara();
    btnModeUpload.classList.add("is-active");
    btnModeCamera.classList.remove("is-active");
    btnModeUpload.setAttribute("aria-selected", "true");
    btnModeCamera.setAttribute("aria-selected", "false");
    cameraView.style.display = "none";
    uploadView.style.display = "flex";
    cameraSelectBar.style.display = "none";
    btnStartCamera.style.display = "none";
    btnStopCamera.style.display = "none";
    btnAnalyzeUpload.style.display = "inline-flex";
  }

  btnModeCamera.addEventListener("click", activarModoCamara);
  btnModeUpload.addEventListener("click", activarModoSubida);

  // -------------------------------------------------------------
  // 6.3.1 DETECCIÓN DE CÁMARAS DISPONIBLES (webcam externa, etc.)
  //
  // Los navegadores solo muestran el NOMBRE de cada cámara después de que
  // el usuario haya dado permiso de video al menos una vez. Por eso, si
  // aún no hay permiso, mostramos "Cámara 1", "Cámara 2"... y, en cuanto
  // se activa la cámara por primera vez, volvemos a detectar para mostrar
  // ya los nombres reales (ej. "Logitech HD Webcam C310").
  // -------------------------------------------------------------
  async function enumerarCamaras(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices){
      cameraSelect.innerHTML = `<option value="">No disponible en este navegador</option>`;
      cameraSelect.disabled = true;
      return;
    }
    try{
      const dispositivos = await navigator.mediaDevices.enumerateDevices();
      const camaras = dispositivos.filter(d => d.kind === "videoinput");

      if (!camaras.length){
        cameraSelect.innerHTML = `<option value="">No se detectó ninguna cámara</option>`;
        cameraSelect.disabled = true;
        return;
      }

      const seleccionPrevia = cameraSelect.value;
      cameraSelect.innerHTML = "";
      camaras.forEach((cam, i) => {
        const opt = document.createElement("option");
        opt.value = cam.deviceId;
        opt.textContent = cam.label && cam.label.trim() ? cam.label : `Cámara ${i + 1}`;
        cameraSelect.appendChild(opt);
      });
      cameraSelect.disabled = false;

      // Si la cámara elegida antes sigue disponible, la mantenemos seleccionada
      if (seleccionPrevia && camaras.some(c => c.deviceId === seleccionPrevia)){
        cameraSelect.value = seleccionPrevia;
      }
    } catch(err){
      console.error("No se pudieron enumerar las cámaras:", err);
      cameraSelect.innerHTML = `<option value="">Error al detectar cámaras</option>`;
    }
  }

  btnRefreshCameras.addEventListener("click", enumerarCamaras);

  // Si el usuario conecta o desconecta una webcam (p. ej. la USB), actualizamos la lista
  if (navigator.mediaDevices && navigator.mediaDevices.addEventListener){
    navigator.mediaDevices.addEventListener("devicechange", enumerarCamaras);
  }

  // Primer intento de detección al cargar la página (puede mostrar nombres
  // genéricos hasta que se otorgue el permiso de cámara)
  enumerarCamaras();

  // -------------------------------------------------------------
  // 6.4 CÁMARA WEB EN VIVO
  // -------------------------------------------------------------
  async function iniciarCamara(){
    try{
      btnStartCamera.disabled = true;
      btnStartCamera.textContent = "Cargando modelo…";
      await cargarModelo();

      const flip = true; // efecto espejo, más natural para el usuario
      webcam = new tmImage.Webcam(320, 320, flip);

      const deviceIdSeleccionado = cameraSelect.value || undefined;

      try{
        // Intentamos abrir exactamente la cámara elegida por el usuario (su webcam)
        await webcam.setup(deviceIdSeleccionado ? { deviceId: deviceIdSeleccionado } : {});
      } catch (errDispositivo){
        console.warn("No se pudo abrir la cámara seleccionada, se usará la predeterminada:", errDispositivo);
        await webcam.setup(); // respaldo: cámara predeterminada del sistema
      }

      await webcam.play();
      isWebcamRunning = true;

      cameraPlaceholder.style.display = "none";
      webcamContainer.innerHTML = "";
      webcamContainer.appendChild(webcam.canvas);

      btnStartCamera.style.display = "none";
      btnStopCamera.disabled = false;
      cameraSelect.disabled = true; // evita cambiar de cámara mientras está activa
      liveIndicator.style.display = "flex";

      // Ahora que ya hay permiso concedido, refrescamos la lista para mostrar
      // los nombres reales de las cámaras (antes podían verse como "Cámara 1", etc.)
      enumerarCamaras();

      window.requestAnimationFrame(loopCamara);
    } catch (err){
      console.error("Error al iniciar la cámara:", err);
      alert("No se pudo activar la cámara. Verifique los permisos del navegador, que la webcam esté bien conectada, o utilice la opción de subir una imagen.");
      btnStartCamera.disabled = false;
      btnStartCamera.textContent = "Activar cámara";
    }
  }

  async function loopCamara(){
    if (!isWebcamRunning) return;
    webcam.update();

    const ahora = performance.now();
    if (ahora - lastPredictTime > PREDICT_INTERVAL_MS){
      lastPredictTime = ahora;
      await predecir(webcam.canvas);
    }
    window.requestAnimationFrame(loopCamara);
  }

  function detenerCamara(){
    if (webcam && isWebcamRunning){
      webcam.stop();
    }
    isWebcamRunning = false;
    liveIndicator.style.display = "none";
    btnStartCamera.style.display = "inline-flex";
    btnStartCamera.disabled = false;
    btnStartCamera.textContent = "Activar cámara";
    btnStopCamera.disabled = true;
    cameraSelect.disabled = false; // vuelve a permitir elegir otra cámara
    webcamContainer.innerHTML = "";
    cameraPlaceholder.style.display = "block";
  }

  btnStartCamera.addEventListener("click", iniciarCamara);
  btnStopCamera.addEventListener("click", detenerCamara);

  // -------------------------------------------------------------
  // 6.5 SUBIDA DE IMAGEN
  // -------------------------------------------------------------
  function manejarArchivo(archivo){
    if (!archivo || !archivo.type.startsWith("image/")) return;
    const lector = new FileReader();
    lector.onload = (e) => {
      uploadedPreview.src = e.target.result;
      uploadedPreview.style.display = "block";
      uploadDrop.style.display = "none";
      btnAnalyzeUpload.disabled = false;

      currentUploadedImage = new Image();
      currentUploadedImage.src = e.target.result;
    };
    lector.readAsDataURL(archivo);
  }

  fileInput.addEventListener("change", (e) => manejarArchivo(e.target.files[0]));

  uploadDrop.addEventListener("dragover", (e) => { e.preventDefault(); uploadDrop.style.opacity = .7; });
  uploadDrop.addEventListener("dragleave", () => { uploadDrop.style.opacity = 1; });
  uploadDrop.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadDrop.style.opacity = 1;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) manejarArchivo(e.dataTransfer.files[0]);
  });

  btnAnalyzeUpload.addEventListener("click", async () => {
    if (!currentUploadedImage) return;
    btnAnalyzeUpload.disabled = true;
    btnAnalyzeUpload.textContent = "Analizando…";
    try{
      await cargarModelo();
      // Aseguramos que la imagen ya esté completamente cargada antes de predecir
      if (currentUploadedImage.complete){
        await predecir(currentUploadedImage);
      } else {
        currentUploadedImage.onload = () => predecir(currentUploadedImage);
      }
    } catch(err){
      console.error("Error al analizar la imagen:", err);
      alert("Ocurrió un error al analizar la imagen. Intente nuevamente.");
    } finally {
      btnAnalyzeUpload.disabled = false;
      btnAnalyzeUpload.textContent = "Analizar imagen";
    }
  });

  // -------------------------------------------------------------
  // 6.6 PREDICCIÓN Y RENDERIZADO DE RESULTADOS
  // -------------------------------------------------------------
  async function predecir(fuente){
    if (!model) return;
    const predicciones = await model.predict(fuente); // [{className, probability}, ...]

    // Ordenar de mayor a menor confianza
    const ordenadas = [...predicciones].sort((a, b) => b.probability - a.probability);
    const top = ordenadas[0];
    const categoriaTop = clasificarEtiqueta(top.className);
    const infoTop = RIPENESS_INFO[categoriaTop];

    mostrarPanelResultados();

    // ---- Predicción principal y confianza ----
    resultLabel.textContent = top.className;
    resultConfidence.textContent = Math.round(top.probability * 100) + "%";
    resultTaste.innerHTML = infoTop.sabor === "—"
      ? infoTop.mensaje
      : `<strong>Sabor: ${infoTop.sabor}.</strong> ${infoTop.mensaje}`;

    // ---- Barras de probabilidad animadas (orden fijo = orden del modelo) ----
    renderBarrasProbabilidad(predicciones);

    // ---- Medidor de maduración (posición ponderada por probabilidad) ----
    actualizarMedidorMaduracion(predicciones);

    // ---- Recetas sugeridas según el sabor detectado ----
    renderRecetas(infoTop);
  }

  function mostrarPanelResultados(){
    resultEmpty.style.display = "none";
    resultContent.style.display = "block";
  }

  // Guarda referencias a las barras ya creadas (className -> elementos del DOM).
  // Así, en vez de borrar y reconstruir las barras en cada predicción (lo que
  // causaba el efecto de "parpadeo / recarga"), solo se actualiza su ancho.
  let barrasCreadas = null;

  function renderBarrasProbabilidad(predicciones){
    // Se crean una sola vez, en el orden original de las clases del modelo,
    // para que el orden visual no cambie entre predicciones.
    if (!barrasCreadas){
      barrasCreadas = new Map();
      elProbBars.innerHTML = "";
      predicciones.forEach(p => {
        const cat = clasificarEtiqueta(p.className);
        const color = RIPENESS_INFO[cat].color;

        const fila = document.createElement("div");
        fila.className = "prob-bar";
        fila.innerHTML = `
          <div class="prob-bar__head">
            <span>${p.className}</span>
            <span class="prob-bar__value">0%</span>
          </div>
          <div class="prob-bar__track">
            <div class="prob-bar__fill" style="background:${color}"></div>
          </div>
        `;
        elProbBars.appendChild(fila);

        barrasCreadas.set(p.className, {
          fill: fila.querySelector(".prob-bar__fill"),
          valor: fila.querySelector(".prob-bar__value"),
        });
      });
    }

    // En cada predicción solo actualizamos ancho y texto (transición suave por CSS).
    predicciones.forEach(p => {
      const refs = barrasCreadas.get(p.className);
      if (!refs) return;
      const porcentaje = Math.round(p.probability * 100);
      refs.fill.style.width = porcentaje + "%";
      refs.valor.textContent = porcentaje + "%";
    });
  }

  function actualizarMedidorMaduracion(predicciones){
    // Posición = promedio ponderado del "nivel" de cada clase según su probabilidad.
    // Esto hace que el indicador se mueva de forma suave y proporcional,
    // en vez de saltar abruptamente solo según la clase ganadora.
    let sumaPonderada = 0;
    let sumaProbabilidad = 0;
    predicciones.forEach(p => {
      const cat = clasificarEtiqueta(p.className);
      const nivel = RIPENESS_INFO[cat].nivel;
      if (nivel === null || nivel === undefined) return; // ignora "sin_deteccion" y "desconocido"
      sumaPonderada += nivel * p.probability;
      sumaProbabilidad += p.probability;
    });
    const posicion = sumaProbabilidad > 0 ? (sumaPonderada / sumaProbabilidad) : 50;
    ripenessMarker.style.left = `calc(${posicion}% - 2px)`;
  }

  // -------------------------------------------------------------
  // 6.7 RECETAS SUGERIDAS + MODAL "VER RECETA COMPLETA" + CÓDIGO QR
  //
  // Cada receta sugerida se pinta como una tarjeta con su nombre y un
  // botón "Ver receta completa". Al hacer clic, se abre el modal con
  // toda la información (imagen, descripción, tiempo, porciones,
  // dificultad, ingredientes, utensilios, procedimiento) y su código
  // QR único, generado con renderRecipeDetailHTML() / generarQRparaReceta()
  // definidas en recipe-render.js (compartidas con receta.html).
  // -------------------------------------------------------------
  function renderRecetas(infoTop){
    recipesList.innerHTML = "";
    const ids = infoTop.recetaIds || [];

    if (!ids.length){
      const li = document.createElement("li");
      li.textContent = infoTop.mensajeRecetas || "Coloca un mango frente a la cámara para ver sugerencias de recetas.";
      recipesList.appendChild(li);
      return;
    }

    ids.forEach(id => {
      const receta = window.RECETAS_DB && window.RECETAS_DB[id];
      if (!receta) return;

      const li = document.createElement("li");
      li.className = "recipe-item";
      li.innerHTML = `
        <div class="recipe-item__info">
          <span class="recipe-item__emoji">${receta.emoji}</span>
          <span class="recipe-item__nombre">${receta.titulo}</span>
        </div>
        <button type="button" class="btn btn--secondary btn--sm recipe-item__btn" data-recipe-id="${id}">
          Ver receta completa
        </button>
      `;
      recipesList.appendChild(li);
    });
  }

  function abrirModalReceta(id){
    const receta = window.RECETAS_DB && window.RECETAS_DB[id];
    if (!receta || typeof renderRecipeDetailHTML !== "function") return;

    recipeModalBody.innerHTML = renderRecipeDetailHTML(receta);
    generarQRparaReceta(receta);

    recipeModalOverlay.classList.add("is-open");
    recipeModalOverlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function cerrarModalReceta(){
    recipeModalOverlay.classList.remove("is-open");
    recipeModalOverlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  // Delegación de eventos: los botones "Ver receta completa" se crean
  // dinámicamente, así que escuchamos los clics desde su contenedor padre.
  recipesList.addEventListener("click", (e) => {
    const btn = e.target.closest(".recipe-item__btn");
    if (!btn) return;
    abrirModalReceta(btn.dataset.recipeId);
  });

  recipeModalClose.addEventListener("click", cerrarModalReceta);
  recipeModalOverlay.addEventListener("click", (e) => {
    if (e.target === recipeModalOverlay) cerrarModalReceta(); // clic fuera de la tarjeta
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && recipeModalOverlay.classList.contains("is-open")) cerrarModalReceta();
  });

  // Modo inicial al cargar la página
  activarModoCamara();

})();
