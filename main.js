document.addEventListener("DOMContentLoaded", function () {
  // Cargar el CSV usando PapaParse (el archivo CSV está en la carpeta data)
  Papa.parse("data/pokemons_detailed.csv", {
    download: true,
    header: true,
    complete: function(results) {
      console.log("CSV cargado:", results.data);
      initTable(results.data);
    },
    error: function(err) {
      console.error("Error al parsear CSV:", err);
    }
  });
});

function initTable(data) {
  // Crear la tabla con Tabulator
  var table = new Tabulator("#table-container", {
    data: data,
    layout:"fitColumns",
    responsiveLayout:"hide",
    columns:[
      {title:"Pokemon", field:"Pokemon", formatter:"html", headerSort:false},
      {title:"Número", field:"numero", hozAlign:"center", sorter:"number"},
      {title:"Nombre", field:"nombre", sorter:"string"},
      {title:"Forma", field:"forma", hozAlign:"center"},
      {title:"Nivel", field:"Nivel", hozAlign:"center", sorter:"number"},
      {title:"Movimientos", field:"movimientos", formatter:"html"},
      {title:"Habilidades", field:"habilidades", formatter:"html"},
      {title:"Efetivo", field:"Efetivo", formatter:"html", headerSort:false},
      {title:"Inefetivo", field:"Inefetivo", formatter:"html", headerSort:false},
      {title:"Muito Efetivo", field:"Muito efetivo", formatter:"html", headerSort:false},
      {title:"Muito Inefetivo", field:"Muito inefetivo", formatter:"html", headerSort:false},
      {title:"Normal", field:"Normal", formatter:"html", headerSort:false},
      {title:"Nulo", field:"Nulo", formatter:"html", headerSort:false},
      {title:"Super Efetivo", field:"Super efetivo", formatter:"html", headerSort:false},
      {title:"Superefetivo", field:"Superefetivo", formatter:"html", headerSort:false},
    ],
    initialSort:[
      {column:"numero", dir:"asc"},
    ],
    // En vez de paginación, usamos scroll (definido con una altura fija)
    height:"500px",
    // Al hacer clic en una fila, mostramos una vista detallada en formato "Pokédex"
    rowClick:function(e, row){
      showDetail(row.getData());
    },
  });

  // Buscador: filtrar en todas las columnas relevantes
  var searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keyup", function(){
    // Se filtra por cada columna (usa la opción multicolumn filter de Tabulator)
    table.setFilter([
      {field:"nombre", type:"like", value:searchInput.value},
      {field:"numero", type:"like", value:searchInput.value},
      {field:"forma", type:"like", value:searchInput.value},
      {field:"Nivel", type:"like", value:searchInput.value},
      {field:"movimientos", type:"like", value:searchInput.value},
      {field:"habilidades", type:"like", value:searchInput.value},
      {field:"Efetivo", type:"like", value:searchInput.value},
      {field:"Inefetivo", type:"like", value:searchInput.value},
      {field:"Muito efetivo", type:"like", value:searchInput.value},
      {field:"Muito inefetivo", type:"like", value:searchInput.value},
      {field:"Normal", type:"like", value:searchInput.value},
      {field:"Nulo", type:"like", value:searchInput.value},
      {field:"Super efetivo", type:"like", value:searchInput.value},
      {field:"Superefetivo", type:"like", value:searchInput.value},
    ]);
  });
}

function showDetail(data) {
  // Vista detallada estilo Pokédex (se muestra en un div que se oculta inicialmente)
  var detailView = document.getElementById("detail-view");
  detailView.innerHTML = "";
  var card = document.createElement("div");
  card.className = "detail-card";
  card.innerHTML = `
    <div class="detail-pokemon">${data["Pokemon"]}</div>
    <div><strong>Número:</strong> ${data["numero"]}</div>
    <div><strong>Nombre:</strong> ${data["nombre"]}</div>
    <div><strong>Forma:</strong> ${data["forma"]}</div>
    <div><strong>Nivel:</strong> ${data["Nivel"]}</div>
    <div><strong>Movimientos:</strong> ${data["movimientos"]}</div>
    <div><strong>Habilidades:</strong> ${data["habilidades"]}</div>
    <div><strong>Efetivo:</strong> ${data["Efetivo"]}</div>
    <div><strong>Inefetivo:</strong> ${data["Inefetivo"]}</div>
    <div><strong>Muito Efetivo:</strong> ${data["Muito efetivo"]}</div>
    <div><strong>Muito Inefetivo:</strong> ${data["Muito inefetivo"]}</div>
    <div><strong>Normal:</strong> ${data["Normal"]}</div>
    <div><strong>Nulo:</strong> ${data["Nulo"]}</div>
    <div><strong>Super Efetivo:</strong> ${data["Super efetivo"]}</div>
    <div><strong>Superefetivo:</strong> ${data["Superefetivo"]}</div>
    <button onclick="document.getElementById('detail-view').classList.add('hidden');">Cerrar</button>
  `;
  detailView.appendChild(card);
  detailView.classList.remove("hidden");
}
