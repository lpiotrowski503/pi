import { EditProgramComponent } from "./edit-program/edit-program.component";
import { ProgramsComponent } from "./programs/programs.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    component: ProgramsComponent
  },
  {
    path: "edit/:id",
    component: EditProgramComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule {}
