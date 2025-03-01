// main.js
document.addEventListener("DOMContentLoaded", function () {
  // Cargar el CSV con PapaParse
  Papa.parse("pokemons_detailed.csv", {
    download: true,
    header: true,
    complete: function (results) {
      var data = results.data;

      // Inicializar Tabulator con paginación
      var table = new Tabulator("#pokedex", {
        data: data,
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 10,
        placeholder: "Utiliza el buscador para encontrar tu Pokémon...",
        columns: [
          {title:"Pokemon", field:"Pokemon", formatter:"html", headerSort:false},
          {title:"Número", field:"numero", hozAlign:"center"},
          {title:"Nombre", field:"nombre"},
          {title:"Forma", field:"forma", hozAlign:"center"},
          {title:"Nivel", field:"Nivel", hozAlign:"center"},
          {title:"Movimientos", field:"movimientos", formatter:"html"},
          {title:"Habilidades", field:"habilidades", formatter:"html"},
          // Puedes agregar más columnas de efectividades si lo deseas.
        ],
        rowClick: function(e, row){
          // Al hacer clic, se abre el modal con detalles del Pokémon
          var rowData = row.getData();
          var modalBody = document.getElementById("modal-body");
          // Genera contenido en detalle (puedes ajustar según necesites)
          modalBody.innerHTML = `
            <h2>${rowData.nombre}</h2>
            <div>${rowData.Pokemon}</div>
            <p><strong>Número:</strong> ${rowData.numero}</p>
            <p><strong>Forma:</strong> ${rowData.forma}</p>
            <p><strong>Nivel:</strong> ${rowData.Nivel}</p>
            <h3>Movimientos</h3>
            <div>${rowData.movimientos}</div>
            <h3>Habilidades</h3>
            <div>${rowData.habilidades}</div>
            <h3>Efetividades</h3>
            <div>
              <p><strong>Efetivo:</strong> ${rowData.Efetivo}</p>
              <p><strong>Inefetivo:</strong> ${rowData.Inefetivo}</p>
              <p><strong>Muito efetivo:</strong> ${rowData["Muito efetivo"]}</p>
              <p><strong>Muito inefetivo:</strong> ${rowData["Muito inefetivo"]}</p>
              <p><strong>Normal:</strong> ${rowData.Normal}</p>
              <p><strong>Nulo:</strong> ${rowData.Nulo}</p>
              <p><strong>Super efetivo:</strong> ${rowData["Super efetivo"]}</p>
              <p><strong>Superefetivo:</strong> ${rowData.Superefetivo}</p>
            </div>
          `;
          document.getElementById("modal-overlay").style.display = "flex";
        },
      });

      // Filtro de búsqueda: filtra sobre todos los campos (puedes personalizar)
      var searchInput = document.getElementById("search-input");
      searchInput.addEventListener("keyup", function () {
        var query = searchInput.value;
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
    },
  });

  // Modal: Cerrar al hacer clic en el botón de cierre o fuera del contenido
  var modalOverlay = document.getElementById("modal-overlay");
  var modalClose = document.getElementById("modal-close");
  modalClose.addEventListener("click", function () {
    modalOverlay.style.display = "none";
  });
  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      modalOverlay.style.display = "none";
    }
  });
});
