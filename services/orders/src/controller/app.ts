import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';

import { EventConsumer } from '../events/EventConsumer';
import { RabbitMQEventBus } from '../events/RabbitMQEventBus';
import { DbOrderRepository } from '../repositories/DbOrderRepository';
import { DbService } from '../repositories/DbService';
import { OrderService } from '../services/OrderService';
import * as middlewares from './middlewares';
import { createRouter } from './router';

require('dotenv').config();

export async function createApp() {
  const app = express();

  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'orders service' });
  });

  const eventBus = new RabbitMQEventBus();

  const dbService = new DbService();
  const orderRepository = new DbOrderRepository(dbService);
  //const orderRepository = new MemoryOrderRepository();

  const orderService = new OrderService(orderRepository, eventBus, dbService);
  const eventConsumer = new EventConsumer(eventBus, orderService);

  async function connectToRabbitMQ() {
    while (!(await eventBus.connect())) {
      console.log('Retrying to connect to RabbitMQ...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  await connectToRabbitMQ();

  await dbService.connect();
  await dbService.runMigrations();

  app.use('/api/v1', createRouter({ orderService }));

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  return app;
}
