// ─── Elite Data Interfaces ───────────────────────────────────────────────────

export type ThemePref = 'light' | 'dark';
export type LanguagePref = 'en' | 'hi' | 'ta' | 'te' | 'kn' | 'ml' | 'bn';
export type ModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type TrafficIndex = 'Low' | 'Medium' | 'High';

/** Lat/Lng waypoint on a route */
export interface IWaypoint {
  name: string;
  lat: number;
  lng: number;
}

/** Dimensional rating breakdown for a review */
export interface IDimensionalScores {
  punctuality: number;  // 1-5
  cleanliness: number;  // 1-5
  amenities: number;    // 1-5
}

/** Platform user */
export interface IUser {
  id: string;
  name: string;
  email?: string;
  googleId?: string;
  profilePicture?: string;
  trustScore: number;       // 0.0 – 1.0
  languagePref: LanguagePref;
  themePref: ThemePref;
}

/** Community travel story */
export interface ITravelStory {
  id: string;
  author: string;
  title: string;
  content: string;          // Rich text / JSON body
  mediaUrls: string[];      // Unsplash / CDN image URLs
  routeId?: string;
  moderationStatus: ModerationStatus;
  createdAt: string;        // ISO 8601
}

/** Bus operator review with weighted scoring */
export interface IReview {
  id: string;
  routeId: string;
  busOperator?: string;
  scores: IDimensionalScores;
  comment: string;
  date: string;             // ISO 8601
  timeDecayWeight: number;  // 0.0 – 1.0; newer = closer to 1
}

/** Bus route with geographic waypoints */
export interface IRoute {
  id: string;
  origin: string;
  destination: string;
  waypoints: IWaypoint[];
  trafficIndex: TrafficIndex;
  durationHours?: number;
}

/** Notification message pushed by NotificationService */
export interface INotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: number;
}
