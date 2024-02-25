import { EventMessage } from './events';

export interface EventBus {
  publish<T extends EventMessage<any>>(
    eventName: T['name'],
    payload: T['payload'],
  ): Promise<void>;

  subscribe<T extends EventMessage<any>>(
    eventName: T['name'],
    callback: (message: T) => Promise<void>,
  ): void;
}
