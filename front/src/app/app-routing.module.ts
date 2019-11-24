import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "app",
    loadChildren: () => import("./core/core.module").then(m => m.CoreModule)
  },
  {
    path: "**",
    redirectTo: "app"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
