import { Component, OnInit, signal } from '@angular/core';
import { IRoute, IWaypoint } from '../../model/elite.model';
import { MockDataService } from '../../service/mock-data.service';

@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
})
export class RouteComponent implements OnInit {
  readonly routes = signal<IRoute[]>([]);
  readonly selectedRoute = signal<IRoute | null>(null);
  readonly selectedWaypoint = signal<IWaypoint | null>(null);
  readonly loading = signal(true);

  constructor(private dataService: MockDataService) {}

  async ngOnInit(): Promise<void> {
    const data = await this.dataService.getRoutes();
    this.routes.set(data);
    if (data.length > 0) {
      this.selectedRoute.set(data[0]);
    }
    this.loading.set(false);
  }

  selectRoute(route: IRoute): void {
    this.selectedRoute.set(route);
    this.selectedWaypoint.set(null);
  }

  selectWaypoint(waypoint: IWaypoint): void {
    this.selectedWaypoint.set(waypoint);
  }

  getTrafficClass(index: IRoute['trafficIndex']): string {
    const map: Record<string, string> = {
      Low: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900',
      Medium: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900',
      High: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900',
    };
    return map[index] ?? '';
  }

  /** Derive a simple SVG polyline string from waypoints for the mini-map */
  getPolylinePoints(route: IRoute): string {
    // Map geographic coordinates into a 300×150 SVG viewport
    const lats = route.waypoints.map((w) => w.lat);
    const lngs = route.waypoints.map((w) => w.lng);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const latRange = maxLat - minLat || 1;
    const lngRange = maxLng - minLng || 1;

    return route.waypoints
      .map((w) => {
        const x = ((w.lng - minLng) / lngRange) * 260 + 20;
        const y = 130 - ((w.lat - minLat) / latRange) * 110;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }

  getWaypointX(route: IRoute, wp: IWaypoint): number {
    const lngs = route.waypoints.map((w) => w.lng);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    const lngRange = maxLng - minLng || 1;
    return ((wp.lng - minLng) / lngRange) * 260 + 20;
  }

  getWaypointY(route: IRoute, wp: IWaypoint): number {
    const lats = route.waypoints.map((w) => w.lat);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const latRange = maxLat - minLat || 1;
    return 130 - ((wp.lat - minLat) / latRange) * 110;
  }
}
