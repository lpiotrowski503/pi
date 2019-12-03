import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-auto",
    templateUrl: "./auto.component.html",
    styleUrls: ["./auto.component.css"],
    moduleId: module.id
})
export class AutoComponent implements OnInit {
    public programs: any[] = [];

    constructor(
        private httpClient: HttpClient,
        private router: RouterExtensions
    ) {}

    ngOnInit() {
        this.httpClient.get("http://192.168.43.77:3000/api/programs").subscribe(
            (programs: any[]) => {
                this.programs = programs;
                console.log(this.programs);
            },
            err => console.log("error")
        );
    }

    public goToManual() {
        this.router.navigate(["manual"]);
    }
}
