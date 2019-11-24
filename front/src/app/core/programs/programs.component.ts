import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment as env } from "../../../environments/environment";
import { StoreService } from "../services/store.service";

@Component({
  selector: "app-programs",
  templateUrl: "./programs.component.html",
  styleUrls: ["./programs.component.sass"]
})
export class ProgramsComponent implements OnInit {
  public programs$: Observable<any>;
  public programs: any[];

  constructor(private router: Router, private store: StoreService) {}

  ngOnInit() {
    // this.programs$ = this.store.getPrograms();
    this.programs = this.store.getPrograms();
  }

  public onSave(program: any, source: any): void {
    console.log("save program", program);
    console.log("save source", source);
    console.log("save source", source.replace(/\n/g, "").split(";"));
  }

  public onEdit(program: any): void {
    console.log("edit", program);
    this.router.navigate([`app/edit/${program.id}`]);
    // this.http.patch(`${env.raspberry}program/${program.id}`, program);
  }

  public onDelete(program: any): void {
    console.log("delete", program);
    // this.http.delete(`${env.raspberry}program/${program.id}`);
  }
}
