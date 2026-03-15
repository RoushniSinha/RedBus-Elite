import { Component, OnInit, signal } from '@angular/core';
import { ITravelStory } from '../../model/elite.model';
import { MockDataService } from '../../service/mock-data.service';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
})
export class CommunityComponent implements OnInit {
  readonly stories = signal<ITravelStory[]>([]);
  readonly loading = signal(true);

  constructor(private dataService: MockDataService) {}

  async ngOnInit(): Promise<void> {
    const data = await this.dataService.getTravelStories();
    this.stories.set(data);
    this.loading.set(false);
  }

  getModerationBadgeClass(status: ITravelStory['moderationStatus']): string {
    const map: Record<string, string> = {
      APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return map[status] ?? '';
  }
}
