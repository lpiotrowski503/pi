import { Injectable } from "@angular/core";
import { environment as env } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class HttpService {
  constructor(private http: HttpClient) {}

  public getPrograms() {
    return this.http.get(`${env.raspberry}programs`);
  }

  public createProgram(program: any) {
    return this.http.post(`${env.raspberry}program`, program);
  }

  public editProgram(id: string, program: any) {
    return this.http.patch(`${env.raspberry}program/${id}`, program);
  }

  public deleteProgram(id: string) {
    return this.http.delete(`${env.raspberry}program/${id}`);
  }

  public getStatsServer1() {
    return this.http.get<any>("http://77.55.212.134:8080/serwerownia1");
  }

  public getStatsServer2() {
    return this.http.get<any>("http://77.55.212.134:8080/serwerownia2");
  }
}
