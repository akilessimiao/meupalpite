document.addEventListener("DOMContentLoaded", () => {
  // Atualiza data no rodapé
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  document.getElementById("data-atualizacao").innerHTML = `<em>Atualizado em: ${dataAtual}</em>`;

  // Busca jogos do dia (Brasileirão, Premier League, La Liga)
  const leagues = {
    4328: "Brasileirão", // Série A
    4329: "Premier League",
    4335: "La Liga"
  };

  const jogosDiv = document.getElementById("jogos");
  jogosDiv.innerHTML = "<p>Carregando jogos...</p>";

  // Limpa lista antes de adicionar novos
  let jogosHTML = "";

  // Para cada liga, busca os jogos do dia
  Object.keys(leagues).forEach(leagueId => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?id=${leagueId}&date=${new Date().toISOString().split('T')[0]}`)
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          data.events.forEach(game => {
            const time1 = game.strHomeTeam;
            const time2 = game.strAwayTeam;
            const hora = game.strTime?.slice(0, 5) || "—";
            const liga = leagues[leagueId];

            jogosHTML += `<p><strong>${time1} vs ${time2}</strong> | ${hora} | ${liga}</p>`;
            jogosDiv.innerHTML = jogosHTML; // Atualiza em tempo real
          });
        }
      })
      .catch(err => {
        console.log("Erro ao carregar", err);
      });
  });

  // Se não carregar nada
  setTimeout(() => {
    if (jogosDiv.innerHTML === "<p>Carregando jogos...</p>" || !jogosHTML) {
      jogosDiv.innerHTML = "<p>Nenhum jogo encontrado hoje. Volte amanhã!</p>";
    }
  }, 3000);
});
