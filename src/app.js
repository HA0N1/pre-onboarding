import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';

dotenv.config();
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());
app.use('/', router);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!!');
});
