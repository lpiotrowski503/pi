import * as express from "express";
import { Request, Response } from "express";
import async from "../../middleware/async";
import { Program } from "../../models/program";

class Programs {
  router = express.Router();

  controller() {
    this.router.get(
      "/",
      async(
        async (req: Request, res: Response) => res.json(await Program.find({})),
        (error, req: Request, res: Response) =>
          res.status(400).json({ error: error.message })
      )
    );

    return this.router;
  }
}

export default new Programs().controller();
