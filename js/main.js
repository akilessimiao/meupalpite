// Atualiza a data no rodapé
document.addEventListener("DOMContentLoaded", () => {
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  document.getElementById("data-atualizacao").innerHTML = `<em>Atualizado em: ${dataAtual}</em>`;
});
