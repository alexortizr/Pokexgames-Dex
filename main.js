/* main.js */
$(document).ready(function() {
  Papa.parse("pokemons_detailed.csv", {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data;
      // Convertir cada registro en un array siguiendo el orden de columnas deseado:
      const rows = data.map(row => [
        row["Pokemon"],
        row["numero"],
        row["nombre"],
        row["forma"],
        row["Nivel"],
        row["movimientos"],
        row["habilidades"]
        // Si tienes columnas adicionales, agrégalas aquí.
      ]);
      
      $("#pokedex").DataTable({
        data: rows,
        columns: [
          { title: "Pokemon" },
          { title: "Número" },
          { title: "Nombre" },
          { title: "Forma" },
          { title: "Nivel" },
          { title: "Movimientos" },
          { title: "Habilidades" }
        ],
        pageLength: 25,
        responsive: true,
        language: {
          url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"
        }
      });
    }
  });
});
