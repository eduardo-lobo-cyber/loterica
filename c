<?php
/**
 * Proxy API para Loterias da CAIXA
 * 
 * Este arquivo resolve o problema de CORS ao consumir a API da CAIXA
 * diretamente do navegador.
 * 
 * Uso: api-proxy.php?loteria=megasena
 * 
 * Loteria disponíveis:
 * - megasena
 * - lotofacil
 * - quina
 * - duplasena
 * - federal
 * - timemania
 * - lotomania
 * - diadesorte
 * - supersete
 */

// Headers para permitir CORS e JSON
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Content-Type: application/json; charset=utf-8');

// Tratar requisição OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verificar se o parâmetro loteria foi enviado
if (!isset($_GET['loteria'])) {
    echo json_encode(['erro' => 'Parâmetro "loteria" é obrigatório']);
    exit;
}

$loteria = $_GET['loteria'];

// Validar loteria
$loteriasPermitidas = ['megasena', 'lotofacil', 'quina', 'duplasena', 'federal', 'timemania', 'lotomania', 'diadesorte', 'supersete'];

if (!in_array($loteria, $loteriasPermitidas)) {
    echo json_encode(['erro' => 'Loteria inválida. Opções: ' . implode(', ', $loteriasPermitidas)]);
    exit;
}

// URL da API da CAIXA
$apiUrl = "https://servicebus2.caixa.gov.br/portaldeloterias/api/{$loteria}";

// Fazer requisição usando cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

// Verificar se houve erro
if ($error) {
    echo json_encode(['erro' => 'Erro ao conectar com a API: ' . $error]);
    exit;
}

// Verificar código HTTP
if ($httpCode !== 200) {
    echo json_encode(['erro' => 'Erro HTTP: ' . $httpCode]);
    exit;
}

// Retornar resposta
echo $response;
