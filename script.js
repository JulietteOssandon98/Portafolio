// Modo oscuro
const modoBtn = document.getElementById("modoBtn");
modoBtn.addEventListener("click", () => {
  document.body.classList.toggle("modo-oscuro");
  const esOscuro = document.body.classList.contains("modo-oscuro");
  localStorage.setItem("modoOscuro", esOscuro);
});

// Guardar datos del formulario
const formulario = document.getElementById("formulario");
const nombreInput = document.getElementById("nombre");
const emailInput = document.getElementById("email");
const mensajeInput = document.getElementById("mensaje");
const errores = document.getElementById("errores");
const exito = document.getElementById("exito");

window.addEventListener("DOMContentLoaded", () => {
  const datosGuardados = JSON.parse(localStorage.getItem("datosFormulario")) || {};
  nombreInput.value = datosGuardados.nombre || "";
  emailInput.value = datosGuardados.email || "";
  mensajeInput.value = datosGuardados.mensaje || "";

  if (localStorage.getItem("modoOscuro") === "true") {
    document.body.classList.add("modo-oscuro");
  }
});

[nombreInput, emailInput, mensajeInput].forEach(input => {
  input.addEventListener("input", () => {
    const datos = {
      nombre: nombreInput.value,
      email: emailInput.value,
      mensaje: mensajeInput.value
    };
    localStorage.setItem("datosFormulario", JSON.stringify(datos));
  });
});

formulario.addEventListener("submit", function(e) {
  e.preventDefault();
  errores.textContent = "";
  exito.textContent = "";

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const mensaje = mensajeInput.value.trim();
  const regexEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  if (nombre === "") {
    errores.textContent = "El nombre es obligatorio.";
    return;
  }
  if (email === "") {
    errores.textContent = "El correo electrónico es obligatorio.";
    return;
  }
  if (!regexEmail.test(email)) {
    errores.textContent = "El correo no es válido.";
    return;
  }
  if (mensaje.length < 10) {
    errores.textContent = "El mensaje debe tener al menos 10 caracteres.";
    return;
  }

  exito.textContent = "✅ ¡Formulario enviado correctamente!";
  formulario.reset();
  localStorage.removeItem("datosFormulario");
});

// Animaciones scroll
const animElements = document.querySelectorAll(".scroll-anim");
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.2
});
animElements.forEach(el => observer.observe(el));

// Carrusel manual
const track = document.querySelector(".portafolio-track");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
let index = 0;
const totalSlides = document.querySelectorAll(".portafolio-item").length;
const itemsPerSlide = window.innerWidth < 768 ? 1 : 2;

function updateCarousel() {
  const slideWidth = track.clientWidth / itemsPerSlide;
  track.style.transform = `translateX(-${index * slideWidth}px)`;
}

nextBtn.addEventListener("click", () => {
  if (index < totalSlides - itemsPerSlide) {
    index++;
    updateCarousel();
  }
});

prevBtn.addEventListener("click", () => {
  if (index > 0) {
    index--;
    updateCarousel();
  }
});

window.addEventListener("resize", updateCarousel);
