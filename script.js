// Ruta al CSV (asegúrate de que esté en la carpeta data)
const csvFile = "data/pokemons_detailed.csv";

// Función para inicializar Tabulator y configurar el buscador
function initializeTable(data) {
  // Configurar Tabulator con scroll infinito (virtual DOM)
  const table = new Tabulator("#pokedex", {
    data: data,
    layout:"fitColumns",
    placeholder:"No se encontraron datos",
    pagination:"local",           // para paginación local; si prefieres scrolling virtual, puedes probar pagination:false y virtual DOM
    paginationSize:20,
    movableColumns:true,
    columns:[
      {title:"Pokemon", field:"Pokemon", formatter:"html", headerSort:false, width:150},
      {title:"Número", field:"numero", hozAlign:"center", sorter:"number", width:80},
      {title:"Nombre", field:"nombre", sorter:"string", width:120},
      {title:"Forma", field:"forma", hozAlign:"center", width:100},
      {title:"Nivel", field:"Nivel", hozAlign:"center", sorter:"number", width:80},
      {title:"Movimientos", field:"movimientos", formatter:"html", width:300},
      {title:"Habilidades", field:"habilidades", formatter:"html", width:150},
      // Para cada clave de efectividad (por ejemplo, "Efetivo", "Inefetivo", etc.),
      // se asume que en el CSV están como columnas con estos nombres.
      // Si se tienen columnas dinámicas, Tabulator las agregará según el CSV.
      {title:"Efetivo", field:"Efetivo", formatter:"html", width:120},
      {title:"Inefetivo", field:"Inefetivo", formatter:"html", width:120},
      {title:"Muito efetivo", field:"Muito efetivo", formatter:"html", width:120},
      {title:"Muito inefetivo", field:"Muito inefetivo", formatter:"html", width:120},
      {title:"Normal", field:"Normal", formatter:"html", width:120},
      {title:"Nulo", field:"Nulo", formatter:"html", width:120},
      {title:"Super efetivo", field:"Super efetivo", formatter:"html", width:120},
      {title:"Superefetivo", field:"Superefetivo", formatter:"html", width:120},
    ],
    // Evento al hacer clic en la fila: muestra la vista detalle en formato pokedex
    rowClick:function(e, row){
      const rowData = row.getData();
      showDetail(rowData);
    },
  });

  // Buscador: filtra en todas las columnas
  document.getElementById("search-input").addEventListener("input", function(){
    const query = this.value;
    table.setFilter([
      {field:"Pokemon", type:"like", value:query},
      {field:"numero", type:"like", value:query},
      {field:"nombre", type:"like", value:query},
      {field:"forma", type:"like", value:query},
      {field:"Nivel", type:"like", value:query},
      {field:"movimientos", type:"like", value:query},
      {field:"habilidades", type:"like", value:query},
      {field:"Efetivo", type:"like", value:query},
      {field:"Inefetivo", type:"like", value:query},
      {field:"Muito efetivo", type:"like", value:query},
      {field:"Muito inefetivo", type:"like", value:query},
      {field:"Normal", type:"like", value:query},
      {field:"Nulo", type:"like", value:query},
      {field:"Super efetivo", type:"like", value:query},
      {field:"Superefetivo", type:"like", value:query},
    ]);
  });
}

// Función para mostrar la vista detalle al hacer clic en una fila
function showDetail(rowData) {
  // Oculta la tabla y muestra el detalle
  document.getElementById("pokedex").style.display = "none";
  const detailContainer = document.getElementById("pokedex-detail");
  detailContainer.classList.remove("hidden");

  // Puedes personalizar este bloque HTML para que se parezca a una pokedex
  let detailHTML = `
    <div class="pokedex-detail-card">
      <div class="pokedex-detail-header">
        <div class="pokedex-detail-image">
          ${rowData.Pokemon}
        </div>
        <div class="pokedex-detail-info">
          <h2>${rowData.nombre} (#${rowData.numero})</h2>
          <p><strong>Forma:</strong> ${rowData.forma}</p>
          <p><strong>Nivel:</strong> ${rowData.Nivel}</p>
        </div>
      </div>
      <div class="pokedex-detail-body">
        <h3>Movimientos</h3>
        <div>${rowData.movimientos}</div>
        <h3>Habilidades</h3>
        <div>${rowData.habilidades}</div>
        <h3>Efetividades</h3>
        <div>
          <p><strong>Efetivo:</strong> ${rowData["Efetivo"] || ""}</p>
          <p><strong>Inefetivo:</strong> ${rowData["Inefetivo"] || ""}</p>
          <p><strong>Muito efetivo:</strong> ${rowData["Muito efetivo"] || ""}</p>
          <p><strong>Muito inefetivo:</strong> ${rowData["Muito inefetivo"] || ""}</p>
          <p><strong>Normal:</strong> ${rowData["Normal"] || ""}</p>
          <p><strong>Nulo:</strong> ${rowData["Nulo"] || ""}</p>
          <p><strong>Super efetivo:</strong> ${rowData["Super efetivo"] || ""}</p>
          <p><strong>Superefetivo:</strong> ${rowData["Superefetivo"] || ""}</p>
        </div>
      </div>
    </div>
  `;
  document.getElementById("detail-content").innerHTML = detailHTML;
}

// Botón para volver a la vista de la tabla
document.getElementById("back-btn").addEventListener("click", function(){
  document.getElementById("pokedex-detail").classList.add("hidden");
  document.getElementById("pokedex").style.display = "block";
});

// Usamos PapaParse para cargar el CSV y luego inicializar Tabulator
Papa.parse("data/pokemons_detailed.csv", {
  download: true,
  header: true,
  dynamicTyping: false,
  complete: function(results) {
    console.log("CSV cargado:", results.data);
    initializeTable(results.data);
  },
  error: function(err) {
    console.error("Error al cargar CSV:", err);
  }
});
