import { guardarSala, eliminarSala as eliminarSalaBD, actualizarSala } from "../controller/salasController.js";
import { obtenerSalas } from "../model/salasModel.js";

function esUrlValida(url) {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(url);
}

function validarFormulario(nombre, descripcion, imagen) {
  if (!nombre) {
    alert("El nombre no puede estar vacío.");
    return false;
  }
  if (descripcion.length < 10) {
    alert("La descripción debe tener al menos 10 caracteres.");
    return false;
  }
  if (!esUrlValida(imagen)) {
    alert("La URL de la imagen no es válida o no tiene formato de imagen.");
    return false;
  }
  return true;
}

export function configurarFormularioSala() {
  const form = document.getElementById("form-sala");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre-sala").value.trim();
    const descripcion = document.getElementById("descripcion-sala").value.trim();
    const imagen = document.getElementById("imagen-sala").value.trim();

    if (!validarFormulario(nombre, descripcion, imagen)) return;

    await guardarSala({ nombre, descripcion, imagenUrl: imagen });
    form.reset();
    cargarSalasTabla();
  });

  // Cancelar edición
  const modal = document.getElementById("modal-editar-sala");
  document.getElementById("btn-cancelar-edicion-sala").onclick = () => {
    modal.style.display = "none";
  };
  document.getElementById("cerrar-modal-editar-sala").onclick = () => {
    modal.style.display = "none";
  };
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });
}

export async function cargarSalasTabla() {
  const salas = await obtenerSalas();
  const tabla = document.getElementById("tabla-salas");
  tabla.innerHTML = "";

  salas.forEach((sala) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${sala.nombre}</td>
      <td>${sala.descripcion}</td>
      <td><img src="${sala.imagenUrl}" width="60" /></td>
      <td>
        <button class="btn-editar">✏️</button>
        <button class="btn-eliminar">🗑️</button>
      </td>
    `;

    const btnEditar = fila.querySelector(".btn-editar");
    const btnEliminar = fila.querySelector(".btn-eliminar");

    btnEditar.addEventListener("click", () => {
      abrirModalEditarSala(sala.id, sala.nombre, sala.descripcion, sala.imagenUrl);
    });

    btnEliminar.addEventListener("click", async () => {
      if (confirm("¿Estás seguro de eliminar esta sala?")) {
        await eliminarSalaBD(sala.id);
        cargarSalasTabla();
      }
    });

    tabla.appendChild(fila);
  });
}


window.eliminarSala = async function (id) {
  if (confirm("¿Estás seguro de eliminar esta sala?")) {
    await eliminarSalaBD(id);
    cargarSalasTabla();
  }
};

function abrirModalEditarSala(id, nombre, descripcion, imagenUrl) {
  const modal = document.getElementById("modal-editar-sala");
  modal.style.display = "block";

  const form = document.getElementById("form-editar-sala");

  // Clonar y reemplazar el formulario para eliminar listeners anteriores
  const nuevoForm = form.cloneNode(true);
  form.parentNode.replaceChild(nuevoForm, form);

  // Obtener nuevamente los inputs desde el nuevo formulario clonado
  const inputNombre = nuevoForm.querySelector("#editar-nombre-sala");
  const inputDescripcion = nuevoForm.querySelector("#editar-descripcion-sala");
  const inputImagen = nuevoForm.querySelector("#editar-imagen-sala");

  // Cargar los valores en el nuevo formulario
  inputNombre.value = nombre;
  inputDescripcion.value = descripcion;
  inputImagen.value = imagenUrl;

  // Agregar listener de envío
  nuevoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nuevoNombre = inputNombre.value.trim();
    const nuevaDescripcion = inputDescripcion.value.trim();
    const nuevaImagen = inputImagen.value.trim();

    if (!validarFormulario(nuevoNombre, nuevaDescripcion, nuevaImagen)) return;

    await actualizarSala(id, {
      nombre: nuevoNombre,
      descripcion: nuevaDescripcion,
      imagenUrl: nuevaImagen,
    });

    modal.style.display = "none";
    nuevoForm.reset();
    cargarSalasTabla();
  });

  // Volver a conectar los botones cerrar y cancelar
  nuevoForm.querySelector("#btn-cancelar-edicion-sala").onclick = () => {
    modal.style.display = "none";
  };
  nuevoForm.querySelector("#cerrar-modal-editar-sala").onclick = () => {
    modal.style.display = "none";
  };
}















