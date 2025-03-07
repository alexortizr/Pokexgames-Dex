// filters.js
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('pokemon-search');
  const resetButton = document.getElementById('reset-filters');

  // Contenedores de cada sección de filtros
  const formasContainer = document.getElementById('filter-forma').querySelector('#formas-container');
  const elementosContainer = document.getElementById('filter-elemento').querySelector('#elementos-container');
  const clasesContainer = document.getElementById('filter-clase').querySelector('#clases-container');
  const nivelesContainer = document.getElementById('filter-nivel').querySelector('#niveles-container');
  const tierContainer = document.getElementById('filter-tier').querySelector('#tier-container');
  const habilidadesContainer = document.getElementById('filter-habilidades').querySelector('#habilidades-container');

  // Movimientos
  const movimientosFilterInput = document.getElementById('movimientos-filter');
  const movimientosDatalist = document.getElementById('movimientos-list');
  const movimientosTiposContainer = document.getElementById('movimientos-tipos-container');
  const movimientosElementosContainer = document.getElementById('movimientos-elementos-container');

  // Efectividades
  const efectividadesContainer = document.getElementById('filter-efectividades').querySelector('#efectividades-container');

  // Resumen
  const filterSummaryDiv = document.getElementById('filter-summary');

  let allPokemons = [];

  // Mapas de imágenes
  const elementImages = {
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

  const classImages = {
    "Raibolt": "https://wiki.pokexgames.com/images/b/b4/Raibol1t.png",
    "Naturia": "https://wiki.pokexgames.com/images/3/30/Naturia1.png",
    "Wingeon": "https://wiki.pokexgames.com/images/0/0c/Wingeon1.png",
    "Ironhard": "https://wiki.pokexgames.com/images/9/9a/Ironhard1.png",
    "Psycraft": "https://wiki.pokexgames.com/images/5/59/Psycraft1.png",
    "Volcanic": "https://wiki.pokexgames.com/images/6/64/Volcanic1.png",
    "Malefic": "https://wiki.pokexgames.com/images/5/56/Malefi1c.png",
    "Orebound": "https://wiki.pokexgames.com/images/e/e2/Orebound1.png",
    "Gardestrike": "https://wiki.pokexgames.com/images/3/39/Gardestrike1.png",
    "Seavell": "https://wiki.pokexgames.com/images/2/2c/Seave1ll.png"
  };

  function generatePokeballLabel(filterClass, value, imageUrl) {
    const strValue = String(value);
    const id = filterClass + '-' + strValue.replace(/\s+/g, '_');
    return `
      <label class="pokeball-label" for="${id}">
        ${ imageUrl ? `<img class="icon" src="${imageUrl}" alt="${strValue}">` : '' }
        <span class="label-text">${strValue}</span>
        <input type="checkbox" id="${id}" class="${filterClass}" value="${strValue}">
        <div class="switch"></div>
      </label>
    `;
  }
  function generatePokeballLabelNoImage(filterClass, value) {
    return generatePokeballLabel(filterClass, value, "");
  }

  window.initializeFilters = function(pokemons) {
    allPokemons = pokemons;

    // Forma
    const formas = [...new Set(allPokemons.map(p => p.forma).filter(Boolean))];
    formasContainer.innerHTML = formas.map(f => generatePokeballLabelNoImage('forma-filter', f)).join('');

    // Elemento
    const elementos = [...new Set(
      allPokemons.flatMap(p => (p.elementos || '').split(',').map(e => e.trim()))
    )].filter(Boolean);
    elementosContainer.innerHTML = elementos.map(e => {
      const img = elementImages[e] || "";
      return generatePokeballLabel('element-filter', e, img);
    }).join('');

    // Clase
    const claseOptions = ["Volcanic","Raibolt","Orebound","Naturia","Wingeon","Psycraft","Seavell","Malefic","Ironhard","Gardestrike"];
    clasesContainer.innerHTML = claseOptions.map(c => {
      const img = classImages[c] || "";
      return generatePokeballLabel('clase-filter', c, img);
    }).join('');

    // Nivel
    const niveles = [...new Set(allPokemons.map(p => p.level))].sort((a,b)=>a-b);
    nivelesContainer.innerHTML = niveles.map(n => generatePokeballLabelNoImage('nivel-filter', n)).join('');

    // Tier
    const tierOptions = ["Tier 1A","Tier 1B","Tier 1C","Tier 1H","Tier 2","Tier 3"];
    tierContainer.innerHTML = tierOptions.map(t => generatePokeballLabelNoImage('tier-filter', t)).join('');

    // Habilidades
    const habilidadesSet = new Set();
    allPokemons.forEach(p => {
      (p.habilidades || []).forEach(h => {
        if(h && h.trim()) habilidadesSet.add(h.trim());
      });
    });
    const habilidadesArray = Array.from(habilidadesSet).sort();
    habilidadesContainer.innerHTML = habilidadesArray.map(h => generatePokeballLabelNoImage('habilidad-filter', h)).join('');

    // Movimientos (buscador)
    const movimientosSet = new Set();
    allPokemons.forEach(p => {
      if(Array.isArray(p.movimientos)) {
        p.movimientos.forEach(mov => {
          if(mov.move && mov.move.trim()) movimientosSet.add(mov.move);
        });
      }
    });
    const movimientosArray = Array.from(movimientosSet).sort();
    movimientosDatalist.innerHTML = movimientosArray.map(m => `<option value="${m}">`).join('');

    // Tipos de Movimiento
    const movimientoTiposSet = new Set();
    allPokemons.forEach(p => {
      if(Array.isArray(p.movimientos)) {
        p.movimientos.forEach(m => {
          if(m.imagenes_accion) {
            m.imagenes_accion.forEach(acc => {
              if(acc.title) movimientoTiposSet.add(acc.title);
            });
          }
        });
      }
    });
    const movimientoTiposArray = Array.from(movimientoTiposSet).sort();
    movimientosTiposContainer.innerHTML = movimientoTiposArray.map(t => generatePokeballLabelNoImage('movimiento-tipo-filter', t)).join('');

    // Elementos de Movimiento
    const movimientoElementosSet = new Set();
    allPokemons.forEach(p => {
      if(Array.isArray(p.movimientos)) {
        p.movimientos.forEach(m => {
          if(m.element) movimientoElementosSet.add(m.element);
        });
      }
    });
    const movimientoElementosArray = Array.from(movimientoElementosSet).sort();
    movimientosElementosContainer.innerHTML = movimientoElementosArray.map(e => {
      const img = elementImages[e] || "";
      return generatePokeballLabel('movimiento-elemento-filter', e, img);
    }).join('');

    // Efectividades
    initializeEfectividadesFilters(allPokemons);

    addEventListenersToFilters();
  };

  function initializeEfectividadesFilters(pokemons) {
    const categoryOrder = ["Muy efectivo","Efectivo","Normal","Inefectivo","Muy Inefectivo","Inmune"];
    const categoriesSet = new Set();
    pokemons.forEach(p => {
      if(p.efectividades) {
        Object.keys(p.efectividades).forEach(cat => categoriesSet.add(cat));
      }
    });
    let categoriesArray = Array.from(categoriesSet);
    categoriesArray.sort((a,b)=>{
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      if(idxA === -1 && idxB === -1) return a.localeCompare(b);
      if(idxA === -1) return 1;
      if(idxB === -1) return -1;
      return idxA - idxB;
    });

    let html = '';
    categoriesArray.forEach(cat => {
      const catId = cat.toLowerCase().replace(/\s+/g,'-');
      html += `
        <details>
          <summary>${cat}</summary>
          <div class="toggles-grid" id="efectividad-${catId}-container"></div>
        </details>
      `;
    });
    efectividadesContainer.innerHTML = html;

    categoriesArray.forEach(cat => {
      const catId = cat.toLowerCase().replace(/\s+/g,'-');
      const container = document.getElementById(`efectividad-${catId}-container`);
      const elementsSet = new Set();
      pokemons.forEach(p => {
        if(p.efectividades && p.efectividades[cat]) {
          p.efectividades[cat].forEach(e => elementsSet.add(e));
        }
      });
      const sortedElements = Array.from(elementsSet).sort();
      const checkboxesHTML = sortedElements.map(e => {
        const strVal = String(e);
        const img = elementImages[strVal] || "";
        const subId = `efectividad-filter-${catId}-${strVal.replace(/\s+/g,'_')}`;
        return `
          <label class="pokeball-label" for="${subId}">
            ${ img ? `<img class="icon" src="${img}" alt="${strVal}">` : '' }
            <span class="label-text">${strVal}</span>
            <input type="checkbox" id="${subId}" class="efectividad-filter" data-category="${cat}" value="${strVal}">
            <div class="switch"></div>
          </label>
        `;
      }).join('');
      container.innerHTML = checkboxesHTML;
    });
  }

  function addEventListenersToFilters() {
    // Indicador de filtros activos
    document.querySelectorAll('.pokeball-label input').forEach(input => {
      input.addEventListener('change', () => {
        if(input.checked){
          input.parentElement.classList.add('active-filter');
        } else {
          input.parentElement.classList.remove('active-filter');
        }
      });
    });

    searchInput.addEventListener('input', applyFilters);
    document.querySelectorAll('.forma-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('.element-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('.clase-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('.nivel-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('.tier-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('.habilidad-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    movimientosFilterInput.addEventListener('input', applyFilters);
    document.querySelectorAll('.movimiento-tipo-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    document.querySelectorAll('.movimiento-elemento-filter').forEach(cb => cb.addEventListener('change', applyFilters));
    setTimeout(() => {
      document.querySelectorAll('.efectividad-filter').forEach(cb => {
        cb.addEventListener('change', applyFilters);
      });
    }, 0);
  }

  function applyFilters() {
    let filtered = [...allPokemons];
    const searchTerm = searchInput.value.toLowerCase();
    if(searchTerm) {
      filtered = filtered.filter(p => {
        const nameMatch = p.nombre.toLowerCase().includes(searchTerm);
        const numberMatch = String(p.numero).toLowerCase().includes(searchTerm);
        return nameMatch || numberMatch;
      });
    }
    const checkedFormas = Array.from(document.querySelectorAll('.forma-filter:checked')).map(e => e.value);
    if(checkedFormas.length > 0) {
      filtered = filtered.filter(p => checkedFormas.includes(p.forma));
    }
    const checkedElements = Array.from(document.querySelectorAll('.element-filter:checked')).map(e => e.value);
    if(checkedElements.length > 0) {
      filtered = filtered.filter(p => {
        if(!p.elementos) return false;
        const pokeElems = p.elementos.split(',').map(e => e.trim());
        return pokeElems.some(elem => checkedElements.includes(elem));
      });
    }
    const checkedClases = Array.from(document.querySelectorAll('.clase-filter:checked')).map(e => e.value);
    if(checkedClases.length > 0) {
      filtered = filtered.filter(p => {
        if(!p.clase) return false;
        const pokeClases = p.clase.split(',').map(c => c.trim());
        return pokeClases.some(c => checkedClases.includes(c));
      });
    }
    const checkedNiveles = Array.from(document.querySelectorAll('.nivel-filter:checked')).map(e => parseInt(e.value, 10));
    if(checkedNiveles.length > 0) {
      filtered = filtered.filter(p => checkedNiveles.includes(p.level));
    }
    const checkedTiers = Array.from(document.querySelectorAll('.tier-filter:checked')).map(e => e.value);
    if(checkedTiers.length > 0) {
      filtered = filtered.filter(p => checkedTiers.includes(p.tier));
    }
    const checkedHabilidades = Array.from(document.querySelectorAll('.habilidad-filter:checked')).map(e => e.value);
    if(checkedHabilidades.length > 0) {
      filtered = filtered.filter(p => {
        if(!p.habilidades) return false;
        return p.habilidades.some(h => checkedHabilidades.includes(h));
      });
    }
    const movimientoTerm = movimientosFilterInput.value.toLowerCase();
    if(movimientoTerm) {
      filtered = filtered.filter(p => {
        if(!p.movimientos) return false;
        return p.movimientos.some(mov => mov.move.toLowerCase().includes(movimientoTerm));
      });
    }
    const checkedMovTipos = Array.from(document.querySelectorAll('.movimiento-tipo-filter:checked')).map(e => e.value);
    if(checkedMovTipos.length > 0) {
      filtered = filtered.filter(p => {
        if(!p.movimientos) return false;
        return p.movimientos.some(m => {
          if(!m.imagenes_accion) return false;
          const titles = m.imagenes_accion.map(acc => acc.title);
          return titles.some(t => checkedMovTipos.includes(t));
        });
      });
    }
    const checkedMovElementos = Array.from(document.querySelectorAll('.movimiento-elemento-filter:checked')).map(e => e.value);
    if(checkedMovElementos.length > 0) {
      filtered = filtered.filter(p => {
        if(!p.movimientos) return false;
        return p.movimientos.some(m => checkedMovElementos.includes(m.element));
      });
    }
    const checkedEfectividades = document.querySelectorAll('.efectividad-filter:checked');
    if(checkedEfectividades.length > 0) {
      const selectionsByCat = {};
      checkedEfectividades.forEach(cb => {
        const cat = cb.getAttribute('data-category');
        const val = cb.value;
        if(!selectionsByCat[cat]) selectionsByCat[cat] = [];
        selectionsByCat[cat].push(val);
      });
      filtered = filtered.filter(p => {
        if(!p.efectividades) return false;
        for(let cat in selectionsByCat) {
          if(!p.efectividades[cat]) return false;
          const requiredValues = selectionsByCat[cat];
          const pokeValues = p.efectividades[cat];
          const intersection = pokeValues.filter(val => requiredValues.includes(val));
          if(intersection.length === 0) return false;
        }
        return true;
      });
    }
    window.renderPokemons(filtered);
    showFilterSummary(filtered);
  }

  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    movimientosFilterInput.value = '';
    document.querySelectorAll('.forma-filter, .element-filter, .clase-filter, .nivel-filter, .tier-filter, .habilidad-filter, .movimiento-tipo-filter, .movimiento-elemento-filter, .efectividad-filter')
      .forEach(input => { 
        input.checked = false; 
        input.parentElement.classList.remove('active-filter'); 
      });
    window.renderPokemons(allPokemons);
    showFilterSummary(allPokemons);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const detailsSections = document.querySelectorAll('.filter-section');
  detailsSections.forEach((section) => {
    section.addEventListener('toggle', function () {
      if (this.open) {
        detailsSections.forEach(other => {
          if (other !== this && other.open) {
            other.removeAttribute('open');
          }
        });
      }
    });
  });
});

