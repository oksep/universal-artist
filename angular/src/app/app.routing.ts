import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BedComponent} from './bed/bed.component';
import {SeedComponent} from './seed/seed.component';
import {SettingComponent} from './setting/setting.component';

const routes: Routes = [
	{path: '', redirectTo: '/bed', pathMatch: 'full'},
	{path: 'bed', component: BedComponent},
	{path: 'brand', component: SeedComponent, data: {type: 'brand'}},
	{path: 'illustration', component: SeedComponent, data: {type: 'illustration'}},
	{path: 'uiux', component: SeedComponent, data: {type: 'uiux'}},
	{path: 'setting', component: SettingComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRouting {
}
