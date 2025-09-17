import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is live on: http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
  console.log(`API endpoint: http://localhost:${port}/api`);
});
