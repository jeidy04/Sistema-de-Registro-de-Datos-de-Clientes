/* SCRIPT - Página de Registros*/

const CLAVE_ALMACENAMIENTO = "clientesRegistrados";

function obtenerClientes() {
  const datos = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  return datos ? JSON.parse(datos) : [];
}

function guardarClientes(lista) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(lista));
}

function escaparHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function renderizarTabla() {
  const clientes = obtenerClientes();
  const cuerpoTabla = document.getElementById("cuerpoTabla");
  const sinDatos = document.getElementById("sinDatos");
  const contadorRegistros = document.getElementById("contadorRegistros");

  cuerpoTabla.innerHTML = "";
  contadorRegistros.textContent =
    clientes.length === 1 ? "1 cliente" : clientes.length + " clientes";

  if (clientes.length === 0) {
    sinDatos.style.display = "block";
    return;
  }
  sinDatos.style.display = "none";

  clientes.forEach((cliente, indice) => {
    const fila = document.createElement("tr");
    fila.innerHTML =
      "<td>" + (indice + 1) + "</td>" +
      "<td>" + escaparHtml(cliente.cedula) + "</td>" +
      "<td>" + escaparHtml(cliente.nombre) + "</td>" +
      "<td>" + escaparHtml(cliente.direccion) + "</td>" +
      "<td>" + escaparHtml(cliente.telefono) + "</td>" +
      "<td>" + escaparHtml(cliente.correo) + "</td>" +
      "<td>" + escaparHtml(cliente.fechaRegistro || "-") + "</td>" +
      "<td><button class=\"btn-eliminar\" data-indice=\"" + indice + "\">Eliminar</button></td>";
    cuerpoTabla.appendChild(fila);
  });

  document.querySelectorAll(".btn-eliminar").forEach((boton) => {
    boton.addEventListener("click", function () {
      const indice = parseInt(this.getAttribute("data-indice"), 10);
      const clientesActuales = obtenerClientes();
      const eliminado = clientesActuales.splice(indice, 1)[0];
      guardarClientes(clientesActuales);
      renderizarTabla();
      if (eliminado) {
        console.log("Registro eliminado: cédula " + eliminado.cedula);
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarTabla();

  document.getElementById("btnVaciar").addEventListener("click", function () {
    if (confirm("¿Está seguro de eliminar TODOS los registros? Esta acción no se puede deshacer.")) {
      guardarClientes([]);
      renderizarTabla();
    }
  });
});
