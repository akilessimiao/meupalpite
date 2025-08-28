document.addEventListener("DOMContentLoaded", () => {
  const jogosDiv = document.getElementById("jogos");
  jogosDiv.innerHTML = "<p>🔍 Buscando jogos de hoje...</p>";

  // Atualiza data no rodapé
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
  document.getElementById("data-atualizacao").innerHTML = `<em>Atualizado em: ${dataAtual}</em>`;

  // Mapeamento de ligas
  const leagues = {
    4328: "Brasileirão",      // Brasileirão Série A
    4329: "Premier League",   // Inglaterra
    4335: "La Liga",          // Espanha
    4331: "Bundesliga",       // Alemanha
    4334: "Serie A"           // Itália
  };

  let jogosHTML = "";  // Armazena todos os jogos
  let requestsCompleted = 0;

  // Função para formatar hora (ex: 20:00)
  const formatTime = (time) => {
    if (!time) return "—";
    return time.slice(0, 5);
  };

  // Para cada liga, busca os jogos do dia
  Object.keys(leagues).forEach(leagueId => {
    fetch(`https://www.thesportsdb.com/api/v1/json/3/eventsday.php?id=${leagueId}&date=${new Date().toISOString().split('T')[0]}`)
      .then(res => res.json())
      .then(data => {
        if (data.events) {
          data.events.forEach(game => {
            const time1 = game.strHomeTeam;
            const time2 = game.strAwayTeam;
            const hora = formatTime(game.strTime);
            const liga = leagues[leagueId];

            jogosHTML += `<p><strong>${time1} vs ${time2}</strong> | ${hora} | ${liga}</p>`;
          });
        }
      })
      .catch(err => {
        console.error(`Erro na liga ${leagueId}:`, err);
      })
      .finally(() => {
        requestsCompleted++;
        if (requestsCompleted === Object.keys(leagues).length) {
          // Todas as requisições terminaram
          if (jogosHTML === "") {
            jogosDiv.innerHTML = "<p>📅 Nenhum jogo programado para hoje. Volte amanhã!</p>";
          } else {
            jogosDiv.innerHTML = jogosHTML;
          }
        }
      });
  });

  // Fallback: se nada carregar em 5 segundos
  setTimeout(() => {
    if (jogosDiv.innerHTML.includes("Buscando") || jogosDiv.innerHTML === "") {
      jogosDiv.innerHTML = "<p>⚠️ Falha ao carregar jogos. Verifique a conexão ou tente mais tarde.</p>";
    }
  }, 5000);
});
