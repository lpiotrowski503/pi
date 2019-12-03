import { AutoComponent } from "./components/auto/auto.component";
import { ManualComponent } from "./components/manual/manual.component";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";

const routes: Routes = [
    { path: "manual", component: ManualComponent },
    { path: "auto", component: AutoComponent },
    { path: "", redirectTo: "auto", pathMatch: "full" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
