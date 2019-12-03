import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-create-program",
  templateUrl: "./create-program.component.html",
  styleUrls: ["./create-program.component.sass"]
})
export class CreateProgramComponent implements OnInit {
  constructor(private router: Router, private store: StoreService) {}

  ngOnInit() {}

  public onSave(program: any): void {
    this.store
      .createProgram({
        name: program.name,
        author: program.author,
        src: program.src.replace(/\n/g, "").split(";")
      })
      .subscribe(() => this.router.navigate(["app"]));
  }
}
