import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BedComponent} from './bed/bed.component';
import {SeedComponent} from './seed/seed.component';
import {SettingComponent} from './setting/setting.component';
import {AboutComponent} from "./about/about.component";

const routes: Routes = [
	{path: '', redirectTo: '/bed', pathMatch: 'full'},
	{path: 'bed', component: BedComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRouting {
}
