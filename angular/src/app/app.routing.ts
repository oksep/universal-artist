import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BedComponent} from './bed/bed.component';
import {SeedComponent} from './seed/seed.component';
import {SettingComponent} from './setting/setting.component';
import {AboutComponent} from "./about/about.component";

const routes: Routes = [
	{path: '', redirectTo: '/brand', pathMatch: 'full'},
	{path: 'bed', component: BedComponent},
	{path: 'brand', component: SeedComponent, data: {category: 'brand'}},
	{path: 'illustration', component: SeedComponent, data: {category: 'illustration'}},
	{path: 'uiux', component: SeedComponent, data: {category: 'uiux'}},
	{path: 'about', component: AboutComponent},
	{path: 'setting', component: SettingComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRouting {
}
