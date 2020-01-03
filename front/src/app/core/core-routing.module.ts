import { StatsComponent } from "./pages/stats/stats.component";
import { CanvasComponent } from "./pages/canvas/canvas.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EditProgramComponent } from "./pages/edit-program/edit-program.component";
import { ProgramsComponent } from "./pages/programs/programs.component";
import { CreateProgramComponent } from "./pages/create-program/create-program.component";
import { CoreComponent } from "./core.component";

const routes: Routes = [
  {
    path: "",
    component: CoreComponent,
    children: [
      {
        path: "",
        component: ProgramsComponent
      },
      {
        path: "new",
        component: CreateProgramComponent
      },
      {
        path: "edit/:id",
        component: EditProgramComponent
      },
      {
        path: "canvas",
        component: CanvasComponent
      },
      {
        path: "stats",
        component: StatsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
