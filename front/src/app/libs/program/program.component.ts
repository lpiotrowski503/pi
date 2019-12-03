import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
// import { StoreService } from "./../../core/services/store.service";
// import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-program",
  templateUrl: "./program.component.html",
  styleUrls: ["./program.component.sass"]
})
export class ProgramComponent implements OnInit {
  @Input() public input: any;
  @Output() public output: EventEmitter<any> = new EventEmitter();

  constructor() {
    this.input = {
      program: {
        _id: "",
        name: "",
        author: "",
        src: []
      }
    };
  }

  ngOnInit() {
    console.log(this.input);
    this.input.program.src = this.input.program.src.join(";\n");
  }

  public onSave(): void {
    this.output.emit(this.input.program);
  }
}
