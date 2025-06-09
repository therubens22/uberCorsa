document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("viajeForm");
  const fechaInput = document.getElementById("fecha");
  const inicioInput = document.getElementById("inicio");
  const destinoInput = document.getElementById("destino");
  const montoInput = document.getElementById("monto");
  const comentarioInput = document.getElementById("comentario");
  const metodoPagoInput = document.getElementById("metodoPago");
  const lista = document.getElementById("listaViajes");
  const totalSpan = document.getElementById("totalGanado");
  const totalEfectivo = document.getElementById("totalEfectivo");
  const totalTarjeta = document.getElementById("totalTarjeta");
  const btnReiniciar = document.getElementById("reiniciarDia");
  const btnDescargar = document.getElementById("descargarTXT");

  let viajes = JSON.parse(localStorage.getItem("viajesUber")) || [];
  renderViajes();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoViaje = {
      fecha: fechaInput.value,
      inicio: inicioInput.value,
      destino: destinoInput.value,
      monto: parseFloat(montoInput.value),
      comentario: comentarioInput.value,
      metodo: metodoPagoInput.value
    };

    viajes.push(nuevoViaje);
    localStorage.setItem("viajesUber", JSON.stringify(viajes));

    form.reset();
    renderViajes();
  });

  btnReiniciar.addEventListener("click", () => {
    if (confirm("¿Estás seguro de reiniciar el día y borrar todos los viajes?")) {
      viajes = [];
      localStorage.removeItem("viajesUber");
      renderViajes();
    }
  });

  btnDescargar.addEventListener("click", () => {
    if (viajes.length === 0) {
      alert("No hay viajes cargados para descargar.");
      return;
    }

    let contenido = "Mis Viajes Uber\n\n";
    let total = 0;
    let efectivo = 0;
    let tarjeta = 0;

    viajes.forEach((v) => {
      contenido += `${v.fecha} - $${v.monto.toFixed(2)} - ${v.inicio} ➡️ ${v.destino} - Pago: ${v.metodo}`;
      if (v.comentario) contenido += ` - ${v.comentario}`;
      contenido += `\n`;

      total += v.monto;
      if (v.metodo === "efectivo") efectivo += v.monto;
      if (v.metodo === "tarjeta") tarjeta += v.monto;
    });

    contenido += `\nTotal efectivo: $${efectivo.toFixed(2)}\n`;
    contenido += `Total tarjeta: $${tarjeta.toFixed(2)}\n`;
    contenido += `Total ganado: $${total.toFixed(2)}\n`;

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const enlace = document.createElement("a");
    enlace.href = URL.createObjectURL(blob);
    enlace.download = "viajes_uber.txt";
    enlace.click();
  });

  function renderViajes() {
    lista.innerHTML = "";
    let total = 0;
    let efectivo = 0;
    let tarjeta = 0;

    viajes.forEach((v) => {
      total += v.monto;

      if (v.metodo === "efectivo") {
        efectivo += v.monto;
      } else if (v.metodo === "tarjeta") {
        tarjeta += v.monto;
      }

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${v.fecha}</strong> - $${v.monto.toFixed(2)}<br/>
        <em>${v.inicio} ➡️ ${v.destino}</em><br/>
        <small>Pago: ${v.metodo}</small>
        ${v.comentario ? `<br/><small>${v.comentario}</small>` : ""}
      `;
      lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);
    totalEfectivo.textContent = efectivo.toFixed(2);
    totalTarjeta.textContent = tarjeta.toFixed(2);
  }
});
