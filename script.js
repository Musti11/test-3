// API configuration
const API_BASE_URL = 'https://api.exchangerate-api.com/v4/latest/EUR';

// Currency names mapping
const currencyNames = {
    'USD': 'US Dollar',
    'GBP': 'British Pound',
    'JPY': 'Japanese Yen',
    'CHF': 'Swiss Franc',
    'CAD': 'Canadian Dollar',
    'AUD': 'Australian Dollar',
    'CNY': 'Chinese Yuan',
    'INR': 'Indian Rupee',
    'XAU': 'Gold (Troy Ounce)',
    'BRL': 'Brazilian Real',
    'RUB': 'Russian Ruble',
    'KRW': 'South Korean Won',
    'SEK': 'Swedish Krona',
    'NOK': 'Norwegian Krone',
    'DKK': 'Danish Krone',
    'TRY': 'Turkish Lira',
    'MXN': 'Mexican Peso',
    'ZAR': 'South African Rand',
    'SGD': 'Singapore Dollar',
    'HKD': 'Hong Kong Dollar'
};

// Global variables
let currencyData = null;
let chart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    fetchCurrencyData();
    // Auto-refresh every 5 minutes
    setInterval(fetchCurrencyData, 300000);
});

// Fetch currency data from API
async function fetchCurrencyData() {
    try {
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error('Failed to fetch currency data');
        }
        
        const data = await response.json();
        currencyData = data;
        
        updateUI(data);
        updateLastUpdateTime();
    } catch (error) {
        console.error('Error fetching currency data:', error);
        showError('Unable to fetch currency data. Please try again later.');
    }
}

// Update all UI elements with new data
function updateUI(data) {
    updateCurrencyCards(data);
    updateCurrencyTable(data);
    updateChart(data);
}

// Update the featured currency cards
function updateCurrencyCards(data) {
    const rates = data.rates;
    
    // EUR/USD
    if (rates.USD) {
        document.getElementById('eur-usd-rate').textContent = rates.USD.toFixed(4);
        document.getElementById('eur-usd-time').textContent = `1 EUR = ${rates.USD.toFixed(4)} USD`;
    }
    
    // EUR/Gold (XAU) - Note: XAU represents gold price per troy ounce
    // For gram calculation: 1 troy ounce = 31.1035 grams
    if (rates.XAU) {
        const goldPerGram = rates.XAU / 31.1035;
        document.getElementById('eur-gold-rate').textContent = goldPerGram.toFixed(6);
        document.getElementById('eur-gold-time').textContent = `1 EUR = ${goldPerGram.toFixed(6)} XAU/gram`;
    } else {
        // If XAU is not available, show a placeholder
        document.getElementById('eur-gold-rate').textContent = 'N/A';
        document.getElementById('eur-gold-time').textContent = 'Gold rate not available';
    }
}

// Update the currency table
function updateCurrencyTable(data) {
    const tbody = document.getElementById('currencyTableBody');
    const rates = data.rates;
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get all currencies and sort them
    const currencies = Object.keys(rates).sort();
    
    // Create table rows
    currencies.forEach(code => {
        const row = document.createElement('tr');
        
        // Currency name
        const nameCell = document.createElement('td');
        nameCell.textContent = currencyNames[code] || code;
        
        // Currency code
        const codeCell = document.createElement('td');
        codeCell.textContent = code;
        
        // Exchange rate
        const rateCell = document.createElement('td');
        rateCell.textContent = rates[code].toFixed(4);
        
        row.appendChild(nameCell);
        row.appendChild(codeCell);
        row.appendChild(rateCell);
        
        tbody.appendChild(row);
    });
}

// Update or create the chart
function updateChart(data) {
    const ctx = document.getElementById('currencyChart').getContext('2d');
    const rates = data.rates;
    
    // Select major currencies for the chart
    const majorCurrencies = ['USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR'];
    const labels = [];
    const values = [];
    
    majorCurrencies.forEach(code => {
        if (rates[code]) {
            labels.push(code);
            values.push(rates[code]);
        }
    });
    
    // Destroy existing chart if it exists
    if (chart) {
        chart.destroy();
    }
    
    // Create new chart
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Exchange Rate (per 1 EUR)',
                data: values,
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(118, 75, 162, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(118, 75, 162, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `1 EUR = ${context.parsed.y.toFixed(4)} ${context.label}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Update the last update timestamp
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString();
    const dateString = now.toLocaleDateString();
    document.getElementById('lastUpdate').textContent = `Last updated: ${dateString} ${timeString}`;
}

// Refresh data manually
function refreshData() {
    const button = document.getElementById('refreshBtn');
    button.textContent = 'Refreshing...';
    button.disabled = true;
    
    fetchCurrencyData().then(() => {
        button.textContent = 'Refresh Data';
        button.disabled = false;
    });
}

// Show error message
function showError(message) {
    const tbody = document.getElementById('currencyTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="3" style="text-align: center; color: #dc3545; padding: 20px;">
                ${message}
            </td>
        </tr>
    `;
}
