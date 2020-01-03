import { Component, OnInit, AfterViewInit, HostListener } from "@angular/core";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.sass"]
})
export class CanvasComponent implements OnInit, AfterViewInit {
  public canvas: any;
  public context: any;
  public isWriting: boolean;
  public src: string[];

  constructor() {
    this.isWriting = false;
    this.src = [];
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.canvas = document.getElementById("canvas-container");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight - 102;
    this.context = this.canvas.getContext("2d");
    this.context.strokeStyle = "red";
  }

  private _setStartWriting(): void {
    this.isWriting = true;
    this.context.beginPath();
    this.src.push("g0 x0 y0 z20");
  }

  private _startWriting(): void {
    this.src.push("g1 z0");
  }

  private _enterInitialize(position: string): void {
    this._setStartWriting();
    this.src.push(position);
    this._startWriting();
  }

  public onMouseEnter(event: MouseEvent): void {
    this._enterInitialize(`g0 x${event.x} y${event.y - 102}`);
  }

  public onTouchEnter(event: TouchEvent): void {
    this._enterInitialize(
      `g0 x${event.changedTouches[0].clientX} y${event.changedTouches[0]
        .clientY - 102}`
    );
  }

  public onLeave(): void {
    this.isWriting = false;
    this.context.closePath();
    this.src.push("g0 z20");
    console.log(this.src);
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isWriting) {
      this.context.lineTo(event.x, event.y - 102);
      this.context.stroke();
      this.src.push(`g1 x${event.x} y${event.y - 102}`);
    }
  }

  public onTouchMove(event: TouchEvent): void {
    if (this.isWriting) {
      this.context.lineTo(
        event.changedTouches[0].clientX,
        event.changedTouches[0].clientY - 102
      );
      this.context.stroke();
      this.src.push(
        `g1 x${event.changedTouches[0].clientX} y${event.changedTouches[0]
          .clientY - 102}`
      );
    }
  }
}
