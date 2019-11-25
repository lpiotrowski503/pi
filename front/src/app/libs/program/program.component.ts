import { StoreService } from "./../../core/services/store.service";
import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

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
        name: "",
        author: ""
        // source: []
      }
    };
  }

  ngOnInit() {}

  public onSave(program: any, source: any): void {
    this.output.emit({
      program
      // source: source.replace(/\n/g, "").split(";")
    });
  }
}
