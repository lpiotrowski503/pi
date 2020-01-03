import { NgModule } from "@angular/core";

import { CoreRoutingModule } from "./core-routing.module";

import { LibsModule } from "../libs/libs.module";
import { ProgramsComponent } from "./pages/programs/programs.component";
import { EditProgramComponent } from "./pages/edit-program/edit-program.component";
import { CreateProgramComponent } from "./pages/create-program/create-program.component";
import { CoreComponent } from "./core.component";
import { CanvasComponent } from './pages/canvas/canvas.component';
import { StatsComponent } from './pages/stats/stats.component';

@NgModule({
  declarations: [
    ProgramsComponent,
    EditProgramComponent,
    CreateProgramComponent,
    CoreComponent,
    CanvasComponent,
    StatsComponent
  ],
  imports: [LibsModule, CoreRoutingModule]
})
export class CoreModule {}
