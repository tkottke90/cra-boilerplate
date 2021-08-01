import express, { Application, Request, Response } from "express";
import logger from "factories/logger";
import process from "factories/process";
import { Server } from "http";

export class MyApplication {

  public express: Application;

  constructor() {
    this.express = express();

    this.registerHealthcheckRoute();
  }

  public start(port: number): Server {
    return this.express.listen(port, () => {
      logger.log('info', `Server starting on port: ${port}`)
    });
  }

  public async registerRoute(initializer: (app: MyApplication) => void): Promise<void> {
    await initializer(this);
  }

  private registerHealthcheckRoute() {
    this.express.get('/healthcheck', (req: Request, res: Response) => {
      res.json({ response: 'OKAY', uptime: process.getUptime() });
    });
  }
}

export default new MyApplication();