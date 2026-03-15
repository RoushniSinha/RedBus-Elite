import { Component } from '@angular/core';
import { NotificationService } from '../../service/notification.service';
import { INotification } from '../../model/elite.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notification-toast',
  templateUrl: './notification-toast.component.html',
})
export class NotificationToastComponent {
  readonly notifications$: Observable<INotification[]>;

  constructor(private notifyService: NotificationService) {
    this.notifications$ = this.notifyService.notifications$;
  }

  dismiss(id: string): void {
    this.notifyService.dismiss(id);
  }

  getTypeClass(type: INotification['type']): string {
    const map: Record<string, string> = {
      success: 'bg-green-600',
      info: 'bg-blue-600',
      warning: 'bg-yellow-500',
      error: 'bg-red-600',
    };
    return map[type] ?? 'bg-gray-600';
  }

  getTypeIcon(type: INotification['type']): string {
    const icons: Record<string, string> = {
      success: '✓',
      info: 'ℹ',
      warning: '⚠',
      error: '✕',
    };
    return icons[type] ?? '•';
  }
}
