import * as express from "express";
import { Request, Response } from "express";
import async from "../../middleware/async";
import { Program as ProgramModel } from "../../models/program";
import * as mongoose from "mongoose";

class Program {
  router = express.Router();
  private program;

  private createProgramModel(program) {
    this.program = new ProgramModel(program);
  }

  private async saveProgram() {
    await this.program.save();
  }

  private async removeProgram(id) {
    await ProgramModel.findByIdAndRemove(id);
  }

  private async editProgram(id, program) {
    await ProgramModel.findByIdAndUpdate(id, {
      name: program.name,
      author: program.author,
      src: program.src
    });
  }

  controller() {
    this.router.post(
      "/",
      async(
        async (req: Request, res: Response) => {
          console.log(req.body);
          this.createProgramModel(req.body);
          await this.saveProgram();
          res.status(200).end();
        },
        (error, req: Request, res: Response) => {
          res.status(400).json({ error: error.message });
        }
      )
    );

    this.router.patch(
      "/:id",
      async(
        async (req: Request, res: Response) => {
          await this.editProgram(req.params.id, req.body);
          res.status(200).end();
        },
        (error, req: Request, res: Response) => {
          res.status(400).json({ error: error.message });
        }
      )
    );

    this.router.delete(
      "/:id",
      async(
        async (req: Request, res: Response) => {
          await this.removeProgram(req.params.id);
          res.status(200).end();
        },
        (error, req: Request, res: Response) => {
          res.status(400).json({ error: error.message });
        }
      )
    );

    return this.router;
  }
}

export default new Program().controller();
