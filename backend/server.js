require('dotenv').config();
const app = require('./src/app');
const { sequelize } = require('./src/models');

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    console.log('Tables synced.');
    app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Swagger: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Startup failed:', err);
    process.exit(1);
  }
};

start();