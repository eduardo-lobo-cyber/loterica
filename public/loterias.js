async function carregarLoteria(nome, container) {
  try {
    console.log("Carregando resultado de:", nome);
    
    const resp = await fetch(
      "https://servicebus2.caixa.gov.br/portaldeloterias/api/" + nome,
      { 
        headers: { Accept: "application/json" },
        mode: 'cors',
        credentials: 'omit'
      }
    );

    if (!resp.ok) {
      throw new Error("Erro na API: " + resp.status);
    }

    const dados = await resp.json();
    console.log("Dados recebidos:", dados);

    const concurso = dados.numero;
    const data = dados.dataApuracao;
    const dezenas = dados.listaDezenas || dados.dezenasSorteadasOrdemSorteio;
    const premiacao = dados.listaRateioPremio?.[0];

    container.querySelector(".concurso").textContent =
      "Concurso " + concurso + " - " + data;

    container.querySelector(".local").textContent =
      "Local: " + (dados.localSorteio || "");

    container.querySelector(".dezenas").textContent =
      "Dezenas: " + (dezenas ? dezenas.join(" - ") : "");

    if (premiacao) {
      container.querySelector(".premiacao").textContent =
        premiacao.faixa + ": " +
        premiacao.numeroDeGanhadores + " ganhador(es), prêmio de R$ " +
        premiacao.valorPremio.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        });
    } else {
      container.querySelector(".premiacao").textContent = "";
    }
  } catch (e) {
    console.error("Erro ao carregar " + nome + ":", e);
    container.querySelector(".concurso").textContent =
      "Não foi possível carregar o resultado. Verifique o console (F12) para mais detalhes.";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("Loterias.js iniciado");
  const blocos = document.querySelectorAll("#loterias-resultados .loteria");
  console.log("Encontrados " + blocos.length + " blocos de loteria");
  blocos.forEach(function (bloco) {
    const nome = bloco.getAttribute("data-nome");
    if (nome) {
      carregarLoteria(nome, bloco);
    }
  });
});



