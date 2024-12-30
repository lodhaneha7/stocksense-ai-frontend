
export const environment = {
  production: false,
  baseUrl: 'http://localhost:3000', 
  indianStockAPiEndpoint: 'https://stock.indianapi.in',
  indianStockAPiKey: process.env.INDIAN_STOCK_API_KEY, // loaded from .env file
};
