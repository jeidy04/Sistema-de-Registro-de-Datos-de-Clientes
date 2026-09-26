/* VALIDACIONES - Registro de Clientes */

// Claves de almacenamiento compartidas entre archivos..
const CLAVE_ALMACENAMIENTO = "clientesRegistrados";

// ---------- Utilidades de almacenamiento ----------

function obtenerClientes() {
  const datos = localStorage.getItem(CLAVE_ALMACENAMIENTO);
  return datos ? JSON.parse(datos) : [];
}

function guardarClientes(lista) {
  localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(lista));
}

function existeCedula(cedula) {
  const clientes = obtenerClientes();
  return clientes.some((c) => c.cedula === cedula);
}

// ---------- Validación de cédula ecuatoriana (algoritmo módulo 10) ----------

function validarCedulaEcuatoriana(cedula) {
  if (!/^\d{10}$/.test(cedula)) return false;

  const digitos = cedula.split("").map(Number);
  const provincia = parseInt(cedula.substring(0, 2), 10);
  const tercerDigito = digitos[2];

  // Provincia válida: 01-24 (o 30 para extranjeros/casos especiales)
  if (!((provincia >= 1 && provincia <= 24) || provincia === 30)) {
    return false;
  }

  // El tercer dígito debe ser menor a 6 para cédula de persona natural
  if (tercerDigito >= 6) return false;

  const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
  let suma = 0;

  for (let i = 0; i < 9; i++) {
    let valor = digitos[i] * coeficientes[i];
    if (valor >= 10) valor -= 9;
    suma += valor;
  }

  const digitoVerificador = (10 - (suma % 10)) % 10;
  return digitoVerificador === digitos[9];
}

// ---------- Funciones de validación por campo ----------

function validarCedula(valor) {
  if (valor.trim() === "") return "La cédula es obligatoria.";
  if (!/^\d+$/.test(valor)) return "La cédula solo debe contener números.";
  if (valor.length !== 10) return "La cédula debe tener exactamente 10 dígitos.";
  if (!validarCedulaEcuatoriana(valor)) return "La cédula ingresada no es válida.";
  if (existeCedula(valor)) return "Esta cédula ya se encuentra registrada.";
  return "";
}

function validarNombre(valor) {
  const limpio = valor.trim();
  if (limpio === "") return "El nombre es obligatorio.";
  if (limpio.length > 30) return "El nombre no puede superar 30 caracteres.";
  if (limpio.length < 3) return "El nombre debe tener al menos 3 caracteres.";
  const patron = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;
  if (!patron.test(limpio)) return "El nombre solo puede contener letras y espacios.";
  return "";
}

function validarDireccion(valor) {
  const limpio = valor.trim();
  if (limpio === "") return "La dirección es obligatoria.";
  if (limpio.length > 50) return "La dirección no puede superar 50 caracteres.";
  if (limpio.length < 5) return "La dirección debe tener al menos 5 caracteres.";
  return "";
}

function validarTelefono(valor) {
  if (valor.trim() === "") return "El teléfono celular es obligatorio.";
  if (!/^\d+$/.test(valor)) return "El teléfono solo debe contener números.";
  if (valor.length !== 10) return "El teléfono debe tener exactamente 10 dígitos.";
  if (!/^09\d{8}$/.test(valor)) return "El celular debe iniciar con 09 (Ej: 0991234567).";
  return "";
}

function validarCorreo(valor) {
  const limpio = valor.trim();
  if (limpio === "") return "El correo electrónico es obligatorio.";
  if (limpio.length > 60) return "El correo no puede superar 60 caracteres.";
  const patron = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!patron.test(limpio)) return "Ingrese un correo electrónico válido.";
  return "";
}

// ---------- Lógica de la interfaz ----------

