import express from 'express';
import { PaymentService } from '../services/PaymentService';

export function createRouter({
  paymentService,
}: {
  paymentService: PaymentService;
}) {
  const router = express.Router();

  router.get('/payments', async (req, res) => {
    console.log('GET /payments');
    const payments = await paymentService.getPayments();
    res.json(payments);
  });

  router.post('/reset', async (req, res) => {
    console.log('POST /reset');
    await paymentService.reset();
    res.send();
  });

  return router;
}
