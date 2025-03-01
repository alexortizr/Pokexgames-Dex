// main.js
document.addEventListener("DOMContentLoaded", function () {
  // Función para inicializar la tabla Tabulator
  function initTable(data) {
    // Crear Tabulator en el div #pokedex con un alto fijo para scroll
    var table = new Tabulator("#pokedex", {
      data: data,
      layout: "fitColumns",
      height: "500px",  // contenedor con scroll vertical
      placeholder: "Cargando datos...",
      columns: [
        {title:"Pokemon", field:"Pokemon", formatter:"html", headerSort:false},
        {title:"Número", field:"numero", hozAlign:"center"},
        {title:"Nombre", field:"nombre"},
        {title:"Forma", field:"forma", hozAlign:"center"},
        {title:"Nivel", field:"Nivel", hozAlign:"center"},
        {title:"Movimientos", field:"movimientos", formatter:"html"},
        {title:"Habilidades", field:"habilidades", formatter:"html"},
        // Puedes agregar columnas de efectividades si lo deseas.
      ],
      // Al hacer clic en una fila, mostrar vista de detalle
      rowClick: function(e, row){
        var rowData = row.getData();
        showDetail(rowData);
      },
    });

    // Filtro de búsqueda
    var searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keyup", function () {
      var query = searchInput.value;
      // Filtra en varios campos
      table.setFilter([
        {field:"nombre", type:"like", value:query},
        {field:"numero", type:"like", value:query},
        {field:"forma", type:"like", value:query},
        {field:"Nivel", type:"like", value:query},
        {field:"Pokemon", type:"like", value:query},
        {field:"movimientos", type:"like", value:query},
        {field:"habilidades", type:"like", value:query},
      ]);
    });
  }

  // Función para mostrar el detalle del Pokémon en vista pokédex
  function showDetail(rowData) {
    // Crear contenido de detalle (puedes personalizar el HTML)
    var detailContent = `
      <div class="pokedex-detail">
        <h2>${rowData.nombre}</h2>
        <div>${rowData.Pokemon}</div>
        <p><strong>Número:</strong> ${rowData.numero}</p>
        <p><strong>Forma:</strong> ${rowData.forma}</p>
        <p><strong>Nivel:</strong> ${rowData.Nivel}</p>
        <h3>Movimientos</h3>
        <div>${rowData.movimientos}</div>
        <h3>Habilidades</h3>
        <div>${rowData.habilidades}</div>
      </div>
    `;
    document.getElementById("detail-content").innerHTML = detailContent;
    // Ocultar vista de tabla y mostrar detalle
    document.getElementById("table-view").style.display = "none";
    document.getElementById("detail-view").style.display = "block";
  }

  // Función para volver a la vista de tabla
  function backToTable() {
    document.getElementById("detail-view").style.display = "none";
    document.getElementById("table-view").style.display = "block";
  }
  document.getElementById("back-button").addEventListener("click", backToTable);

  // Cargar el CSV con PapaParse
  Papa.parse("pokemons_detailed.csv", {
    download: true,
    header: true,
    complete: function (results) {
      var data = results.data;
      // Inicializar la tabla con los datos
      initTable(data);
    },
  });
});
