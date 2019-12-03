import { Component, OnInit } from "@angular/core";
import { TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";

@Component({
    selector: "ns-manual",
    templateUrl: "./manual.component.html",
    styleUrls: ["./manual.component.css"],
    moduleId: module.id
})
export class ManualComponent implements OnInit {
    public event: any;
    private touched: boolean;
    public speed: any;
    public position: { x: number; y: number };
    public interval: any;
    // private axis: string;
    private zero: number;

    constructor(
        private httpClient: HttpClient,
        private router: RouterExtensions
    ) {
        this.event = [0, 0];
        this.touched = false;
        this.speed = 1;
        this.zero = 0;
        this.position = {
            x: 0,
            y: 0
        };
        // this.axis = "";
    }

    private action(axis: string, direction: number): void {
        // this.axis = axis;
        console.log("elo", axis);
        console.log("elo", direction);
        this.httpClient
            .post(
                "http://192.168.43.77:3000/api/motor",
                {
                    axis,
                    direction,
                    action: this.touched,
                    speed: this.speed
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            )
            .subscribe(
                data => console.log("post", data),
                err => console.log("err", err)
            );
        console.log(axis, this.speed);
    }

    private setPosition(axis: string, direction: number): void {
        // console.log("setPosition 2", axis, direction);
        // if (axis === 'x-up') {
        //     this.position.x += +(this.speed / 1000).toFixed(4);
        //     // (this.position.x += 0.001).toPrecision(3);
        //     // this.position.x.toPrecision(3);
        // }
        // if (axis === 'x-down') {
        //     this.position.x -= +(this.speed / 1000).toFixed(4);
        //     // (this.position.x -= 0.001).toPrecision(3);
        //     // this.position.x.toPrecision(3);
        // }
        // if (axis === 'y-up') {
        //     this.position.y += +(this.speed / 1000).toFixed(4);
        //     // (this.position.y += 0.001).toPrecision(3);
        //     // this.position.y.toPrecision(3);
        // }
        // if (axis === 'y-down') {
        //     this.position.y -= +(this.speed / 1000).toFixed(4);
        //     // (this.position.y -= 0.001).toPrecision(3);
        //     // this.position.y.toPrecision(3);
        // }
    }

    public onTouchHelper(
        enter: () => void,
        leave: () => void,
        event: TouchGestureEventData
    ): void {
        if (!this.touched) {
            enter();
        }
        if (this.event[0] == event.getX() && this.event[1] == event.getY()) {
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
                this.touched = true;
                this.action(axis, direction);
                this.interval = setInterval(() => {
                    this.setPosition(axis, direction);
                }, 10);
            },
            () => {
                this.touched = false;
                this.action(axis, direction);
                clearInterval(this.interval);
            },
            event
        );
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
