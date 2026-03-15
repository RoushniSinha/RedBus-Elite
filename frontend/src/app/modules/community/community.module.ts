import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommunityRoutingModule } from './community-routing.module';
import { CommunityComponent } from './community.component';

@NgModule({
  declarations: [CommunityComponent],
  imports: [CommonModule, CommunityRoutingModule],
})
export class CommunityModule {}
