import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';
import cors from 'cors';
import dotenv from 'dotenv';
import bookRouter from './routes/book-routes';
import { errorHandling } from '@/middlewares/errorHandling';

const app = express();

app
  .use(json())
  .use(cors())
  .get('/health', (_req: Request, res: Response) => res.status(httpStatus.OK).send("I'm Ok!"))
  .use('/books', bookRouter)
  .use(errorHandling);

dotenv.config();



export default app; 