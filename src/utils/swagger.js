import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Onboarding Api Docs',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
