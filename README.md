# Currency Exchange Tracker

A simple, clean website to track currency exchange rates with interactive charts and tables.

## Features

- **Real-time Currency Rates**: Display current exchange rates for EUR against major currencies
- **Interactive Charts**: Visual representation of exchange rates using custom CSS-based bar charts
- **Comprehensive Table**: Complete list of all available currencies with their rates
- **Featured Rates**: Highlighted display for EUR/USD and EUR/Gold (per gram)
- **Auto-refresh**: Data automatically updates every 5 minutes
- **Manual Refresh**: Button to refresh data on demand
- **Responsive Design**: Works on desktop and mobile devices

## Usage

Simply open `index.html` in a web browser. The application will:
1. Fetch the latest exchange rates from exchangerate-api.com
2. Display EUR/USD and EUR/Gold rates in featured cards
3. Show a bar chart with major currencies
4. Present a complete table of all available currency rates

## Currency Pairs Included

- EUR/USD (US Dollar)
- EUR/Gold (XAU per gram)
- EUR against all major world currencies (GBP, JPY, CHF, CAD, AUD, CNY, INR, and more)

## Data Source

Exchange rate data is provided by [exchangerate-api.com](https://exchangerate-api.com), which aggregates official data from various financial institutions.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Custom CSS-based bar chart for data visualization
- exchangerate-api.com API for currency data