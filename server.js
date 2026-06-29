const express = require("express");
const cors = require("cors");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));

const CAIXA_BASE_URL =
    "https://servicebus2.caixa.gov.br/portaldeloterias/api";

const LOTERIAS = {
    lotofacil: {
        nome: "Lotofácil",
        endpoint: "lotofacil",
    },
    megasena: {
        nome: "Mega-Sena",
        endpoint: "megasena",
    },
    quina: {
        nome: "Quina",
        endpoint: "quina",
    },
    lotomania: {
        nome: "Lotomania",
        endpoint: "lotomania",
    },
    timemania: {
        nome: "Timemania",
        endpoint: "timemania",
    },
    duplasena: {
        nome: "Dupla Sena",
        endpoint: "duplasena",
    },
    diadesorte: {
        nome: "Dia de Sorte",
        endpoint: "diadesorte",
    },
    supersete: {
        nome: "Super Sete",
        endpoint: "supersete",
    },
};

async function buscarResultadoCaixa(endpoint) {
    const url = `${CAIXA_BASE_URL}/${endpoint}`;
    const resposta = await axios.get(url, {
        headers: { Accept: "application/json" },
        timeout: 15000,
    });

    return resposta.data;
}

function normalizarResposta(loteriaKey, dados) {
    return {
        loteria: LOTERIAS[loteriaKey]?.nome || loteriaKey,
        concurso: dados?.numero || dados?.numeroConcurso || null,
        data: dados?.dataApuracao || dados?.dataSorteio || null,
        dezenas:
            dados?.listaDezenas ||
            dados?.dezenasSorteadasOrdemSorteio ||
            dados?.dezenas ||
            [],
        local: dados?.localSorteio || null,
    };
}

function criarRotaProxy(loteriaKey, endpoint) {
    app.get(`/api/${loteriaKey}`, async (req, res) => {
        try {
            console.log(`Buscando dados da ${LOTERIAS[loteriaKey]?.nome || loteriaKey}...`);
            const dados = await buscarResultadoCaixa(endpoint);
            const resposta = normalizarResposta(loteriaKey, dados);
            res.json(resposta);
        } catch (error) {
            res.status(502).json({
                erro: "Falha ao buscar dados da Caixa",
                detalhe: error?.message || "Erro desconhecido",
            });
        }
    });
}

Object.entries(LOTERIAS).forEach(([key, info]) => {
    criarRotaProxy(key, info.endpoint);
});

app.get("/", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(publicDir, "resultados.html"));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
