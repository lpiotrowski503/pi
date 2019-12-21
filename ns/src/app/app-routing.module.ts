import { ListComponent } from "./components/auto/list/list.component";
import { AutoComponent } from "./components/auto/auto.component";
import { ManualComponent } from "./components/manual/manual.component";
import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { SourceComponent } from "./components/auto/source/source.component";

const routes: Routes = [
    { path: "manual", component: ManualComponent },
    {
        path: "auto",
        component: AutoComponent,
        children: [
            {
                path: "",
                component: ListComponent
            },
            {
                path: "source/:id",
                component: SourceComponent
            }
        ]
    },
    { path: "", redirectTo: "auto", pathMatch: "full" }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {}
