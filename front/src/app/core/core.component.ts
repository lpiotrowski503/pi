import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-core",
  templateUrl: "./core.component.html",
  styleUrls: ["./core.component.sass"]
})
export class CoreComponent implements OnInit {
  public pages: any[];

  constructor() {
    this.pages = [
      {
        name: "List",
        path: ""
      },
      {
        name: "New",
        path: "app/new"
      }
    ];
  }

  ngOnInit() {}
}
