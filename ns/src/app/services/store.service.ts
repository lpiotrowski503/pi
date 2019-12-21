import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root"
})
export class StoreService {
    public programs: any[] = [];

    constructor(private httpClient: HttpClient) {}

    public getPrograms() {
        return this.httpClient.get("http://192.168.43.77:3000/api/programs");
    }

    public setPrograms(programs: any): void {
        this.programs = programs;
    }

    public getProgram(id: string) {
        return this.programs.filter(program => program._id === id)[0];
    }
}
