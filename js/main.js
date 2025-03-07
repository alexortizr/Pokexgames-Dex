/**************************************
  main.js
***************************************/

// Variables globales
window.allPokemons = [];
window.filteredPokemons = [];

let pageSize = 20;
let currentOffset = 0;

// Colores de fondo según elementos
const elementColors = {
  "Electric": "#FFF3A5",
  "Ground": "#E0C4A0",
  "Rock": "#D1C6B8",
  "Grass": "#B8E0B8",
  "Bug": "#C8E4C8",
  "Steel": "#B0C4DE",
  "Crystal": "#D4F1F9",
  "Flying": "#A8D8F0",
  "Dragon": "#D8BFD8",
  "Psychic": "#FFB5E8",
  "Fairy": "#FFD1DC",
  "Water": "#9AD3DE",
  "Ice": "#C2F3F3",
  "Ghost": "#D3B8E6",
  "Dark": "#B19FB9",
  "Poison": "#D8AED8",
  "Normal": "#E5E5E5",
  "Fire": "#FFAB8F",
  "Fighting": "#FFA7A7"
};

// Borde según forma
function getCardBorderColor(forma = "") {
  switch (forma.trim().toLowerCase()) {
    case "normal":   return "#C0C0C0";
    case "shiny":    return "#FFD700";
    case "mega":     return "#DC143C";
    case "alolan":   return "#40E0D0";
    case "galarian": return "#000080";
    case "tm":       return "#800080";
    case "otro":     return "#32CD32";
    default:         return "#32CD32";
  }
}

// Fondo (gradiente si varios elementos)
function getCardBackground(elementos) {
  if (!elementos) return "#ffffff";
  const elems = elementos.split(",").map(e => e.trim());
  const colors = elems.map(e => elementColors[e] || "#ffffff");
  return (colors.length === 1)
    ? colors[0]
    : `linear-gradient(135deg, ${colors.join(", ")})`;
}

// Íconos para elementos
const elementIcons = {
  "Fire": "https://wiki.pokexgames.com/images/3/30/Fire.png",
  "Electric": "https://wiki.pokexgames.com/images/2/2f/Electric.png",
  "Ground": "https://wiki.pokexgames.com/images/8/8f/Ground.png",
  "Rock": "https://wiki.pokexgames.com/images/0/0b/Rock.png",
  "Grass": "https://wiki.pokexgames.com/images/c/c5/Grass.png",
  "Bug": "https://wiki.pokexgames.com/images/7/7d/Bug.png",
  "Steel": "https://wiki.pokexgames.com/images/c/c9/Steel.png",
  "Crystal": "https://wiki.pokexgames.com/images/3/31/Crystal.png",
  "Flying": "https://wiki.pokexgames.com/images/7/7f/Flying.png",
  "Dragon": "https://wiki.pokexgames.com/images/c/c7/Dragon.png",
  "Psychic": "https://wiki.pokexgames.com/images/2/21/Psychic.png",
  "Fairy": "https://wiki.pokexgames.com/images/4/43/Fairy.png",
  "Water": "https://wiki.pokexgames.com/images/9/9d/Water.png",
  "Ice": "https://wiki.pokexgames.com/images/7/77/Ice.png",
  "Ghost": "https://wiki.pokexgames.com/images/5/59/Ghost1.png",
  "Dark": "https://wiki.pokexgames.com/images/9/98/Dark1.png",
  "Poison": "https://wiki.pokexgames.com/images/0/03/Poison1.png",
  "Normal": "https://wiki.pokexgames.com/images/e/e8/Normal1.png",
  "Fighting": "https://wiki.pokexgames.com/images/3/30/Fighting.png"
};

/**
 * Renderiza un chunk de tarjetas en #pokemon-container
 */
function renderPokemonsChunk(pokemons, offset, size) {
  const container = document.getElementById("pokemon-container");
  const end = Math.min(offset + size, pokemons.length);

  for (let i = offset; i < end; i++) {
    const p = pokemons[i];
    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.style.background = getCardBackground(p.elementos);
    card.style.border = `3px solid ${getCardBorderColor(p.forma)}`;

    let elementsHTML = "";
    if (p.elementos) {
      const elems = p.elementos.split(",").map(e => e.trim());
      elementsHTML = elems.map(e =>
        `<img src="${elementIcons[e] || ''}" alt="${e}" class="element-icon">`
      ).join(" ");
    }

    const formaText = (p.forma.toLowerCase() !== "normal") ? p.forma : "";

    card.innerHTML = `
      <div class="pokemon-number">#${p.numero}</div>
      <img src="${p.imagen_pokemon}" alt="${p.nombre}" class="pokemon-image">
      <div class="pokemon-name">${p.nombre}</div>
      <div class="pokemon-form-text">${formaText}</div>
      <div class="pokemon-elements">${elementsHTML}</div>
    `;
    card.addEventListener("click", () => showDetail(p));
    container.appendChild(card);
  }
}

