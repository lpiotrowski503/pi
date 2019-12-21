import { StoreService } from "./../../../services/store.service";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: "ns-source",
    templateUrl: "./source.component.html",
    styleUrls: ["./source.component.css"]
})
export class SourceComponent implements OnInit {
    public program: any = {};

    constructor(
        private httpClient: HttpClient,
        private router: RouterExtensions,
        private store: StoreService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.program = this.store.getProgram(
            this.route.snapshot.paramMap.get("id")
        );
    }

    public goBack() {
        this.router.navigate(["auto"]);
    }

    public start() {
        console.log("start");
        this.httpClient
            .get("http://192.168.43.77:3000/api/program/start", {
                headers: { "Content-Type": "application/json" }
            })
            .subscribe(
                data => console.log("start", data),
                err => console.log("err", err)
            );
    }

    public stop() {
        console.log("stop");
        this.httpClient
            .get("http://192.168.43.77:3000/api/program/stop", {
                headers: { "Content-Type": "application/json" }
            })
            .subscribe(
                data => console.log("stop", data),
                err => console.log("err", err)
            );
    }
}
