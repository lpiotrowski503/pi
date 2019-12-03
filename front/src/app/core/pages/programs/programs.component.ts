import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-programs",
  templateUrl: "./programs.component.html",
  styleUrls: ["./programs.component.sass"]
})
export class ProgramsComponent implements OnInit {
  public programs$: Observable<any>;

  constructor(private router: Router, private store: StoreService) {}

  ngOnInit() {
    this.getPrograms();
  }

  public getPrograms() {
    this.programs$ = this.store.getPrograms();
  }

  public onEdit(program: any): void {
    this.router.navigate([`app/edit/${program._id}`]);
  }

  public onDelete(program: any): void {
    console.log("delete", program);
    this.store.deleteProgram(program._id).subscribe(() => this.getPrograms());
  }
}
