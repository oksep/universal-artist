import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BedComponent} from './bed/bed.component';
import {SettingComponent} from './setting/setting.component';
import {AboutComponent} from './about/about.component';
import {FeedComponent} from './feed/feed.component';

const routes: Routes = [
	{path: '', redirectTo: '/feed', pathMatch: 'full'},
	{path: 'feed', component: FeedComponent},
	{path: 'bed', component: BedComponent},
	{path: 'about', component: AboutComponent},
	{path: 'setting', component: SettingComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {useHash: true})],
	exports: [RouterModule]
})
export class AppRouting {
}
