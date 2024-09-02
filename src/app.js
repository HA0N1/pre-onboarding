import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import swaggerSpec from './utils/swagger.js';
import swaggerUi from 'swagger-ui-express';
import errorHandler from './middleware/errorHandler.middleware.js';

dotenv.config();
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cookieParser());
app.use('/', router);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!!');
});
