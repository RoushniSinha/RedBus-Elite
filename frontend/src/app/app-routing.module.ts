import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './Component/landing-page/landing-page.component';
import { SelectbusPageComponent } from './Component/selectbus-page/selectbus-page.component';
import { PaymentPageComponent } from './Component/payment-page/payment-page.component';
import { ProfilePageComponent } from './Component/profile-page/profile-page.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'select-bus', component: SelectbusPageComponent },
  { path: 'payment', component: PaymentPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  {
    path: 'community',
    loadChildren: () =>
      import('./modules/community/community.module').then(
        (m) => m.CommunityModule
      ),
  },
  {
    path: 'routes',
    loadChildren: () =>
      import('./modules/route/route.module').then((m) => m.RouteEliteModule),
  },
  {
    path: 'reviews',
    loadChildren: () =>
      import('./modules/review/review.module').then((m) => m.ReviewModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
