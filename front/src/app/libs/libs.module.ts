import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { NavbarComponent } from "./navbar/navbar.component";
import { ProgramComponent } from "./program/program.component";
import { SourcePipe } from "./source/source.pipe";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [NavbarComponent, ProgramComponent, SourcePipe],
  imports: [CommonModule, FormsModule],
  exports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    ProgramComponent,
    SourcePipe
  ]
})
export class LibsModule {}
