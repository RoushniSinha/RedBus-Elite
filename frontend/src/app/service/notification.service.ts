import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { INotification } from '../model/elite.model';

/**
 * NotificationService
 * Singleton service that uses an RxJS BehaviorSubject to push real-time
 * alert notifications to the Toastr / notification tray component.
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications$ = new BehaviorSubject<INotification[]>([]);

  /** Observable stream of all active notifications */
  readonly notifications$: Observable<INotification[]> =
    this._notifications$.asObservable();

  /** Push a success notification */
  success(message: string): void {
    this._push('success', message);
  }

  /** Push an info notification */
  info(message: string): void {
    this._push('info', message);
  }

  /** Push a warning notification */
  warning(message: string): void {
    this._push('warning', message);
  }

  /** Push an error notification */
  error(message: string): void {
    this._push('error', message);
  }

  /** Remove a specific notification by id */
  dismiss(id: string): void {
    this._notifications$.next(
      this._notifications$.getValue().filter((n) => n.id !== id)
    );
  }

  /** Clear all notifications */
  clearAll(): void {
    this._notifications$.next([]);
  }

  // ── Private helpers ──────────────────────────────────────────────────────

  private _push(
    type: INotification['type'],
    message: string,
    ttlMs = 5000
  ): void {
    const notification: INotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      message,
      timestamp: Date.now(),
    };

    const current = this._notifications$.getValue();
    this._notifications$.next([...current, notification]);

    // Auto-dismiss after ttlMs
    setTimeout(() => this.dismiss(notification.id), ttlMs);
  }
}
