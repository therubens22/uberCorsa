document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("viajeForm");
    const fechaInput = document.getElementById("fecha");
    const inicioInput = document.getElementById("inicio");
    const destinoInput = document.getElementById("destino");
    const montoInput = document.getElementById("monto");
    const comentarioInput = document.getElementById("comentario");
    const lista = document.getElementById("listaViajes");
    const totalSpan = document.getElementById("totalGanado");
  
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
  });
  