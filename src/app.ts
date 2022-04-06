import express from 'express';
import { Server } from 'http';
import cors from 'cors';
import httpStatus from 'http-status';
import config from './config/config';
import { ApiError } from './utils';
import logger from './config/logger';
import { ArtistRoute } from './routes/artist.route';
import { errorConverter, errorHandler } from './middlewares/error';

export class App {
  public app: express.Application;
  private static instance: App;
  private server: Server;

  public static get(): App {
    if (!this.instance) {
      this.instance = new App();
    }
    return this.instance;
  }

  private constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  /**
   * configuration of the middleware and port
   */
  public config(): void {
    this.app.set('port', config.port);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors({
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
    }));
  }

  /**
   * defines the server routes
   */
  public routes(): void {
    // api routes
    this.app.use('/api', new ArtistRoute().router);

    // send back a 404 error for any unknown api request
    this.app.use((req, res, next) => {
      next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
    });

    this.app.use(errorConverter);
    this.app.use(errorHandler);
  }

  /**
   * starts the server
   */
  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server = this.app.listen(this.app.get('port'), () => {
        logger.info(`Listening to port ${this.app.get('port')}`);
        resolve();
      })
    });
  }
}
