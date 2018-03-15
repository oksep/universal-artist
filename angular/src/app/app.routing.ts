import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingComponent} from './setting/setting.component';
import {ConfigComponent} from './config/config.component';
import {HomeComponent} from './home/home.component';
import {UiuxComponent} from './uiux/uiux.component';
import {IllustrationComponent} from './illustration/illustration.component';
import {BrandComponent} from './brand/brand.component';
import {BedComponent} from './bed/bed.component';

const routes: Routes = [
	{path: '', redirectTo: '/bed', pathMatch: 'full'},
	{path: 'bed', component: BedComponent},
	{path: 'brand', component: BrandComponent},
	{path: 'illustration', component: IllustrationComponent},
  {path: 'uiux', component: UiuxComponent},
  {path: 'home', component: HomeComponent},
  {path: 'config', component: ConfigComponent},
  {path: 'setting', component: SettingComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRouting {
}
