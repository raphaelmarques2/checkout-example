import express from 'express';
import { OrderService } from '../services/OrderService';

export function createRouter({ orderService }: { orderService: OrderService }) {
  const router = express.Router();

  router.post('/orders', async (req, res) => {
    console.log('POST /orders', req.body);
    const order = await orderService.createOrder(req.body);
    res.json(order);
  });

  router.get('/orders', async (req, res) => {
    console.log('GET /orders');
    const orders = await orderService.getOrders();
    res.json(orders);
  });

  router.get('/orders/:id', async (req, res) => {
    console.log('GET /orders/:id', req.params.id);
    const order = await orderService.getOrder(req.params.id);
    res.json(order);
  });

  router.post('/reset', async (req, res) => {
    console.log('POST /reset');
    await orderService.reset();
    res.send();
  });

  return router;
}
