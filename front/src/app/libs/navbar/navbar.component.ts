import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.sass"]
})
export class NavbarComponent implements OnInit {
  @Input() public pages: any[];
  public active = 0;

  constructor(private router: Router) {}

  public navi(path: string, i: number): void {
    this.active = i;
    this.router.navigate([path]);
  }

  ngOnInit() {}
}
