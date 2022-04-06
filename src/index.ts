import { App } from './app';

const server = App.get();

const startServer = async function (server: App): Promise<void> {
  await server.start();
};

startServer(server);
