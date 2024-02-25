import { createApp } from './controller/app';

async function run() {
  const app = await createApp();

  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Listening: http://localhost:${port}`);
  });
}

run();
