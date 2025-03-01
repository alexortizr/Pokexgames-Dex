document.addEventListener("DOMContentLoaded", () => {
  const pokemonContainer = document.getElementById('pokemon-container');
  const searchInput = document.getElementById('search-input');
  const resetButton = document.getElementById('reset-filters');
  const generationFilter = document.getElementById('generation-filter');
  const themeSwitch = document.getElementById('theme-switch');

  const modal = document.getElementById('pokemon-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  let pokemonData = [];
  let fuse; // Para búsqueda difusa

  // Mapeo de tipos a colores
  const typeColors = {
    "Acero": { bg: "LightGrey", border: "Silver" },
    "Agua": { bg: "RoyalBlue", border: "MediumSlateBlue" },
    "Bicho": { bg: "YellowGreen", border: "OliveDrab" },
    "Dragón": { bg: "MediumSlateBlue", border: "SlateBlue" },
    "Eléctrico": { bg: "Yellow", border: "Gold" },
    "Fantasma": { bg: "Purple", border: "Indigo" },
    "Fuego": { bg: "Crimson", border: "Firebrick" },
    "Hada": { bg: "rgb(255, 136, 238)", border: "rgb(255, 187, 238)" },
    "Hielo": { bg: "AquaMarine", border: "PaleTurquoise" },
    "Lucha": { bg: "Firebrick", border: "Darkred" },
    "Normal": { bg: "Lavender", border: "Gainsboro" },
    "Planta": { bg: "Lime", border: "Limegreen" },
    "Psíquico": { bg: "Violet", border: "Plum" },
    "Roca": { bg: "Peru", border: "Chocolate" },
    "Siniestro": { bg: "SlateGray", border: "Darkslategray" },
    "Tierra": { bg: "BurlyWood", border: "Tan" },
    "Veneno": { bg: "Mediumpurple", border: "Blueviolet" }
  };

  // Función para obtener estilo del borde según el tipo (o tipos)
  function getBorderStyle(pokemon) {
    if (!pokemon.tipo) return "";
    const types = pokemon.tipo.split(',').map(t => t.trim());
    if (types.length === 1) {
      const color = typeColors[types[0]] ? typeColors[types[0]].border : "#000";
      return `border: 4px solid ${color};`;
    } else {
      const color1 = typeColors[types[0]] ? typeColors[types[0]].border : "#000";
      const color2 = typeColors[types[1]] ? typeColors[types[1]].border : "#000";
      return `border: 4px solid;
              border-image: linear-gradient(45deg, ${color1}, ${color2}) 1;`;
    }
  }

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

  // Mostrar detalles del Pokémon en un modal
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

  function populateGenerationFilter(data) {
    const generations = [...new Set(data.map(p => p.forma).filter(g => g))];
    generations.forEach(gen => {
      const option = document.createElement('option');
      option.value = gen;
      option.textContent = gen;
      generationFilter.appendChild(option);
    });
  }

  function displayPokemons(data) {
    pokemonContainer.innerHTML = '';
    if (data.length === 0) {
      pokemonContainer.innerHTML = "<p>No se encontraron resultados.</p>";
      return;
    }
    data.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('pokemon-card');
      card.style.cssText += getBorderStyle(pokemon);
      card.innerHTML = `
        ${pokemon.Pokemon}
        <h3>${pokemon.nombre} (#${pokemon.paddedNumero || pokemon.forma})</h3>
        <p>${pokemon.forma}</p>
      `;
      card.addEventListener('click', () => showPokemonDetails(pokemon));
      pokemonContainer.appendChild(card);
    });
  }

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

  searchInput.addEventListener('input', filterPokemons);
  generationFilter.addEventListener('change', filterPokemons);
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    generationFilter.value = '';
    displayPokemons(pokemonData);
  });

  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', themeSwitch.checked);
  });
});
