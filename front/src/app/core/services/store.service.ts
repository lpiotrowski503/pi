import { HttpService } from "./http.service";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class StoreService {
  private store = {
    programs: [
      {
        id: 1,
        name: "Program 1",
        author: "boss",
        src: ["x50 y50 z50", "x100 y50 z50", "x100 y100 z50", "x100 y100 z100"]
      },
      {
        id: 2,
        name: "Program 2",
        author: "boss",
        src: ["x50 y50 z50", "x100 y50 z50", "x100 y100 z50", "x100 y100 z100"]
      },
      {
        id: 3,
        name: "Program 3",
        author: "boss",
        src: ["x50 y50 z50", "x100 y50 z50", "x100 y100 z50", "x100 y100 z100"]
      }
    ]
  };

  constructor(private http: HttpService) {}

  getPrograms() {
    // return this.http.getPrograms();
    return this.store.programs;
  }

  getProgram(id: any) {
    return this.store.programs.filter(program => program.id === id)[0];
  }
}
