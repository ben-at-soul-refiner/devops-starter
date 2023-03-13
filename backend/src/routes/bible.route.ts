import { Router } from "express";
import { Routes } from "common";
import { BibleController } from "controllers";

export class BibleRoute implements Routes {
  public path = "/bible";
  public router = Router();
  public controller = new BibleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get(`${this.path}`, this.controller.search);
    this.router.get(`${this.path}/suggestion`, this.controller.suggest);
  };
}