/**
 * Renderiza la lista de Pokémon y reubica el mismo sentinel
 */
window.renderPokemons = function(pokemons) {
  window.filteredPokemons = pokemons;
  currentOffset = 0;

  const container = document.getElementById("pokemon-container");
  container.innerHTML = ""; // Limpiar tarjetas previas

  renderPokemonsChunk(pokemons, currentOffset, pageSize);
  currentOffset += pageSize;

  // Buscar o crear el sentinel (único)
  let sentinel = document.getElementById("sentinel");
  if(!sentinel) {
    sentinel = document.createElement("div");
    sentinel.id = "sentinel";
    sentinel.className = "sentinel";
  }
  container.appendChild(sentinel);

  showFilterSummary(pokemons);

  // Forzar carga si el contenedor es muy corto
  setTimeout(() => {
    while(container.scrollHeight <= window.innerHeight && currentOffset < window.filteredPokemons.length) {
      loadMorePokemons();
    }
  }, 500);

  // Re-observe el sentinel (si el observer global existe)
  if (window.lazyObserver && sentinel) {
    window.lazyObserver.unobserve(sentinel);
    window.lazyObserver.observe(sentinel);
  }
};

function loadMorePokemons() {
  const container = document.getElementById("pokemon-container");
  renderPokemonsChunk(window.filteredPokemons, currentOffset, pageSize);
  currentOffset += pageSize;
  let sentinel = document.getElementById("sentinel");
  container.appendChild(sentinel);
  if (window.lazyObserver && sentinel) {
    window.lazyObserver.unobserve(sentinel);
    window.lazyObserver.observe(sentinel);
  }
}

/**
 * Muestra la ventana de detalle estilo "smartphone"
 */
function showDetail(pokemon) {
  const detailOverlay = document.getElementById("detail-overlay");
  const detailDiv = document.getElementById("pokedex-detail");
  const detailContent = document.getElementById("detail-content");

  detailOverlay.style.display = "flex";
  detailDiv.classList.add("smartphone-shape");

  let bg = getCardBackground(pokemon.elementos);
  let borderColor = getCardBorderColor(pokemon.forma);
  let borderStyle = (pokemon.forma.toLowerCase() === "tm" || pokemon.forma.toLowerCase() === "otro")
                    ? "dashed" : "solid";

  detailDiv.style.background = bg;
  detailDiv.style.border = `3px ${borderStyle} ${borderColor}`;

  detailContent.innerHTML = `
    <div class="detail-header">
      <h2>#${pokemon.numero} ${pokemon.nombre}</h2>
    </div>
    <div class="detail-body">
      <div class="detail-image-container">
        <img src="${pokemon.imagen_pokemon}" alt="${pokemon.nombre}" class="detail-image">
      </div>
      <div class="detail-info">
        <p><strong>Forma:</strong> ${pokemon.forma}</p>
        <p><strong>Nivel:</strong> ${pokemon.level}</p>
        <p><strong>Tier:</strong> ${pokemon.tier || ""}</p>
        <p><strong>Clases:</strong> ${pokemon.clase}</p>
        <p><strong>Elementos:</strong> ${pokemon.elementos}</p>
        <p><strong>Habilidades:</strong> ${pokemon.habilidades ? pokemon.habilidades.join(", ") : ""}</p>
        <p><strong>Boost:</strong> ${pokemon.boost || ""}</p>
        <p><strong>Materia:</strong> ${pokemon.materia || ""}</p>
        <p><strong>Pedra Evolución:</strong> ${pokemon.pedra_evolucao || ""}</p>
        <p><strong>Evoluciones:</strong> ${pokemon.evolucoes || ""}</p>
        <p><strong>Descripción:</strong> ${pokemon.descripcion}</p>
        <p><strong>Ver en Pokexgames:</strong> <a href="${pokemon.pagina_pokemon}" target="_blank">Abrir en nueva pestaña</a></p>
      </div>
      <div class="detail-extra">
        <h3>Movimientos</h3>
        ${pokemon.movimientos ? pokemon.movimientos.map(mov => `
          <div class="movement-detail">
            <p><strong>${mov.slot} - ${mov.move}</strong> (Cooldown: ${mov.cooldown})</p>
            <div class="movement-icons">
              ${mov.imagenes_accion ? mov.imagenes_accion.map(acc => `<img src="${acc.src}" alt="${acc.title}" title="${acc.title}" class="movement-icon">`).join(" ") : ""}
            </div>
          </div>
        `).join("") : ""}
      </div>
      <div class="detail-efectividades">
        <h3>Efectividades</h3>
        ${renderEfectividades(pokemon.efectividades)}
      </div>
      <div class="detail-outras-versoes">
        <h3>Otras Versiones</h3>
        ${pokemon.outras_versoes ? pokemon.outras_versoes.map(vers => {
            const versionData = {
              numero: pokemon.numero,
              nombre: vers.nombre,
              forma: pokemon.forma,
              imagen_pokemon: vers.imagen,
              elementos: pokemon.elementos,
              clase: pokemon.clase,
              pagina_pokemon: pokemon.pagina_pokemon,
              descripcion: pokemon.descripcion,
              level: pokemon.level,
              habilidades: pokemon.habilidades,
              boost: pokemon.boost,
              materia: pokemon.materia,
              pedra_evolucao: pokemon.pedra_evolucao,
              evolucoes: pokemon.evolucoes,
              movimientos: pokemon.movimientos,
              efetividades: pokemon.efectividades,
              tier: pokemon.tier
            };
            return `
              <div class="version-card" onclick='showVersionDetail(${JSON.stringify(versionData)})'>
                <img src="${vers.imagen}" alt="${vers.nombre}" class="version-image">
                <p>${vers.nombre}</p>
              </div>
            `;
        }).join("") : ""}
      </div>
    </div>
  `;
}

