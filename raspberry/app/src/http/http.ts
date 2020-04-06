export class Http {
  public stepperStrategy(req: any, start: any, stop: any): void {
    if (req.body.action === true) {
      console.log(1);
      start();
    }

    if (req.body.action === false) {
      console.log(0);
      stop();
    }
  }
}
