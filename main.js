// main.js

// Usa PapaParse para cargar el CSV y luego inicializa Tabulator
Papa.parse("pokemons_detailed.csv", {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;
    // Inicializa Tabulator sobre el contenedor con id "pokedex"
    var table = new Tabulator("#pokedex", {
      data: data, // los datos parseados
      layout: "fitColumns",
      pagination: "local",
      paginationSize: 25,
      columns:[
        { title:"Pokemon", field:"Pokemon", hozAlign:"center" },
        { title:"Número", field:"numero", hozAlign:"center" },
        { title:"Nombre", field:"nombre", hozAlign:"center" },
        { title:"Forma", field:"forma", hozAlign:"center" },
        { title:"Nivel", field:"Nivel", hozAlign:"center" },
        { title:"Movimientos", field:"movimientos", formatter:"html", hozAlign:"center" },
        { title:"Habilidades", field:"habilidades", formatter:"html", hozAlign:"center" }
        // Si tienes columnas para efectividades, agrégalas aquí.
      ],
      // Opciones de localización (opcional)
      locale:true,
      langs:{
        "es": {
          "pagination": {
            "first": "Primera",
            "first_title": "Primera Página",
            "last": "Última",
            "last_title": "Última Página",
            "prev": "Anterior",
            "prev_title": "Página Anterior",
            "next": "Siguiente",
            "next_title": "Página Siguiente",
          },
          "groups": {
            "item": "elemento",
            "items": "elementos",
          },
        }
      },
      initialSort:[
        {column:"numero", dir:"asc"}
      ],
    });
  }
});
