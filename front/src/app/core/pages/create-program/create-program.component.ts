import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-create-program",
  templateUrl: "./create-program.component.html",
  styleUrls: ["./create-program.component.sass"]
})
export class CreateProgramComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  public onSave({ program, source }): void {
    console.log("save program", program);
    console.log("save source", source);
    // console.log("save source", source.replace(/\n/g, "").split(";"));
    this.router.navigate(["app"]);
  }
}
