import { Injectable } from '@angular/core';
import { Observable, of, firstValueFrom } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ITravelStory, IReview, IRoute } from '../model/elite.model';
import {
  MOCK_STORIES,
  MOCK_REVIEWS,
  MOCK_ROUTES,
} from '../mock-data';

/**
 * MockDataService (DataService)
 * Centralised API handler for Travel Stories, Reviews, and Routes.
 * Returns mock data via RxJS Observables that simulate async HTTP calls.
 * Swap the `of(...)` calls with `this.http.get<T>(url)` to connect a real API.
 */
@Injectable({ providedIn: 'root' })
export class MockDataService {

  // ── Travel Stories ───────────────────────────────────────────────────────

  async getTravelStories(): Promise<ITravelStory[]> {
    return firstValueFrom(of(MOCK_STORIES).pipe(delay(200)));
  }

  getTravelStories$(): Observable<ITravelStory[]> {
    return of(MOCK_STORIES).pipe(delay(200));
  }

  async getTravelStoryById(id: string): Promise<ITravelStory | undefined> {
    return firstValueFrom(
      of(MOCK_STORIES.find((s) => s.id === id)).pipe(delay(100))
    );
  }

  // ── Reviews ──────────────────────────────────────────────────────────────

  async getReviews(): Promise<IReview[]> {
    return firstValueFrom(of(MOCK_REVIEWS).pipe(delay(200)));
  }

  getReviews$(): Observable<IReview[]> {
    return of(MOCK_REVIEWS).pipe(delay(200));
  }

  async getReviewsByRoute(routeId: string): Promise<IReview[]> {
    return firstValueFrom(
      of(MOCK_REVIEWS.filter((r) => r.routeId === routeId)).pipe(delay(150))
    );
  }

  getReviewsByRoute$(routeId: string): Observable<IReview[]> {
    return of(MOCK_REVIEWS.filter((r) => r.routeId === routeId)).pipe(
      delay(150)
    );
  }

  // ── Routes ───────────────────────────────────────────────────────────────

  async getRoutes(): Promise<IRoute[]> {
    return firstValueFrom(of(MOCK_ROUTES).pipe(delay(200)));
  }

  getRoutes$(): Observable<IRoute[]> {
    return of(MOCK_ROUTES).pipe(delay(200));
  }

  async getRouteById(id: string): Promise<IRoute | undefined> {
    return firstValueFrom(
      of(MOCK_ROUTES.find((r) => r.id === id)).pipe(delay(100))
    );
  }
}

