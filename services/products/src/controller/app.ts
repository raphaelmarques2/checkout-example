import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import 'express-async-errors';

import { ProductService } from '../services/ProductService';
import * as middlewares from './middlewares';
import { MemoryProductRepository } from '../repositories/MemoryProductRepository';
import { createRouter } from './router';
import { RabbitMQEventBus } from '../events/RabbitMQEventBus';
import { EventConsumer } from '../events/EventConsumer';
import { OrderService } from '../services/OrderService';
import { DbService } from '../repositories/DbService';
import { DbProductRepository } from '../repositories/DbProductRepository';

require('dotenv').config();

export async function createApp() {
  const app = express();

  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'products service' });
  });

  const eventBus = new RabbitMQEventBus();

  const dbService = new DbService();
  const productRepository = new DbProductRepository(dbService);
  //const productRepository = new MemoryProductRepository();

  const orderService = new OrderService();

  const productService = new ProductService(
    productRepository,
    eventBus,
    orderService,
  );
  const eventConsumer = new EventConsumer(eventBus, productService);

  async function connectToRabbitMQ() {
    while (!(await eventBus.connect())) {
      console.log('Retrying to connect to RabbitMQ...');
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  await connectToRabbitMQ();

  await dbService.connect();
  await dbService.runMigrations();
  await productService.initDb();

  app.use('/api/v1', createRouter({ productService }));

  app.use(middlewares.notFound);
  app.use(middlewares.errorHandler);

  return app;
}
