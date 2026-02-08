import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import errorHandler, { notFound } from './middleware/error.middlerware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;