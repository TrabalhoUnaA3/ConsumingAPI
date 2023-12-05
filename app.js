const https = require('https');
const readLine = require('readline');

const API_KEY = "67442a572c3ecc2b713cf7c7";

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

https.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/BRL`, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
        data += chunk;
    });

    resp.on('end', async () => {
        const currencies = Object.entries(JSON.parse(data).conversion_rates);

        console.log("Bem-vindo ao Conversor de Moedas!");
        console.log("\nMoedas disponíveis para conversão:");

        currencies.forEach((coin, index) => {
            console.log(`${index + 1}. ${coin[0]}`);
        });

        async function getUserInput(prompt) {
            return new Promise((resolve) => {
                rl.question(prompt, (answer) => {
                    resolve(answer);
                });
            });
        }

        const originIndex = await getUserInput("\nEscolha a moeda de origem (dígite o número): ");
        const originCoin = currencies[parseInt(originIndex) - 1];

        console.log(`Você escolheu: ${originCoin[0]}`);

        const destinyIndex = await getUserInput("\nEscolha a moeda de destino (dígite o número): ");
        const destinyCoin = currencies[parseInt(destinyIndex) - 1];

        console.log(`Você escolheu: ${destinyCoin[0]}`);

        const value = await getUserInput("\nDígite o valor a ser convertido: ");

        https.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${originCoin[0]}/${destinyCoin[0]}/${value}`, (resp) => {
            let result = '';

            resp.on('data', (chunk) => {
                result += chunk;
            });

            resp.on('end', () => {
                const conversionResult = JSON.parse(result).conversion_result;
                console.log(`A conversão de ${originCoin[0]} para ${destinyCoin[0]}: ${conversionResult}`);
                rl.close();
            });
        });
    });
}).on('error', (err) => {
    console.error("error", err);
});