document.addEventListener("DOMContentLoaded", function () {
  const formulario = document.getElementById("formCliente");

  const campos = {
    cedula: {
      input: document.getElementById("cedula"),
      error: document.getElementById("errorCedula"),
      validar: validarCedula,
      contador: document.getElementById("contCedula"),
      max: 10,
      soloNumeros: true,
    },
    nombre: {
      input: document.getElementById("nombre"),
      error: document.getElementById("errorNombre"),
      validar: validarNombre,
      contador: document.getElementById("contNombre"),
      max: 30,
      soloNumeros: false,
    },
    direccion: {
      input: document.getElementById("direccion"),
      error: document.getElementById("errorDireccion"),
      validar: validarDireccion,
      contador: document.getElementById("contDireccion"),
      max: 50,
      soloNumeros: false,
    },
    telefono: {
      input: document.getElementById("telefono"),
      error: document.getElementById("errorTelefono"),
      validar: validarTelefono,
      contador: document.getElementById("contTelefono"),
      max: 10,
      soloNumeros: true,
    },
    correo: {
      input: document.getElementById("correo"),
      error: document.getElementById("errorCorreo"),
      validar: validarCorreo,
      contador: null,
      max: 60,
      soloNumeros: false,
    },
  };

  const mensajeGeneral = document.getElementById("mensajeGeneral");

  function actualizarContador(campo) {
    if (campo.contador) {
      campo.contador.textContent = campo.input.value.length;
    }
  }

  function marcarEstado(campo, mensajeError) {
    if (mensajeError) {
      campo.input.classList.add("invalido");
      campo.input.classList.remove("valido");
      campo.error.textContent = mensajeError;
    } else {
      campo.input.classList.add("valido");
      campo.input.classList.remove("invalido");
      campo.error.textContent = "";
    }
  }

  // Validación en tiempo real + filtrado de caracteres no numéricos
  Object.keys(campos).forEach((clave) => {
    const campo = campos[clave];

    campo.input.addEventListener("input", function () {
      if (campo.soloNumeros) {
        campo.input.value = campo.input.value.replace(/\D/g, "").slice(0, campo.max);
      }
      actualizarContador(campo);
      const mensajeError = campo.validar(campo.input.value);
      marcarEstado(campo, mensajeError);
      if (mensajeGeneral.textContent) {
        mensajeGeneral.textContent = "";
        mensajeGeneral.className = "mensaje-general";
      }
    });

    campo.input.addEventListener("blur", function () {
      const mensajeError = campo.validar(campo.input.value);
      marcarEstado(campo, mensajeError);
    });
  });

  // Envío del formulario
  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    let formularioValido = true;
    Object.keys(campos).forEach((clave) => {
      const campo = campos[clave];
      const mensajeError = campo.validar(campo.input.value);
      marcarEstado(campo, mensajeError);
      if (mensajeError) formularioValido = false;
    });

    if (!formularioValido) {
      mensajeGeneral.textContent = "Por favor corrija los errores señalados antes de continuar.";
      mensajeGeneral.className = "mensaje-general fallo";
      return;
    }

    // Doble verificación de duplicado justo antes de guardar (evita condiciones de carrera)
    const cedulaValor = campos.cedula.input.value.trim();
    if (existeCedula(cedulaValor)) {
      marcarEstado(campos.cedula, "Esta cédula ya se encuentra registrada.");
      mensajeGeneral.textContent = "No se guardó: la cédula ya existe en los registros.";
      mensajeGeneral.className = "mensaje-general fallo";
      return;
    }

    const nuevoCliente = {
      cedula: cedulaValor,
      nombre: campos.nombre.input.value.trim(),
      direccion: campos.direccion.input.value.trim(),
      telefono: campos.telefono.input.value.trim(),
      correo: campos.correo.input.value.trim(),
      fechaRegistro: new Date().toLocaleString("es-EC"),
    };

    const clientes = obtenerClientes();
    clientes.push(nuevoCliente);
    guardarClientes(clientes);

    mensajeGeneral.textContent =
      "Cliente guardado correctamente..";
    mensajeGeneral.className = "mensaje-general exito";

    formulario.reset();
    Object.keys(campos).forEach((clave) => {
      const campo = campos[clave];
      campo.input.classList.remove("valido", "invalido");
      actualizarContador(campo);
    });
  });

  document.getElementById("btnLimpiar").addEventListener("click", function () {
    Object.keys(campos).forEach((clave) => {
      const campo = campos[clave];
      campo.input.classList.remove("valido", "invalido");
      campo.error.textContent = "";
      actualizarContador(campo);
    });
    mensajeGeneral.textContent = "";
    mensajeGeneral.className = "mensaje-general";
  });
});
