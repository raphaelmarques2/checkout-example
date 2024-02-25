import client, { Channel, Connection } from 'amqplib';
import { EventBus } from './EventBus';
import { EventMessage } from './events';
import { v4 as uuid } from 'uuid';

const RABBITMQ_URL = process.env.RABBITMQ_URL!;
const RABBITMQ_FANOUT_EXCHANGE = process.env.RABBITMQ_FANOUT_EXCHANGE!;
const RABBITMQ_PAYMENTS_QUEUE = process.env.RABBITMQ_PAYMENTS_QUEUE!;

export class RabbitMQEventBus implements EventBus {
  private connection!: Connection;
  private channel!: Channel;
  private connected!: Boolean;

  private subscribers: Map<
    string,
    ((message: EventMessage<any>) => Promise<void>)[]
  > = new Map();

  constructor() {}

  async connect() {
    if (this.connected && this.channel) return;
    else this.connected = true;

    try {
      console.log('Connecting to RabbitMQ...');

      this.connection = await client.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      this.channel.assertExchange(RABBITMQ_FANOUT_EXCHANGE, 'fanout', {
        durable: true,
      });
      this.channel.assertQueue(RABBITMQ_PAYMENTS_QUEUE, { durable: true });
      this.channel.bindQueue(
        RABBITMQ_PAYMENTS_QUEUE,
        RABBITMQ_FANOUT_EXCHANGE,
        '',
      );
      this.channel.consume(RABBITMQ_PAYMENTS_QUEUE, async (message) => {
        if (message) {
          const parsedMessage = JSON.parse(message.content.toString());
          await this.consume(parsedMessage);
          this.channel.ack(message);
        }
      });
      console.log('RabbitMQ connected');
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  private async consume(message: EventMessage<any>) {
    const subscribers = this.subscribers.get(message.name) || [];
    for (const subscriber of subscribers) {
      await subscriber(message);
    }
  }

  async publish<P, T extends EventMessage<P>>(
    eventName: T['name'],
    payload: P,
  ): Promise<void> {
    const event: EventMessage<P> = {
      id: uuid(),
      name: eventName,
      timestamp: new Date().toISOString(),
      payload,
    };

    const content = Buffer.from(JSON.stringify(event));
    this.channel.publish(RABBITMQ_FANOUT_EXCHANGE, '', content);

    console.log('event published:', event);
  }

  subscribe<T extends EventMessage<any>>(
    name: T['name'],
    callback: (message: T) => Promise<void>,
  ): void {
    const currentSubscribers = this.subscribers.get(name) || [];
    this.subscribers.set(name, [
      ...currentSubscribers,
      callback as (message: EventMessage<any>) => Promise<void>,
    ]);
  }
}
