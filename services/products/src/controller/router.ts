import express from 'express';
import { ProductService } from '../services/ProductService';

export function createRouter({
  productService,
}: {
  productService: ProductService;
}) {
  const router = express.Router();

  router.get('/products', async (req, res) => {
    const products = await productService.getProducts();
    res.json(products);
  });

  router.get('/reservations', async (req, res) => {
    const reservations = await productService.getReservations();
    res.json(reservations);
  });

  router.post('/reset', async (req, res) => {
    await productService.reset();
    res.send();
  });

  return router;
}
