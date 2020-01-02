import * as mongoose from "mongoose";

class ProgramModel {
  private programSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    src: {
      type: Array,
      required: true
    }
  });

  public program = mongoose.model("Program", this.programSchema);
}
export const Program = new ProgramModel().program;
