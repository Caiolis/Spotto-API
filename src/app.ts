import express, { json, Request, Response } from 'express';
import 'express-async-errors';
import httpStatus from 'http-status';
import cors from 'cors';
import dotenv from 'dotenv';

const app = express();

app.use(json());
app.use(cors());
dotenv.config();

app.get('/health', (_req: Request, res: Response) => {
  return res.status(httpStatus.OK).send("I'm Ok!");
});

export default app; 