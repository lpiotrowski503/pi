import * as path from "path";
import { Request, Response } from "express";
import programs from "../routes/programs/programs";
import program from "../routes/programs/program";

class Routes {
  routes(app) {
    app.use("/api/program", program);
    app.use("/api/programs", programs);
    app.use("*", (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, "../../public/index.html"));
    });
  }
}

export default new Routes().routes;
