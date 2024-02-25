import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { PaymentService } from '../services/PaymentService';
import * as middlewares from './middlewares';
import { MemoryPaymentRepository } from '../repositories/MemoryPaymentRepository';
import { createRouter } from './router';
import { EventConsumer } from '../events/EventConsumer';
import { RabbitMQEventBus } from '../events/RabbitMQEventBus';
import { OrderService } from '../services/OrderService';
import { ExternalPaymentService } from '../services/ExternalPaymentService';
import { DbService } from '../repositories/DbService';
import { DbPaymentRepository } from '../repositories/DbPaymentRepository';

require('dotenv').config();

export async function createApp() {
  const app = express();

  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'payments service' });
  });

  const eventBus = new RabbitMQEventBus();

  const dbService = new DbService();
  const paymentRepository = new DbPaymentRepository(dbService);
  //const paymentRepository = new MemoryPaymentRepository();

  const orderService = new OrderService();
  const externalPaymentService = new ExternalPaymentService();

  const paymentService = new PaymentService(
    paymentRepository,
    eventBus,
    orderService,
    externalPaymentService,
  );
  const eventConsumer = new EventConsumer(eventBus, paymentService);

  async function connectToRabbitMQ() {
    while (!(await eventBus.connect())) {
      console.log('Retrying to connect to RabbitMQ...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  await connectToRabbitMQ();

  await dbService.connect();
  await dbService.runMigrations();

  app.use('/api/v1', createRouter({ paymentService }));

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  return app;
}
