import { HttpService } from "./../../services/http.service";
import { Component, OnInit } from "@angular/core";
import { ChartsModule } from "ng2-charts";
import { ChartOptions } from "chart.js";
import { StoreService } from "../../services/store.service";

@Component({
  selector: "app-stats",
  templateUrl: "./stats.component.html",
  styleUrls: ["./stats.component.sass"]
})
export class StatsComponent implements OnInit {
  public data = {
    label: [],
    value: []
  };

  public test: any[] = [];

  public chartOptions: ChartOptions = {
    responsive: true,
    cutoutPercentage: 90,
    title: {
      display: true,
      text: "Programs length"
    }
  };
  // tslint:disable-next-line:member-ordering
  public btns = ["bar", "doughnut", "line", "radar", "polarArea"];
  public chartLegend = false;
  public chartType = this.btns[0];
  public chartColors = [
    {
      backgroundColor: [],
      borderColor: []
    }
  ];

  public getRandomColor(brightness = 0, opacity = 1): string {
    const rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    const mix = [brightness * 51, brightness * 51, brightness * 51];
    const mixedrgb = [
      rgb[0] + mix[0],
      rgb[1] + mix[1],
      rgb[2] + mix[2]
    ].map(x => Math.round(x / 2.0));
    return "rgba(" + mixedrgb.join(",") + "," + opacity + ")";
  }

  constructor(private http: HttpService, private store: StoreService) {}

  ngOnInit() {
    this.setProgramsChart();
    // this.setCloudChart()
  }

  public setProgramsChart(): void {
    this.store.getPrograms().subscribe((data: any) => {
      data.forEach((element: any): void => {
        this.data.label.push(element.name);
        this.data.value.push(element.src.length);
        const color = this.getRandomColor(3, 0.8);
        this.chartColors[0].backgroundColor.push(color);
        this.chartColors[0].borderColor.push(color);
      });

      console.log(this.data);
    });
  }

  public setCloudChart(): void {
    this.http.getStatsServer1().subscribe(data => {
      console.log(data.data);
    });

    this.http.getStatsServer2().subscribe(data => {
      data.data.forEach(element => {
        if (this.test.length === 0) {
          this.test.push(element);
          console.log(element[3]);
          console.log(this.test[this.test.length - 1][3]);
        }
        if (element[3] != this.test[this.test.length - 1][3]) {
          this.test.push(element);
        }
      });

      console.log(this.test);
      console.log(data.data);
    });
  }

  public onChangeChartType(btn: string): void {
    this.chartType = btn;
  }
}
