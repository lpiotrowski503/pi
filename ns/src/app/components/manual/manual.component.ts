import { Component, OnInit } from "@angular/core";
import { TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";
import { StoreService } from "~/app/services/store.service";

@Component({
    selector: "ns-manual",
    templateUrl: "./manual.component.html",
    styleUrls: ["./manual.component.css"],
    moduleId: module.id,
})
export class ManualComponent implements OnInit {
    public event: any;
    private touched: boolean;
    public speed: any;
    public position: { x: string; y: string; z: string };
    private zero: number;

    constructor(
        private httpClient: HttpClient,
        private router: RouterExtensions,
        private store: StoreService
    ) {
        this.event = [0, 0];
        this.touched = false;
        this.speed = 1;
        this.zero = 0;
        this.position = {
            x: "0",
            y: "0",
            z: "0",
        };
    }

    private action(axis: string, direction: number): void {
        // console.log(
        //     `ns-in----manual--${axis}---- ` +
        //         JSON.stringify({
        //             action: "start",
        //             time: this.store.getNowDate(),
        //         })
        // );
        this.httpClient
            .post(
                "http://192.168.43.77:3000/api/motor",
                {
                    axis,
                    direction,
                    action: this.touched,
                    speed: this.speed,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .subscribe((res: any) => {
                // console.log("pi-out---manual-res--- " + JSON.stringify(res));
                this.position = res;
            });
    }

    public onTouchHelper(
        enter: () => void,
        leave: () => void,
        event: TouchGestureEventData
    ): void {
        if (!this.touched) {
            // console.log(1);
            enter();
        }
        if (this.event[0] == event.getX() && this.event[1] == event.getY()) {
            // console.log(0);
            // console.log(this.event);
            // console.log(event.getX());
            // console.log(event.getY());
            leave();
        }
        this.event = [event.getX(), event.getY()];
    }

    public onTouch(
        axis: string,
        direction: number,
        event: TouchGestureEventData
    ): void {
        this.onTouchHelper(
            () => {
                // console.log(1);
                this.touched = true;
                this.action(axis, direction);
            },
            () => {
                // console.log(0);
                // this.touched = false;
                // this.action(axis, direction);
            },
            event
        );
        // this.touched = false;
        // console.log("touch");
    }

    public changeSpeed(speed: number, event: TouchGestureEventData): void {
        this.onTouchHelper(
            () => {
                this.speed = speed;
            },
            () => {
                console.log(this.speed);
            },
            event
        );
    }

    public goToAuto(): void {
        this.router.navigate(["auto"]);
    }

    ngOnInit() {}
}
