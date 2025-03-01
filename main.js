// main.js
document.addEventListener("DOMContentLoaded", function () {
  // Usamos PapaParse para cargar el CSV
  Papa.parse("pokemons_detailed.csv", {
    download: true,
    header: true,
    complete: function (results) {
      var data = results.data;

      // Inicializar Tabulator
      var table = new Tabulator("#pokedex", {
        data: data,
        layout:"fitColumns",
        responsiveLayout:"collapse",
        tooltips: true,
        pagination:"local",
        paginationSize:20,
        columns:[
          {title:"Pokemon", field:"Pokemon", formatter:"html", headerSort:false},
          {title:"Número", field:"numero", hozAlign:"center"},
          {title:"Nombre", field:"nombre"},
          {title:"Forma", field:"forma", hozAlign:"center"},
          {title:"Nivel", field:"Nivel", hozAlign:"center"},
          {title:"Movimientos", field:"movimientos", formatter:"html"},
          {title:"Habilidades", field:"habilidades", formatter:"html"},
          {title:"Efetivo", field:"Efetivo", formatter:"html", hozAlign:"center"},
          {title:"Inefetivo", field:"Inefetivo", formatter:"html", hozAlign:"center"},
          {title:"Muito efetivo", field:"Muito efetivo", formatter:"html", hozAlign:"center"},
          {title:"Muito inefetivo", field:"Muito inefetivo", formatter:"html", hozAlign:"center"},
          {title:"Normal", field:"Normal", formatter:"html", hozAlign:"center"},
          {title:"Nulo", field:"Nulo", formatter:"html", hozAlign:"center"},
          {title:"Super efetivo", field:"Super efetivo", formatter:"html", hozAlign:"center"},
          {title:"Superefetivo", field:"Superefetivo", formatter:"html", hozAlign:"center"},
        ],
      });

      // Filtro de búsqueda: filtra por el campo "nombre" (puedes agregar más filtros si lo deseas)
      var searchInput = document.getElementById("search-input");
      searchInput.addEventListener("keyup", function () {
        var query = searchInput.value;
        table.setFilter([{ field:"nombre", type:"like", value:query }]);
      });
    },
  });
});
