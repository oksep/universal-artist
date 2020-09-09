import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from './contact/contact.component';
import {ShopGuard} from './shop/shop.guard';
import {ShopComponent} from './shop/shop.component';
import {FeedComponent} from './feed/feed.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'feed',
  },
  {
    path: 'home',
    pathMatch: 'full',
    redirectTo: 'feed'
  },
  {
    pathMatch: 'full',
    path: 'feed',
    component: FeedComponent,
  },
  {
    path: 'feed/:tag',
    component: FeedComponent,
  },
  {
    path: 'content',
    loadChildren: './content/content.module#ContentModule',
  },
  {
    path: 'shop',
    canActivate: [ShopGuard],
    component: ShopComponent
  },
  {
    path: 'about',
    loadChildren: './about/about.module#AboutModule',
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true, enableTracing: false})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
