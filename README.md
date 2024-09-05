# Currency Conversion App

A simple and intuitive currency conversion app built with React Native and NativeWind. This app allows users to manage a list of favorite currencies for conversion and perform quick, real-time currency conversions.

## Features

- Add currencies to a favorites list for easy access.
- Convert between any two currencies from the favorites list.
- Delete currencies from your favorites list as needed.
- Real-time conversion with an active internet connection.

## Prerequisites

Before running the app, ensure that the following dependencies are installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Internet connection (required for currency conversion)

## Installation

To set up and run the app locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/akachi11/reeple-assessment-chimadika.git
   cd currency-conversion-app


# DOCUMENTATION

# Currency Conversion App

A simple and intuitive currency conversion app built with React Native and NativeWind. This app allows users to manage a list of favorite currencies for conversion and perform real-time currency conversions.

## Features

- **Favorite Currencies Management**: Users can add, view, and delete currencies from their favorites list.
- **Base Currency Selection**: Users can select any currency from the favorites list as the base currency.
- **Live Conversion Rates**: The app fetches live exchange rates using the [ExchangeRate API](https://www.exchangerate-api.com/).
- **Last Updated Timestamp**: Displays the date when the exchange rates were last fetched (typically "today").

## Limitations

- **Decimal Rounding**: Currency amounts are rounded to two decimal points. This means conversions below 0.005 will show `0.00`. However, the app provides a wide range of currencies to select from.

---

## Technologies Used

### 1. **Expo**
Expo was selected for the following reasons:
- **Ease of Setup**: Provides a quick and efficient way to initialize and run the app across iOS and Android without platform-specific setup.
- **Built-in Tools**: Features such as live reloading and debugging tools made it ideal for rapid development.

### 2. **NativeWind (TailwindCSS for React Native)**
NativeWind was used for styling because:
- **Utility-First Styling**: TailwindCSS simplifies styling by using utility classes directly within the component, making the codebase more maintainable and consistent.
- **Responsive Design**: It ensures that the app remains responsive across different screen sizes with minimal effort.

---

## Architectural Decisions

1. **Favorites State Management**: The app manages a list of favorite currencies, which can be used for conversions. The base currency is set to USD by default, but users can change it by selecting any of their favorites.
   
2. **Conversion Logic**: When an amount is entered, it is converted from the base currency to all the favorite currencies using real-time rates.
   
3. **Data Fetching**: The app fetches exchange rates from the [ExchangeRate API](https://www.exchangerate-api.com/) and displays the last update timestamp in the top-right corner.
   
4. **UI Design with Bottom Sheet**: A bottom sheet allows users to select currencies to add to their favorites. This keeps the main interface clean and user-friendly.

---

## Setup and Installation

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/akachi11/reeple-assessment-chimadika.git
cd currency-conversion-app
