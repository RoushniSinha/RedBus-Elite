import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewRoutingModule } from './review-routing.module';
import { ReviewComponent } from './review.component';
import { AverageScorePipe } from '../../pipes/average-score.pipe';

@NgModule({
  declarations: [ReviewComponent, AverageScorePipe],
  imports: [CommonModule, FormsModule, ReviewRoutingModule],
})
export class ReviewModule {}
