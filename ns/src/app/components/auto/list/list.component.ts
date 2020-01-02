import { StoreService } from "./../../../services/store.service";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"]
})
export class ListComponent implements OnInit {
    public programs: any[] = [];

    constructor(
        private httpClient: HttpClient,
        private router: RouterExtensions,
        private store: StoreService
    ) {}

    ngOnInit() {
        this.store.getPrograms().subscribe((programs: any[]) => {
            this.programs = programs;
            this.store.setPrograms(programs);
        });
    }

    public goToManual() {
        this.router.navigate(["manual"]);
    }

    public open(item: any): void {
        this.httpClient
            .post(
                `http://192.168.43.77:3000/api/program/load/${item._id}`,
                item,
                {
                    headers: { "Content-Type": "application/json" }
                }
            )
            .subscribe(() => this.router.navigate([`auto/source/${item._id}`]));
    }
}
