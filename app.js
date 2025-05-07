document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("viajeForm");
  const fechaInput = document.getElementById("fecha");
  const inicioInput = document.getElementById("inicio");
  const destinoInput = document.getElementById("destino");
  const montoInput = document.getElementById("monto");
  const comentarioInput = document.getElementById("comentario");
  const lista = document.getElementById("listaViajes");
  const totalSpan = document.getElementById("totalGanado");
  const botonDescarga = document.getElementById("descargarTxt");
  const botonNuevoDia = document.getElementById("nuevoDia");

  let viajes = JSON.parse(localStorage.getItem("viajesUber")) || [];
  renderViajes();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoViaje = {
      fecha: fechaInput.value,
      inicio: inicioInput.value,
      destino: destinoInput.value,
      monto: parseFloat(montoInput.value),
      comentario: comentarioInput.value
    };

    viajes.push(nuevoViaje);
    localStorage.setItem("viajesUber", JSON.stringify(viajes));
    form.reset();
    renderViajes();
  });

  botonDescarga.addEventListener("click", () => {
    if (viajes.length === 0) {
      alert("No hay viajes para descargar.");
      return;
    }

    let contenido = "REGISTRO DE VIAJES UBER\n\n";
    let total = 0;

    viajes.forEach((v, index) => {
      contenido += `Viaje ${index + 1}:\n`;
      contenido += `Fecha: ${v.fecha}\n`;
      contenido += `De: ${v.inicio} ➡️ A: ${v.destino}\n`;
      contenido += `Monto: $${v.monto.toFixed(2)}\n`;
      if (v.comentario) {
        contenido += `Comentario: ${v.comentario}\n`;
      }
      contenido += `------------------------\n`;
      total += v.monto;
    });

    contenido += `\nTOTAL GANADO: $${total.toFixed(2)}\n`;

    const blob = new Blob([contenido], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = `viajes_${new Date().toISOString().slice(0, 10)}.txt`;
    enlace.click();
    URL.revokeObjectURL(url);
  });

  botonNuevoDia.addEventListener("click", () => {
    const confirmacion = confirm("¿Querés reiniciar el día? Se borrarán todos los viajes actuales.");
    if (confirmacion) {
      viajes = [];
      localStorage.removeItem("viajesUber");
      renderViajes();
    }
  });

  function renderViajes() {
    lista.innerHTML = "";
    let total = 0;

    viajes.forEach((v) => {
      total += v.monto;
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${v.fecha}</strong> - $${v.monto.toFixed(2)}<br/>
        <em>${v.inicio} ➡️ ${v.destino}</em>
        ${v.comentario ? `<br/><small>${v.comentario}</small>` : ""}
      `;
      lista.appendChild(li);
    });

    totalSpan.textContent = total.toFixed(2);
  }
});
