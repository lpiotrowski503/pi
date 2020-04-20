import { Component, OnInit, AfterViewInit, HostListener } from "@angular/core";
import { StoreService } from "../../services/store.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-canvas",
  templateUrl: "./canvas.component.html",
  styleUrls: ["./canvas.component.sass"],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  public canvas: any;
  public context: any;
  public isWriting: boolean;
  public src: string[];
  public formData: any;

  constructor(private router: Router, private store: StoreService) {
    this.isWriting = false;
    this.src = [];
    this.formData = {
      program: {
        _id: "",
        name: "",
        author: "",
        src: [],
      },
    };
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.canvas = document.getElementById("canvas-container");
    this.context = this.canvas.getContext("2d");
    this.context.strokeStyle = "red";
  }

  public onSave(): void {
    this.store
      .createProgram({
        name: this.formData.program.name,
        author: this.formData.program.author,
        src: this.formData.program.src,
      })
      .subscribe(() => this.router.navigate(["app"]));
  }

  private _setStartWriting(): void {
    this.isWriting = true;
    this.context.beginPath();
    this.formData.program.src.push("g1 z200");
  }

  private _startWriting(): void {
    this.formData.program.src.push("g1 z0");
  }

  private _enterInitialize(position: string): void {
    this._setStartWriting();
    this.formData.program.src.push(position);
    this._startWriting();
  }

  public onMouseEnter(event: MouseEvent): void {
    this._enterInitialize(`g0 x${event.offsetX} y${event.offsetY}`);
  }

  public onTouchEnter(event: TouchEvent | any): void {
    this._enterInitialize(
      `g0 x${
        event.changedTouches[0].clientX -
        event.changedTouches[0].target.offsetLeft
      } y${
        event.changedTouches[0].clientY -
        event.changedTouches[0].target.offsetTop
      }`
    );
  }

  public onLeave(): void {
    this.isWriting = false;
    this.context.closePath();
    this.formData.program.src.push("g1 z200");
  }

  public onMouseMove(event: MouseEvent): void {
    if (this.isWriting) {
      this.context.lineTo(event.offsetX, event.offsetY);
      this.context.stroke();
      this.formData.program.src.push(`g1 x${event.offsetX} y${event.offsetY}`);
    }
  }

  public onTouchMove(event: TouchEvent | any): void {
    if (this.isWriting) {
      this.context.lineTo(
        event.changedTouches[0].clientX -
          event.changedTouches[0].target.offsetLeft,
        event.changedTouches[0].clientY -
          event.changedTouches[0].target.offsetTop
      );
      this.context.stroke();
      this.formData.program.src.push(
        `g1 x${
          event.changedTouches[0].clientX -
          event.changedTouches[0].target.offsetLeft
        } y${
          event.changedTouches[0].clientY -
          event.changedTouches[0].target.offsetTop
        }`
      );
    }
  }
}
