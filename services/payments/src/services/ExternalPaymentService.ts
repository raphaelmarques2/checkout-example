import { Payment } from '../entities/Payment';

export class ExternalPaymentService {
  async pay(payment: Payment): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Simulate a delay

    //If amount is less than 1, payment will fail
    const success = payment.amount >= 1;
    return success;
  }
}
