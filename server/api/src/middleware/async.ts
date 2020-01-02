import { Request, Response, NextFunction } from "express";

class Async {
  public async(resolve, reject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await resolve(req, res, next);
      } catch (error) {
        await reject(error, req, res);
      }
    };
  }
}

export default new Async().async;
