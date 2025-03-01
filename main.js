Papa.parse("pokemons_detailed.csv", {
  download: true,
  header: true,
  complete: function(results) {
    var data = results.data;
    var table = new Tabulator("#pokedex", {
      data: data,
      layout: "fitColumns",
      columns: [
        {title:"Pokemon", field:"Pokemon", formatter:"html"},
        {title:"Número", field:"numero", hozAlign:"center"},
        {title:"Nombre", field:"nombre"},
        {title:"Forma", field:"forma", hozAlign:"center"},
        {title:"Nivel", field:"Nivel", hozAlign:"center"},
        {title:"Movimientos", field:"movimientos", formatter:"html"},
        {title:"Habilidades", field:"habilidades", formatter:"html"},
        // Agrega columnas para cada clave de efectividad si lo deseas...
      ],
    });
  }
});
