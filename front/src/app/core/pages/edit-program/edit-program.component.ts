import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-edit-program",
  templateUrl: "./edit-program.component.html",
  styleUrls: ["./edit-program.component.sass"]
})
export class EditProgramComponent implements OnInit {
  public data: any;

  constructor(
    private route: ActivatedRoute,
    private store: StoreService,
    private router: Router
  ) {
    this.data = {};
  }

  ngOnInit() {
    this.setEditData();
  }

  setEditData() {
    this.data.id = +this.route.snapshot.paramMap.get("id");
    this.data.program = this.store.getProgram(this.data.id);
  }

  public onSave({ program, source }): void {
    console.log("save program", program);
    console.log("save source", source);
    // console.log("save source", source.replace(/\n/g, "").split(";"));
    this.router.navigate(["app"]);
  }
}
