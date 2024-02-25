import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { schema } from './db-schema';

function createDb() {
  console.log('DB_URL', process.env.DB_URL);
  const client = postgres(process.env.DB_URL!, { max: 1 });
  const db = drizzle(client, { schema });
  return db;
}

export type TX = Omit<ReturnType<typeof createDb>, 'transaction'>;
export type TXOptions = { tx?: TX };

export class DbService {
  db!: ReturnType<typeof createDb>;

  constructor() {}

  async connect() {
    this.db = createDb();
  }

  async runMigrations() {
    console.log('migrations running');
    await migrate(this.db, { migrationsFolder: './migrations' });
    console.log('migrations done');
  }

  async transaction(fn: (tx: TX) => Promise<void>, { tx }: { tx?: TX } = {}) {
    if (tx) {
      await fn(tx);
    } else {
      await this.db.transaction((tx) => fn(tx));
    }
  }
}
