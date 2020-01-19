import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit
} from "@angular/core";

@Component({
  selector: "app-program",
  templateUrl: "./program.component.html",
  styleUrls: ["./program.component.sass"]
})
export class ProgramComponent implements OnInit, AfterViewInit {
  @Input() public input: any;
  @Output() public output: EventEmitter<any> = new EventEmitter();

  public canvas: any;
  public context: any;
  public isWriting: boolean;

  constructor() {
    this.input = {
      program: {
        _id: "",
        name: "",
        author: "",
        src: []
      }
    };
    this.isWriting = false;
  }

  ngOnInit() {
    this.input.program.src = this.input.program.src.join(";\n");
  }

  public onSave(): void {
    this.output.emit(this.input.program);
  }

  ngAfterViewInit() {
    this.canvas = document.getElementById("canvas-container");
    this.context = this.canvas.getContext("2d");
    this.context.strokeStyle = "red";
    this._setPreview();
  }

  public onChange(): void {
    this._setPreview();
  }

  private onPosition(axis: string, row: string) {
    if (row.includes(axis)) {
      const start = +row.indexOf(axis);
      const end = +row.indexOf(" ", start);
      return {
        axis,
        value: +row.slice(start + 1, end === -1 ? row.length : end)
      };
    } else {
      return null;
    }
  }

  private _setPreview(): void {
    this.input.program.src.split(";\n").forEach((el: any, i: number) => {
      if (el.includes("g1")) {
        if (this.onPosition("x", el) && this.onPosition("y", el)) {
          if (this.isWriting) {
            this.context.beginPath();
            this.isWriting = false;
          }
          this.context.lineTo(
            this.onPosition("x", el).value,
            this.onPosition("y", el).value
          );
          this.context.stroke();
        }
      } else {
          this.isWriting = true;
          this.context.closePath();
      }
    });
  }
}
