import { HttpService } from "./http.service";
import { Injectable } from "@angular/core";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class StoreService {
  private store = {
    programs: []
  };

  constructor(private http: HttpService) {}

  public getPrograms() {
    return this.http
      .getPrograms()
      .pipe(map((programs: any[]) => (this.store.programs = programs)));
  }

  public getProgram(id: string) {
    return this.store.programs.filter(program => `${program._id}` === id)[0];
  }

  public setPrograms(programs: any[]): void {
    this.store.programs = programs;
  }

  public createProgram(program: any) {
    return this.http.createProgram(program);
  }

  public editProgram(id: string, program: any) {
    return this.http.editProgram(id, program);
  }

  public deleteProgram(id: string) {
    return this.http.deleteProgram(id);
  }
}
