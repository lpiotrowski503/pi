import { Component, OnInit } from "@angular/core";
import { Page } from "tns-core-modules/ui/page/page";

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit {
    constructor(private page: Page) {
        // this.page.actionBarHidden = true;
    }

    ngOnInit() {}
}
