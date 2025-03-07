document.addEventListener("DOMContentLoaded", () => {
    const themeSwitch = document.getElementById("theme-switch");

    if (localStorage.getItem("dark-mode") === "enabled") {
        document.body.classList.add("dark-mode");
        themeSwitch.checked = true;
    }

    themeSwitch.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", themeSwitch.checked);
        localStorage.setItem("dark-mode", themeSwitch.checked ? "enabled" : "disabled");
    });

    // Manejo de filtros activos
    const filterButtons = document.querySelectorAll(".filter-button");
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            button.classList.toggle("active");
        });
    });

    // Agregar funcionalidad a los submenús de movimientos
    const movementTitles = document.querySelectorAll(".movement-title");
    movementTitles.forEach(title => {
        title.addEventListener("click", () => {
            const submenu = title.nextElementSibling;
            submenu.classList.toggle("open");
        });
    });

    // Agregar botón "Restablecer filtros"
    document.getElementById("reset-filters").addEventListener("click", () => {
        filterButtons.forEach(button => button.classList.remove("active"));
    });
});
