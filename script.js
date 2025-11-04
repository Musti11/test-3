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

// Sample data for fallback (approximate rates as of Nov 2024)
const sampleData = {
    "base": "EUR",
    "date": "2024-11-04",
    "time_last_updated": Date.now(),
    "rates": {
        "USD": 1.0876,
        "GBP": 0.8421,
        "JPY": 164.32,
        "CHF": 0.9432,
        "CAD": 1.5123,
        "AUD": 1.6543,
        "CNY": 7.7821,
        "INR": 91.234,
        "XAU": 0.00045,
        "BRL": 6.1234,
        "RUB": 106.543,
        "KRW": 1487.65,
        "SEK": 11.543,
        "NOK": 11.876,
        "DKK": 7.4532,
        "TRY": 37.654,
        "MXN": 22.123,
        "ZAR": 19.876,
        "SGD": 1.4532,
        "HKD": 8.4765,
        "NZD": 1.7891,
        "PLN": 4.3214,
        "THB": 38.765,
        "MYR": 4.8765,
        "IDR": 17234.5,
        "PHP": 62.345,
        "CZK": 25.234,
        "ILS": 4.1234,
        "CLP": 1034.56,
        "ARS": 1089.34
    }
};

// Global variables
let currencyData = null;

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
        console.log('Using sample data for demonstration');
        
        // Use sample data as fallback
        currencyData = sampleData;
        updateUI(sampleData);
        updateLastUpdateTime();
        
        // Show info message instead of error
        const lastUpdate = document.getElementById('lastUpdate');
        if (lastUpdate) {
            lastUpdate.textContent = 'Using sample data for demonstration';
            lastUpdate.style.color = '#ff9800';
        }
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
    const chartContainer = document.getElementById('currencyChart');
    const rates = data.rates;
    
    // Select major currencies for the chart
    const majorCurrencies = ['USD', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'CNY', 'INR'];
    
    // Clear existing chart
    chartContainer.innerHTML = '';
    
    // Find max value for scaling
    let maxRate = 0;
    majorCurrencies.forEach(code => {
        if (rates[code] && rates[code] > maxRate) {
            maxRate = rates[code];
        }
    });
    
    // Create bars
    majorCurrencies.forEach(code => {
        if (rates[code]) {
            const barItem = document.createElement('div');
            barItem.className = 'bar-item';
            
            const bar = document.createElement('div');
            bar.className = 'bar';
            
            // Calculate height as percentage of max
            const heightPercent = (rates[code] / maxRate) * 100;
            bar.style.height = `${heightPercent}%`;
            
            const barValue = document.createElement('div');
            barValue.className = 'bar-value';
            barValue.textContent = rates[code].toFixed(2);
            
            bar.appendChild(barValue);
            
            const barLabel = document.createElement('div');
            barLabel.className = 'bar-label';
            barLabel.textContent = code;
            
            barItem.appendChild(bar);
            barItem.appendChild(barLabel);
            
            chartContainer.appendChild(barItem);
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
