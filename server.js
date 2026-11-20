const app = require('./src/app');
const config = require('./src/config/config');

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Student Portal API running on http://localhost:${config.port}`);
  console.log(`🔒 Security enabled: Helmet, CORS, Rate-Limiter (100 req/15m)`);
  console.log(`=======================================================`);
});

// Graceful shutdown handling
process.on('SIGINT', () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server gracefully...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
});
