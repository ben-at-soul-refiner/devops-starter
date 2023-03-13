import { NextFunction, Request, Response } from "express";
import { BibleService } from "services";

export class BibleController {
  public bibleService = new BibleService();

  public search = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = req.query?.query as undefined | string | string[];

      const results = await this.bibleService.search(query);

      const code = results.numResults > 0 ? 200 : 404;

      return res.status(code).json({
        ...results,
        code,
      });
    } catch (error) {
      next(error);
    }
  };

  public suggest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query?.query as undefined | string | string[];

      const results = await this.bibleService.suggest(query);

      const code = results.numResults > 0 ? 200 : 404;

      return res.status(results.numResults > 0 ? 200 : 404).json({
        ...results,
        code,
      });
    } catch (error) {
      next(error);
    }
  };
}
