import { configurarFormularioSala, cargarSalasTabla } from "./view/salasView.js";
import { configurarFormularioObra, cargarObrasTabla } from "./view/obrasView.js";

// Esta función muestra la sección deseada y oculta las demás
window.mostrarSeccion = function (seccion) {
  const secciones = document.querySelectorAll(".form-section");
  secciones.forEach(div => div.classList.remove("active"));

  const divMostrar = document.getElementById(`seccion-${seccion}`);
  if (divMostrar) {
    divMostrar.classList.add("active");
  }

  // Lógica específica al cambiar de sección
  if (seccion === "salas") {
    configurarFormularioSala();
    cargarSalasTabla();
  } else if (seccion === "obras") {
    configurarFormularioObra();
    cargarObrasTabla();
  }
};

// Cuando el documento se carga, mostramos las salas por defecto
document.addEventListener("DOMContentLoaded", () => {
  mostrarSeccion("salas");
});
