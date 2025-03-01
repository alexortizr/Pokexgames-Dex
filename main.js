// main.js
document.addEventListener("DOMContentLoaded", function () {
  // Función para inicializar la tabla Tabulator
  function initTable(data) {
    var table = new Tabulator("#pokedex", {
      data: data,
      layout: "fitColumns",
      height: "500px",
      placeholder: "Cargando datos...",
      columns: [
        {title:"Pokemon", field:"Pokemon", formatter:"html", headerSort:false},
        {title:"Número", field:"numero", hozAlign:"center"},
        {title:"Nombre", field:"nombre"},
        {title:"Forma", field:"forma", hozAlign:"center"},
        {title:"Nivel", field:"Nivel", hozAlign:"center"},
        {title:"Movimientos", field:"movimientos", formatter:"html"},
        {title:"Habilidades", field:"habilidades", formatter:"html"},
        // Puedes agregar columnas para efectividades si lo deseas.
      ],
      // Al hacer clic en una fila se muestra la vista de detalle
      rowClick: function(e, row){
        showDetail(row.getData());
      },
    });

    // Filtro personalizado: revisa todas las propiedades de cada fila
    var searchInput = document.getElementById("search-input");
    searchInput.addEventListener("keyup", function () {
      var query = searchInput.value.toLowerCase();
      table.setFilter(function(data){
        // Recorremos cada clave del objeto data
        for (var key in data) {
          if (data[key] && data[key].toString().toLowerCase().includes(query)) {
            return true;
          }
        }
        return false;
      });
    });
  }

  // Función para mostrar la vista de detalle (estilo pokédex)
  function showDetail(rowData) {
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
    document.getElementById("table-view").style.display = "none";
    document.getElementById("detail-view").style.display = "block";
  }

  // Función para volver a la vista de tabla
  function backToTable() {
    document.getElementById("detail-view").style.display = "none";
    document.getElementById("table-view").style.display = "block";
  }
  document.getElementById("back-button").addEventListener("click", backToTable);

  // Cargar el CSV mediante PapaParse
  Papa.parse("pokemons_detailed.csv", {
    download: true,
    header: true,
    complete: function (results) {
      initTable(results.data);
    },
  });
});
