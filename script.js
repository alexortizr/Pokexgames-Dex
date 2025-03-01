document.addEventListener("DOMContentLoaded", () => {
  const pokemonContainer = document.getElementById('pokemon-container');
  const searchInput = document.getElementById('search-input');
  const resetButton = document.getElementById('reset-filters');
  const generationFilter = document.getElementById('generation-filter');
  const themeSwitch = document.getElementById('theme-switch');

  let pokemonData = [];

  // Cargar el archivo CSV desde data/pokemons_detailed.csv
  fetch('data/pokemons_detailed.csv')
    .then(response => response.text())
    .then(data => {
      // Usamos PapaParse para convertir el CSV a JSON
      const parsed = Papa.parse(data, { header: true, dynamicTyping: true });
      pokemonData = parsed.data;
      populateGenerationFilter(pokemonData);
      displayPokemons(pokemonData);
    })
    .catch(err => console.error(err));

  // Rellena el filtro de generaciones basado en la columna "forma"
  function populateGenerationFilter(data) {
    const generations = [...new Set(data.map(p => p.forma).filter(g => g))];
    generations.forEach(gen => {
      const option = document.createElement('option');
      option.value = gen;
      option.textContent = gen;
      generationFilter.appendChild(option);
    });
  }

  // Muestra las tarjetas de Pokémon
  function displayPokemons(data) {
    pokemonContainer.innerHTML = '';
    data.forEach(pokemon => {
      const card = document.createElement('div');
      card.classList.add('pokemon-card');
      // La columna "Pokemon" contiene el HTML para la imagen
      card.innerHTML = `
        ${pokemon.Pokemon}
        <h3>${pokemon.nombre} (#${pokemon.numero})</h3>
        <p>${pokemon.forma}</p>
      `;
      pokemonContainer.appendChild(card);
    });
  }

  // Función para filtrar los Pokémon
  function filterPokemons() {
    const searchValue = searchInput.value.toLowerCase();
    const generationValue = generationFilter.value;
    const filtered = pokemonData.filter(pokemon => {
      // Buscamos en nombre, número y forma
      const searchFields = [
        pokemon.nombre.toString().toLowerCase(), 
        pokemon.numero.toString(), 
        pokemon.forma.toString().toLowerCase()
      ];
      const matchesSearch = searchFields.some(field => field.includes(searchValue));
      const matchesGeneration = generationValue ? pokemon.forma === generationValue : true;
      return matchesSearch && matchesGeneration;
    });
    displayPokemons(filtered);
  }

  // Eventos para búsqueda y filtros
  searchInput.addEventListener('input', filterPokemons);
  generationFilter.addEventListener('change', filterPokemons);
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    generationFilter.value = '';
    displayPokemons(pokemonData);
  });

  // Activar/desactivar modo oscuro
  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode', themeSwitch.checked);
  });
});
