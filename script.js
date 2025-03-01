document.addEventListener("DOMContentLoaded", () => {
  const pokemonContainer = document.getElementById('pokemon-container');
  const searchInput = document.getElementById('search-input');
  const moveFilterInput = document.getElementById('move-filter');
  const resetButton = document.getElementById('reset-filters');
  const generationFilter = document.getElementById('generation-filter');
  const themeSwitch = document.getElementById('theme-switch');

  const modal = document.getElementById('pokemon-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  let pokemonData = [];
  let fuse; // Para búsqueda difusa

  // Función para limpiar etiquetas HTML
  function cleanHTML(html) {
    if (typeof html !== "string") return "";
    return html.replace(/<[^>]*>/g, " ");
  }

  // Genera cadena de búsqueda global (sin movimientos)
  function buildSearchString(pokemon) {
    let parts = [];
    for (let key in pokemon) {
      if (!pokemon.hasOwnProperty(key)) continue;
      if (key.toLowerCase() === "movimientos") continue;
      let value = pokemon[key];
      if (value == null) continue;
      if (typeof value === "string") {
        parts.push(cleanHTML(value).toLowerCase());
      } else if (typeof value === "number") {
        const padded = value.toString().padStart(3, '0');
        parts.push(padded, value.toString());
      }
    }
    return parts.join(" ");
  }

  // Muestra el detalle del Pokémon en un modal con estilo retro
  function showPokemonDetails(pokemon) {
    const detailHTML = `
      <div class="pokemon-detail-card">
        <div class="pokemon-image">
          ${pokemon.Pokemon}
        </div>
        <div class="pokemon-info">
          <h2>${pokemon.nombre} <span>#${pokemon.paddedNumero || pokemon.forma}</span></h2>
          <p><strong>Generación/Forma:</strong> ${pokemon.forma}</p>
          <p><strong>Nivel:</strong> ${pokemon.Nivel || "N/A"}</p>
          <div class="detail-section">
            <h3>Movimientos</h3>
            ${pokemon.movimientos || "Sin movimientos"}
          </div>
          <div class="detail-section">
            <h3>Habilidades</h3>
            ${pokemon.habilidades || "Sin habilidades"}
          </div>
          <div class="detail-section">
            <h3>Efectividades</h3>
            <p><strong>Efetivo:</strong> ${pokemon.Efetivo || "N/A"}</p>
            <p><strong>Inefetivo:</strong> ${pokemon.Inefetivo || "N/A"}</p>
          </div>
        </div>
      </div>
    `;
    modalBody.innerHTML = detailHTML;
    modal.style.display = "block";
  }

  // Cerrar el modal
  modalClose.addEventListener("click", () => { modal.style.display = "none"; });
  window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });

  // Cargar CSV y preparar datos
  fetch('data/pokemons_detailed.csv')
    .then(response => response.text())
    .then(data => {
      const parsed = Papa.parse(data, { header: true, dynamicTyping: true });
      pokemonData = parsed.data;
      pokemonData.forEach(pokemon => {
        pokemon.searchString = buildSearchString(pokemon);
        pokemon.paddedNumero = pokemon.numero ? pokemon.numero.toString().padStart(3, '0') : "";
      });
      populateGenerationFilter(pokemonData);
      fuse = new Fuse(pokemonData, {
        keys: ['Pokemon', 'nombre', 'forma', 'habilidades', 'searchString'],
        threshold: 0.5
      });
      displayPokemons(pokemonData);
    })
    .catch(err => console.error(err));

  // Rellena el filtro de generaciones
  function populateGenerationFilter(data) {
    const generations = [...new Set(data.map(p => p.forma).filter(g => g))];
    generations.forEach(gen => {
      const option = document.createElement('option');
      option.value = gen;
      option.textContent = gen;
      generationFilter.appendChild(option);
    });
  }

  // Muestra las tarjetas de Pokémon con el estilo retro
  function displayPokemons(data) {
    pokemonContainer.innerHTML = '';
    if (data.length === 0) {
      pokemonContainer.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }
    data.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('pokemon-card');
      card.innerHTML = `
        ${pokemon.Pokemon}
        <h3>${pokemon.nombre} (#${pokemon.paddedNumero || pokemon.forma})</h3>
        <p>${pokemon.forma}</p>
      `;
      card.addEventListener('click', () => showPokemonDetails(pokemon));
      pokemonContainer.appendChild(card);
    });
  }

  // Filtrado global en tiempo real
  function filterPokemons() {
    const searchValue = searchInput.value.toLowerCase().trim();
    const generationValue = generationFilter.value.trim();
    let results = [];

    if (searchValue === "") {
      results = pokemonData;
    } else if (/^0\d+$/.test(searchValue)) {
      results = pokemonData.filter(pokemon => pokemon.paddedNumero === searchValue);
    } else {
      const fuseResults = fuse.search(searchValue);
      results = fuseResults.map(result => result.item);
    }
    
    if (generationValue !== "") {
      results = results.filter(pokemon =>
        pokemon.forma && pokemon.forma.toLowerCase() === generationValue.toLowerCase()
      );
    }
    
    results.sort((a, b) => {
      const numA = a.numero ? Number(a.numero) : Infinity;
      const numB = b.numero ? Number(b.numero) : Infinity;
      return numA - numB;
    });
    
    displayPokemons(results);
  }

  // Eventos para filtrado en tiempo real y reinicio
  searchInput.addEventListener('input', filterPokemons);
  generationFilter.addEventListener('change', filterPokemons);
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    moveFilterInput.value = '';
    generationFilter.value = '';
    displayPokemons(pokemonData);
  });

  // Modo oscuro
  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', themeSwitch.checked);
  });
});
