import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CoreRoutingModule } from "./core-routing.module";
import { ProgramsComponent } from "./programs/programs.component";
import { SourcePipe } from "src/app/pipes/source.pipe";
import { EditProgramComponent } from "./edit-program/edit-program.component";

@NgModule({
  declarations: [ProgramsComponent, SourcePipe, EditProgramComponent],
  imports: [CommonModule, CoreRoutingModule]
})
export class CoreModule {}
