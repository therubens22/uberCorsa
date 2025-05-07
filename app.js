document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("viajeForm");
  const fechaInput = document.getElementById("fecha");
  const inicioInput = document.getElementById("inicio");
  const destinoInput = document.getElementById("destino");
  const montoInput = document.getElementById("monto");
  const comentarioInput = document.getElementById("comentario");
  const lista = document.getElementById("listaViajes");
  const totalSpan = document.getElementById("totalGanado");
  const botonDescarga = document.getElementById("descargarDia");

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

  botonDescarga.addEventListener("click", () => {
    if (viajes.length === 0) {
      alert("No hay viajes para descargar.");
      return;
    }

    // Agrupar por fecha
    const viajesPorDia = {};
    viajes.forEach(v => {
      if (!viajesPorDia[v.fecha]) viajesPorDia[v.fecha] = [];
      viajesPorDia[v.fecha].push(v);
    });

    // Tomamos la última fecha registrada
    const fechas = Object.keys(viajesPorDia);
    const diaActivo = fechas[fechas.length - 1];
    const viajesDia = viajesPorDia[diaActivo];

    let contenido = `Día de trabajo: ${diaActivo}\n\n`;
    let total = 0;

    viajesDia.forEach(v => {
      contenido += `Desde: ${v.inicio} → ${v.destino}\nMonto: $${v.monto.toFixed(2)}\n`;
      if (v.comentario) contenido += `Comentario: ${v.comentario}\n`;
      contenido += `--------------------------\n`;
      total += v.monto;
    });

    contenido += `\nTotal ganado: $${total.toFixed(2)}\n`;

    const blob = new Blob([contenido], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `viajes_${diaActivo}.txt`;
    link.click();
  });
});
