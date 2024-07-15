let chart; 
async function getExchangeRates() {
    try {
        const response = await fetch('https://mindicador.cl/api');
        if (!response.ok) {
            throw new Error('Error al obtener los datos de la API');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        document.getElementById('result').innerText = `Error: ${error.message}`;
        return null;
    }
}

async function getHistoricalData(currency) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${currency}`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos históricos');
        }
        const data = await response.json();
        return data.serie.slice(0, 10).reverse(); 
    } catch (error) {
        document.getElementById('result').innerText = `Error: ${error.message}`;
        return null;
    }
}

async function displayChart(currency) {
    const historicalData = await getHistoricalData(currency);
    if (!historicalData) return;

    const labels = historicalData.map(item => item.fecha.split('T')[0]);
    const values = historicalData.map(item => item.valor);

    const ctx = document.getElementById('chart').getContext('2d');

    // Destruir el gráfico anterior
    if (chart) {
        chart.destroy();
    }

    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `Historial últimos 10 días (${currency})`,
                data: values,
                borderColor: 'white',
                borderWidth: 2,
                pointBackgroundColor: 'white',
                pointBorderColor: 'white'
            }]
        },
        options: {
            scales: {
                x: {
                    ticks: {
                        color: 'white' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)' 
                    }
                },
                y: {
                    ticks: {
                        color: 'white' 
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.2)'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: 'white'
                    }
                }
            }
        }
    });
}

async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const currency = document.getElementById('currency').value;

    const data = await getExchangeRates();
    if (!data) return;

    let rate;
    switch (currency) {
        case 'dolar':
            rate = data.dolar.valor;
            break;
        case 'euro':
            rate = data.euro.valor;
            break;
        default:
            rate = 0;
    }

    const convertedAmount = amount / rate;
    document.getElementById('result').innerText = `${amount} pesos chilenos son ${convertedAmount.toFixed(2)} ${currency}`;

    displayChart(currency);
}

document.querySelector('button').addEventListener('click', convertCurrency);
