import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteEliteRoutingModule } from './route-routing.module';
import { RouteComponent } from './route.component';

@NgModule({
  declarations: [RouteComponent],
  imports: [CommonModule, RouteEliteRoutingModule],
})
export class RouteEliteModule {}
