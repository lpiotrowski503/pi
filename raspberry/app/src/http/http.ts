export class Http {
  public stepperStrategy(req: any, start: any, stop: any): void {
    if (req.body.action === true) {
      start();
    }

    if (req.body.action === false) {
      stop();
    }
  }
}
