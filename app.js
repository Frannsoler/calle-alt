document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".agregar-carrito-btn");
  const listaCarrito = document.getElementById("carrito-lista");
  const mensajeVacio = document.getElementById("carrito-vacio");
  const totalElement = document.getElementById("total");
  const finalizarBtn = document.getElementById("finalizar-compra");
  const formularioPago = document.getElementById("formulario-pago");
  const resumenTextarea = document.getElementById("resumenPedido");

  let carrito = [];

  function actualizarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
      mensajeVacio.style.display = "block";
      totalElement.textContent = "Total: $0";
    } else {
      mensajeVacio.style.display = "none";
      let total = 0;

      carrito.forEach((item, index) => {
        total += parseFloat(item.precio);

        const li = document.createElement("li");
        li.innerHTML = `
          ${item.nombre} - Talle ${item.talle} - $${item.precio} 
          <button class="eliminar-btn" data-index="${index}">Eliminar</button>
        `;
        listaCarrito.appendChild(li);
      });

      totalElement.textContent = `Total: $${total}`;
    }

    guardarCarritoEnLocalStorage();
  }

  function guardarCarritoEnLocalStorage() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function actualizarResumenPedido() {
    if (!resumenTextarea) return;

    if (carrito.length === 0) {
      resumenTextarea.value = "Carrito vacío.";
      return;
    }

    const resumen = carrito.map(item => {
      return `${item.nombre} - - $${item.precio}`;
    }).join('\n');

    resumenTextarea.value = resumen;
  }

  botonesAgregar.forEach((btn) => {
    btn.addEventListener("click", () => {
      const producto = btn.getAttribute("data-nombre");
      const precio = btn.getAttribute("data-precio");

      const selectTalle = btn.previousElementSibling;
      const talleSeleccionado = selectTalle.value;


      carrito.push({
        nombre: producto,
        precio: precio,
        talle: talleSeleccionado,
      });

      actualizarCarrito();
    });
  });

  listaCarrito.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar-btn")) {
      const index = e.target.getAttribute("data-index");
      carrito.splice(index, 1);
      actualizarCarrito();
    }
  });

  if (finalizarBtn && formularioPago) {
    finalizarBtn.addEventListener("click", () => {
      formularioPago.style.display = "block";
      formularioPago.scrollIntoView({ behavior: "smooth" });
      actualizarResumenPedido();
    });
  }

  // ✨ Animación de aparición de los selectores de talle
  document.querySelectorAll(".select-talle").forEach((select, index) => {
    setTimeout(() => {
      select.classList.add("visible");
    }, 200 * index); // Efecto uno por uno
  });

  actualizarCarrito();
});

// Mostrar mensaje de éxito después de enviar el formulario
const formularioCompra = document.getElementById("formulario-compra");

if (formularioCompra) {
  formularioCompra.addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(formularioCompra);

    fetch(formularioCompra.action, {
      method: formularioCompra.method,
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        formularioCompra.innerHTML = `
          <h3>¡Gracias por tu compra! 🙌</h3>
          <p>Te contactaremos a la brevedad para coordinar la entrega.</p>
        `;
        localStorage.removeItem("carrito");
      } else {
        formularioCompra.innerHTML = `
          <h3>Hubo un error 😥</h3>
          <p>Por favor, intenta de nuevo más tarde.</p>
        `;
      }
    }).catch(error => {
      formularioCompra.innerHTML = `
        <h3>Hubo un error 😥</h3>
        <p>Por favor, intenta de nuevo más tarde.</p>
      `;
    });
  });
}
