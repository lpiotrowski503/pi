import { HttpClient } from '@angular/common/http';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    public btnRedText: string;
    public btnGreenText: string;
    public btnYellowText: string;
    public labelText: number;
    public event: any;

    private touched: boolean;

    constructor(private httpClient: HttpClient) {
        this.btnRedText = 'Http';
        this.btnGreenText = 'Socket';
        this.btnYellowText = 'bluetooth';
        this.labelText = 0;
        this.event = [0, 0];
        this.touched = false;
    }

    // public getRaspberry(): void {
    //     this.http
    //         .get('http://192.168.43.138:3000/api/raspberry', {
    //             headers: { 'Content-Type': 'application/json' }
    //         })
    //         .subscribe(
    //             data => console.log('get', data),
    //             err => console.log('err', err)
    //         );
    // }

    // public postRaspberry(arg: number): void {
    //     this.http
    //         .post(
    //             'http://192.168.43.138:3000/api/raspberry',
    //             { text: `ns post ${arg}` },
    //             {
    //                 headers: { 'Content-Type': 'application/json' }
    //             }
    //         )
    //         .subscribe(
    //             data => console.log('post', data),
    //             err => console.log('err', err)
    //         );
    // }

    private http(): void {
        const url = 'http://192.168.43.77:3000/api/led/http';
        this.httpClient
            .get(url, {
                headers: { 'Content-Type': 'application/json' }
            })
            .subscribe(data => console.log('post', data));
    }

    private action(arg): void {
        this[arg]();
    }

    public onTouch(arg: string, event: TouchGestureEventData): void {
        if (!this.touched) {
            this.action(arg);
            this.touched = true;
        }
        if (this.event[0] == event.getX() && this.event[1] == event.getY()) {
            this.action(arg);
            this.touched = false;
        }
        this.event = [event.getX(), event.getY()];
    }

    ngOnInit() {}

    ngOnDestroy() {}
}
