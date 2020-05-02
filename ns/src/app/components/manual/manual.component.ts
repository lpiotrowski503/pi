import { Component, OnInit, OnDestroy } from "@angular/core";
import { TouchGestureEventData } from "tns-core-modules/ui/gestures/gestures";
import { HttpClient } from "@angular/common/http";
import { RouterExtensions } from "nativescript-angular/router";
import { StoreService } from "~/app/services/store.service";
import { timer, Observable, Subscription } from "rxjs";

@Component({
    selector: "ns-manual",
    templateUrl: "./manual.component.html",
    styleUrls: ["./manual.component.css"],
    moduleId: module.id,
})
export class ManualComponent implements OnInit, OnDestroy {
    private touched: boolean;
    private finish: boolean;
    public speed: any;
    public position: { x: string; y: string; z: string };
    private count: number;
    private current: number;
    public sub: Subscription = new Subscription();
    public timer: Observable<any>;
    public startSub = true;
    public axis = "";

    constructor(
        private httpClient: HttpClient,
        private router: RouterExtensions,
        private store: StoreService
    ) {
        this.touched = false;
        this.finish = false;
        this.speed = 16;
        this.count = 0;
        this.current = 0;
        this.position = {
            x: "0",
            y: "0",
            z: "0",
        };
    }

    private action(direction: number, action: boolean): void {
        this.httpClient
            .post(
                "http://192.168.43.77:3000/api/motor",
                {
                    axis: this.axis,
                    direction,
                    action,
                    speed: this.speed,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .subscribe((res: any) => {
                this.position = res;
                if (this.finish) {
                    console.log(
                        "pi-out---manual-res--- " + JSON.stringify(res)
                    );
                }
            });
    }

    public onTouch(axis: string, direction: number): void {
        this.axis = axis;
        this.count++;

        if (!this.touched) {
            this.touched = true;
            this.finish = false;
            this.action(direction, true);
            console.log(
                `ns-in----manual--${axis}---- ` +
                    JSON.stringify({
                        action: "start",
                        time: this.store.getNowDate(),
                    })
            );
        } else {
            if (this.startSub) {
                this.startSub = false;
                this.timer = timer(100, 100);
                this.sub.add(
                    this.timer.subscribe((data) => {
                        if (
                            this.touched &&
                            !this.finish &&
                            this.count === this.current
                        ) {
                            this.finish = true;
                            this.current = 0;
                            this.count = 0;
                            this.touched = false;
                            this.action(direction, false);
                            console.log(
                                `ns-in----manual--${axis}---- ` +
                                    JSON.stringify({
                                        action: "stop",
                                        time: this.store.getNowDate(),
                                    })
                            );
                        } else {
                            this.current = this.count;
                        }
                    })
                );
            }
        }
    }

    public changeSpeed(speed: number, event: TouchGestureEventData): void {
        // Prevent too fast
        if (speed == 16) {
            this.speed = speed;
        } else {
            this.speed = 8;
        }
    }

    public goToAuto(): void {
        this.router.navigate(["auto"]);
    }

    public goToBaseOffset(): void {
        console.log(
            "ns-in---" +
                JSON.stringify({
                    type: "manual",
                    action: "return to zero",
                    time: this.store.getNowDate(),
                })
        );
        this.httpClient
            .get("http://192.168.43.77:3000/api/zero", {
                headers: { "Content-Type": "application/json" },
            })
            .subscribe((res: any) => {
                console.log("res", res);
                this.position = res;
            });
    }

    public resetOffset(): void {
        this.httpClient
            .put(
                "http://192.168.43.77:3000/api/reset",
                {},
                {
                    headers: { "Content-Type": "application/json" },
                }
            )
            .subscribe((res: any) => {
                console.log("res", res);
                this.position = res;
            });
    }

    ngOnInit() {}

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
