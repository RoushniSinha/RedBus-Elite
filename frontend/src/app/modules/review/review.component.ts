import { Component, OnInit, signal, computed } from '@angular/core';
import { IReview, IRoute, IDimensionalScores } from '../../model/elite.model';
import { MockDataService } from '../../service/mock-data.service';
import { NotificationService } from '../../service/notification.service';

interface NewReviewForm {
  routeId: string;
  comment: string;
  scores: IDimensionalScores;
}

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
})
export class ReviewComponent implements OnInit {
  readonly reviews = signal<IReview[]>([]);
  readonly routes = signal<IRoute[]>([]);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly submitted = signal(false);

  // Form state
  readonly form = signal<NewReviewForm>({
    routeId: '',
    comment: '',
    scores: { punctuality: 3, cleanliness: 3, amenities: 3 },
  });

  /** Real-time average score signal derived from the form */
  readonly liveAverage = computed(() => {
    const s = this.form().scores;
    return ((s.punctuality + s.cleanliness + s.amenities) / 3).toFixed(1);
  });

  constructor(
    private dataService: MockDataService,
    private notify: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    const [reviews, routes] = await Promise.all([
      this.dataService.getReviews(),
      this.dataService.getRoutes(),
    ]);
    this.reviews.set(reviews);
    this.routes.set(routes);
    if (routes.length > 0) {
      this.updateForm('routeId', routes[0].id);
    }
    this.loading.set(false);
  }

  updateForm(field: keyof NewReviewForm, value: string | IDimensionalScores): void {
    this.form.update((f) => ({ ...f, [field]: value }));
  }

  updateScore(dimension: keyof IDimensionalScores, value: number): void {
    this.form.update((f) => ({
      ...f,
      scores: { ...f.scores, [dimension]: value },
    }));
  }

  async submitReview(): Promise<void> {
    const f = this.form();
    if (!f.routeId || !f.comment.trim()) {
      this.notify.warning('Please fill in all required fields.');
      return;
    }
    this.submitting.set(true);

    // Simulate async submission
    await new Promise((r) => setTimeout(r, 800));

    const newReview: IReview = {
      id: `rev-${Date.now()}`,
      routeId: f.routeId,
      scores: { ...f.scores },
      comment: f.comment.trim(),
      date: new Date().toISOString(),
      timeDecayWeight: 1.0,
    };

    this.reviews.update((prev) => [newReview, ...prev]);
    this.submitting.set(false);
    this.submitted.set(true);
    this.notify.success('Review submitted successfully!');

    // Reset form
    this.form.set({
      routeId: this.routes()[0]?.id ?? '',
      comment: '',
      scores: { punctuality: 3, cleanliness: 3, amenities: 3 },
    });
    setTimeout(() => this.submitted.set(false), 3000);
  }

  getAverageDisplay(scores: IDimensionalScores): string {
    return ((scores.punctuality + scores.cleanliness + scores.amenities) / 3).toFixed(1);
  }

  getStarArray(): number[] {
    return [1, 2, 3, 4, 5];
  }

  getRouteLabel(routeId: string): string {
    const route = this.routes().find((r) => r.id === routeId);
    return route ? `${route.origin} → ${route.destination}` : routeId;
  }

  getScoreColor(score: string): string {
    const n = parseFloat(score);
    if (n >= 4.5) return 'text-green-600 dark:text-green-400';
    if (n >= 3.5) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }
}
