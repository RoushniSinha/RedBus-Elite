import { Pipe, PipeTransform } from '@angular/core';
import { IDimensionalScores } from '../model/elite.model';

/**
 * AverageScorePipe
 *
 * Calculates the Elite display score from dimensional ratings:
 *
 *   Display Score = (Punctuality + Cleanliness + Amenities) / 3
 *
 * Usage in template:
 *   {{ review.scores | averageScore }}              → "4.3"
 *   {{ review.scores | averageScore : 1 }}          → "4.3"  (1 decimal place)
 *   {{ review.scores | averageScore : 2 }}          → "4.33" (2 decimal places)
 */
@Pipe({
  name: 'averageScore',
  pure: true,
})
export class AverageScorePipe implements PipeTransform {
  transform(scores: IDimensionalScores, decimals = 1): string {
    if (!scores) {
      return '—';
    }
    const avg =
      (scores.punctuality + scores.cleanliness + scores.amenities) / 3;
    return avg.toFixed(decimals);
  }
}