function renderEfectividades(efectividades) {
  if (!efectividades) return '';
  let html = '<ul>';
  for (let category in efectividades) {
    html += `<li><strong>${category}:</strong> ${efectividades[category].join(", ")}</li>`;
  }
  html += '</ul>';
  return html;
}

window.showVersionDetail = function(data) {
  showDetail(data);
};

// Lazy loading con observer global
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pokemon-container");

  let sentinel = document.getElementById("sentinel");
  if(!sentinel) {
    sentinel = document.createElement("div");
    sentinel.id = "sentinel";
    sentinel.className = "sentinel";
    container.appendChild(sentinel);
  }

  // Crear observer global y almacenarlo en window.lazyObserver
  window.lazyObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      loadMorePokemons();
    }
  }, {
    root: null,
    rootMargin: "200px",
    threshold: 0.1
  });
  window.lazyObserver.observe(sentinel);

  setTimeout(() => {
    while(container.scrollHeight <= window.innerHeight && currentOffset < window.filteredPokemons.length) {
      loadMorePokemons();
    }
  }, 500);
});

// Cerrar la ventana de detalle
function closeDetail(e) {
  if(e) e.stopPropagation();
  document.getElementById("detail-overlay").style.display = "none";
  document.querySelector(".content-section").style.display = "flex";
  document.getElementById("pokedex-detail").classList.remove("smartphone-shape");
}

document.getElementById("detail-close").addEventListener("click", closeDetail);
document.getElementById("detail-overlay").addEventListener("click", (e) => {
  if (e.target === document.getElementById("detail-overlay")) {
    closeDetail(e);
  }
});

// Cargar pokemons.json
fetch('data/pokemons.json')
  .then(res => res.json())
  .then(data => {
    const filteredData = data.filter(p => String(p.en_pokexgames).toUpperCase() !== "NO");
    window.allPokemons = filteredData;
    window.renderPokemons(filteredData);
    if (window.initializeFilters) {
      window.initializeFilters(filteredData);
    }
  })
  .catch(err => console.error('Error al cargar los datos:', err));

function showFilterSummary(filteredPokemons) {
  const filterSummaryDiv = document.getElementById("filter-summary");
  if (!filterSummaryDiv) return;
  if (filteredPokemons.length === 0) {
    filterSummaryDiv.innerHTML = "No se encontraron Pokémon con los filtros seleccionados.";
    return;
  }
  filterSummaryDiv.innerHTML = `Total Pokémon filtrados: <strong>${filteredPokemons.length}</strong>`;
}

// Menú hamburguesa para pantallas pequeñas
const burgerButton = document.getElementById("burger-button");
const filtersAside = document.getElementById("filters-aside");
burgerButton.addEventListener("click", () => {
  filtersAside.classList.toggle("filters-open");
});
