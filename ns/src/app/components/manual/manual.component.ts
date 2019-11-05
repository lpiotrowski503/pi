import { Component, OnInit } from '@angular/core';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'ns-manual',
    templateUrl: './manual.component.html',
    styleUrls: ['./manual.component.css'],
    moduleId: module.id
})
export class ManualComponent implements OnInit {
    public event: any;
    private touched: boolean;
    public speed: any;
    public currentSpeed: number;
    public position: { x: number; y: number };
    public interval: any;
    private axis: string;
    private zero: number;

    constructor(private httpClient: HttpClient) {
        this.event = [0, 0];
        this.touched = false;
        this.speed = 25 * 2.5;
        this.currentSpeed = 0;
        this.zero = 0;
        this.position = {
            x: 0,
            y: 0
        };
        this.axis = '';
    }

    private action(axis: string): void {
        this.axis = axis;
        console.log('elo', this.axis);
        this.httpClient
            .post(
                'http://192.168.43.77:3000/api/motor',
                {
                    axis,
                    action: this.touched,
                    speed: this.speed
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            .subscribe(
                data => console.log('post', data),
                err => console.log('err', err)
            );
        console.log(axis, this.speed);
    }

    private setPosition(axis): void {
        console.log('elo 2', axis);
        if (axis === 'x-up') {
            this.position.x += +(this.speed / 1000).toFixed(4);
            // (this.position.x += 0.001).toPrecision(3);
            // this.position.x.toPrecision(3);
        }
        if (axis === 'x-down') {
            this.position.x -= +(this.speed / 1000).toFixed(4);
            // (this.position.x -= 0.001).toPrecision(3);
            // this.position.x.toPrecision(3);
        }
        if (axis === 'y-up') {
            this.position.y += +(this.speed / 1000).toFixed(4);
            // (this.position.y += 0.001).toPrecision(3);
            // this.position.y.toPrecision(3);
        }
        if (axis === 'y-down') {
            this.position.y -= +(this.speed / 1000).toFixed(4);
            // (this.position.y -= 0.001).toPrecision(3);
            // this.position.y.toPrecision(3);
        }
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

    public onTouch(arg: string, event: TouchGestureEventData): void {
        this.onTouchHelper(
            () => {
                this.touched = true;
                this.action(arg);
                this.interval = setInterval(() => {
                    this.setPosition(arg);
                }, 10);
            },
            () => {
                this.touched = false;
                this.action(arg);
                clearInterval(this.interval);
            },
            event
        );
    }

    public changeSpeed(
        speed: number,
        currentSpeed: number,
        event: TouchGestureEventData
    ): void {
        this.onTouchHelper(
            () => {
                this.speed = speed * 2.5;
                this.currentSpeed = currentSpeed;
            },
            () => {
                console.log(this.speed, this.currentSpeed);
            },
            event
        );
    }

    ngOnInit() {}
}
