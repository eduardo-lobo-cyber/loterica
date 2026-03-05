// Teste da API de Loterias
// Execute com: node test-api.js

// Node.js 18+ já tem fetch nativo
globalThis.fetch = globalThis.fetch || require('node-fetch');

async function testAllLotteries() {
    console.log('=== Testando API de Loterias ===\n');
    
    const lotteries = [
        { name: 'Mega-Sena', endpoint: 'megasena' },
        { name: 'Quina', endpoint: 'quina' },
        { name: 'Lotofácil', endpoint: 'lotofacil' },
        { name: 'Dupla Sena', endpoint: 'duplasena' },
        { name: 'Federal', endpoint: 'federal' },
        { name: 'Timemania', endpoint: 'timemania' },
        { name: 'Lotomania', endpoint: 'lotomania' },
        { name: 'Dia de Sorte', endpoint: 'diadesorte' },
        { name: 'Super Sete', endpoint: 'supersete' }
    ];

    for (const loteria of lotteries) {
        try {
            const res = await fetch(`https://api.guidi.dev.br/loteria/${loteria.endpoint}/ultimo`);
            const data = await res.json();
            console.log(`${loteria.name}:`);
            console.log(`  Dezenas: ${data.dezenas ? data.dezenas.join(', ') : 'N/A'}`);
            console.log(`  Concurso: ${data.concurso || 'N/A'}`);
            console.log(`  Data: ${data.data || 'N/A'}`);
            console.log('');
        } catch (error) {
            console.error(`Erro ao buscar ${loteria.name}:`, error.message);
        }
    }
}

// Teste específico para Mega-Sena
async function ultimaMega() {
    console.log('=== Teste Mega-Sena ===\n');
    const res = await fetch('https://api.guidi.dev.br/loteria/megasena/ultimo');
    const data = await res.json();
    console.log('Dezenas:', data.dezenas);
    console.log('Concurso:', data.concurso);
    console.log('Data:', data.data);
    console.log('Premio:', data.valor);
    console.log('');
    return data;
}

// Executar testes
testAllLotteries();

