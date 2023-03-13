import express, { json, urlencoded } from "express";
import cors from "cors";
import { Routes } from "common";
import { errorMiddleware } from "middleware";

const PORT = process.env.PORT;

export class App {
  public app: express.Application;
  public port: string | number;
  public version: string;
  public path = "/api";

  constructor(routes: Routes[], version?: string) {
    this.app = express();
    this.port = PORT || 5000;
    this.version = version ?? "v1";

    this.disable();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public getServer() {
    return this.app;
  }

  private disable() {
    this.app.disable("x-powered-by");
  }

  private initializeMiddlewares() {
    this.app.use(json());
    this.app.use(urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use(`${this.path}/${this.version}`, route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
