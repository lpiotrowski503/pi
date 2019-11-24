import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { StoreService } from "../services/store.service";

@Component({
  selector: "app-edit-program",
  templateUrl: "./edit-program.component.html",
  styleUrls: ["./edit-program.component.sass"]
})
export class EditProgramComponent implements OnInit {
  public program: any;
  public id: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: StoreService
  ) {}

  ngOnInit() {
    this.id = +this.route.snapshot.paramMap.get("id");
    this.program = this.store.getProgram(this.id);
    console.log(this.program);
  }

  public onSave(program: any, source: any): void {
    console.log("save program", program);
    console.log("save source", source);
    console.log("save source", source.replace(/\n/g, "").split(";"));
    this.router.navigate(["app"]);
  }

  public onDelete(program: any): void {
    console.log("delete", program);
    // this.http.delete(`${env.raspberry}program/${program.id}`);
  }
}
