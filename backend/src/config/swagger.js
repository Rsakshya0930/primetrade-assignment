const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Primetrade API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:5000/api/v1' }],
    components: {
      securitySchemes: {
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/v1/*.js'],
};

module.exports = swaggerJsdoc(options);