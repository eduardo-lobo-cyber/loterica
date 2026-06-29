function formatarMoeda(valor) {
    if (typeof valor !== "number") {
        return "";
    }
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
    });
}

function definirTexto(id, texto) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = texto;
    }
}

function criarBolaNumero(numero) {
    const bola = document.createElement("div");
    bola.className = "number-ball";
    bola.textContent = numero;
    return bola;
}

function criarPremio(label, valor) {
    const box = document.createElement("div");
    box.className = "prize";

    const labelEl = document.createElement("span");
    labelEl.className = "prize-label";
    labelEl.textContent = label;

    const valorEl = document.createElement("span");
    valorEl.className = "prize-value";
    valorEl.textContent = valor;

    box.appendChild(labelEl);
    box.appendChild(valorEl);
    return box;
}

async function carregarResultadoLotofacil() {
    const status = document.getElementById("lotofacil-status");
    const card = document.getElementById("lotofacil-card");
    const numerosContainer = document.getElementById("lotofacil-numbers");
    const premiosContainer = document.getElementById("lotofacil-prizes");

    try {
        const resposta = await fetch(
            "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil",
            {
                headers: { Accept: "application/json" },
                mode: "cors",
                credentials: "omit",
            }
        );

        if (!resposta.ok) {
            throw new Error("Erro na API: " + resposta.status);
        }

        const dados = await resposta.json();

        definirTexto("lotofacil-concurso", "Concurso " + dados.numero);
        definirTexto("lotofacil-data", "Data: " + (dados.dataApuracao || "--"));
        definirTexto(
            "lotofacil-local",
            "Local: " + (dados.localSorteio || "Não informado")
        );

        const estimado = formatarMoeda(dados.valorEstimadoProximoConcurso);
        definirTexto(
            "lotofacil-proximo",
            estimado ? "Próximo prêmio estimado: " + estimado : ""
        );

        numerosContainer.innerHTML = "";
        const dezenas =
            dados.listaDezenas ||
            dados.dezenasSorteadasOrdemSorteio ||
            [];
        dezenas.forEach((numero) => {
            numerosContainer.appendChild(criarBolaNumero(numero));
        });

        premiosContainer.innerHTML = "";
        if (Array.isArray(dados.listaRateioPremio)) {
            dados.listaRateioPremio.forEach((premio) => {
                const texto = formatarMoeda(premio.valorPremio);
                const label = premio.faixa || "Faixa";
                const ganhadores = premio.numeroDeGanhadores;
                const legenda =
                    typeof ganhadores === "number"
                        ? label + " (" + ganhadores + " ganhador(es))"
                        : label;

                premiosContainer.appendChild(criarPremio(legenda, texto));
            });
        }

        if (status) {
            status.hidden = true;
        }
        if (card) {
            card.hidden = false;
        }
    } catch (erro) {
        console.error("Erro ao carregar Lotofácil:", erro);
        if (status) {
            status.className = "error-results";
            status.innerHTML =
                '<i class="fas fa-triangle-exclamation"></i>' +
                "<p>Não foi possível carregar o resultado agora. Tente novamente mais tarde.</p>";
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    carregarResultadoLotofacil();
});
