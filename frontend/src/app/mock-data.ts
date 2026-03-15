import { ITravelStory, IReview, IRoute, IUser } from './model/elite.model';

// ─── Users ────────────────────────────────────────────────────────────────────
export const MOCK_USERS: IUser[] = [
  {
    id: 'u1',
    name: 'Roushni Sinha',
    email: 'roushni@example.com',
    trustScore: 0.95,
    languagePref: 'hi',
    themePref: 'dark',
  },
  {
    id: 'u2',
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    trustScore: 0.88,
    languagePref: 'en',
    themePref: 'light',
  },
];

// ─── Travel Stories ───────────────────────────────────────────────────────────
export const MOCK_STORIES: ITravelStory[] = [
  {
    id: 's1',
    author: 'Roushni Sinha',
    title: 'Sunset over the Western Ghats',
    content:
      'The journey from Mumbai to Goa was absolutely breathtaking. As the bus wound through the lush green curves of the Western Ghats, the setting sun painted the sky in shades of amber and crimson. The semi-sleeper was surprisingly comfortable, with blankets provided and the AC set to just the right chill. We stopped at a rustic dhaba near Kolhapur where the vada pav was perfectly spiced. Highly recommend this route to anyone seeking both adventure and serenity.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    ],
    routeId: 'r102',
    moderationStatus: 'APPROVED',
    createdAt: '2026-03-01T08:00:00Z',
  },
  {
    id: 's2',
    author: 'Arjun Mehta',
    title: 'Patna to Kolkata: The Night Rider',
    content:
      'I took the overnight express bus from Patna to Kolkata for the first time. The bus departed exactly on time, which was a pleasant surprise. The Dhanbad rest stop at midnight had surprisingly good chai and samosas. The Asansol bypass stretch was a bit bumpy, but the reclining seats made sleep easy. By 6 AM we were pulling into Howrah Bus Stand with the city just waking up. Would definitely travel this route again.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
    ],
    routeId: 'r101',
    moderationStatus: 'APPROVED',
    createdAt: '2026-03-05T10:30:00Z',
  },
  {
    id: 's3',
    author: 'Priya Nair',
    title: 'Bangalore to Mysore: A Royal Weekend',
    content:
      'The Bangalore–Mysore expressway makes this one of the smoothest bus rides in South India. We passed the Maddur Tiffany stop, famous for its Maddur vadas — an absolute must-eat. Mysore Palace lit up at dusk was worth every kilometre of the journey. The Volvo AC sleeper was clean, on time, and the USB charging actually worked. Perfect weekend getaway from the city hustle.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800',
      'https://images.unsplash.com/photo-1490750967868-88df5691cc02?w=800',
    ],
    routeId: 'r103',
    moderationStatus: 'APPROVED',
    createdAt: '2026-03-07T14:00:00Z',
  },
  {
    id: 's4',
    author: 'Rahul Sharma',
    title: 'Delhi to Manali: Chasing the Snow',
    content:
      'Fourteen hours from Delhi ISBT to Manali, and every hour was an experience in itself. The foothills of Himachal started appearing after Chandigarh, and by Mandi the mountains were enormous. The driver navigated the hairpin bends near Kullu with remarkable confidence. We arrived at dawn with fresh snow dusting the apple orchards. The bus service was punctual and the blankets were thick — crucial at those altitudes.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    ],
    routeId: 'r104',
    moderationStatus: 'APPROVED',
    createdAt: '2026-03-09T07:00:00Z',
  },
  {
    id: 's5',
    author: 'Sneha Iyer',
    title: 'Chennai to Pondicherry: The Coastal Cruise',
    content:
      'The East Coast Road from Chennai to Pondicherry is one of the most scenic drives in India. The bus hugged the Bay of Bengal shoreline for most of the journey, with fishing villages and lighthouse silhouettes dotting the coast. We reached Pondicherry in under 3 hours — the French Quarter was already buzzing with morning cyclists and café aromas. If you ever visit Tamil Nadu, this coastal bus route is unmissable.',
    mediaUrls: [
      'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    ],
    routeId: 'r105',
    moderationStatus: 'APPROVED',
    createdAt: '2026-03-11T09:15:00Z',
  },
];

// ─── Reviews ──────────────────────────────────────────────────────────────────
export const MOCK_REVIEWS: IReview[] = [
  {
    id: 'rev1',
    routeId: 'r101',
    busOperator: 'Patna Express',
    scores: { punctuality: 5, cleanliness: 4, amenities: 5 },
    comment: 'Bus arrived exactly on time. The AC was perfect and the charging ports worked!',
    date: '2026-03-10T10:30:00Z',
    timeDecayWeight: 1.0,
  },
  {
    id: 'rev2',
    routeId: 'r101',
    busOperator: 'Patna Express',
    scores: { punctuality: 4, cleanliness: 5, amenities: 4 },
    comment: 'Very clean interiors. Driver was courteous and played light music.',
    date: '2026-03-08T18:00:00Z',
    timeDecayWeight: 0.95,
  },
  {
    id: 'rev3',
    routeId: 'r102',
    busOperator: 'Konkan Travels',
    scores: { punctuality: 5, cleanliness: 5, amenities: 5 },
    comment: 'Perfect ride through the Ghats! Blankets, water bottles, and snacks provided.',
    date: '2026-03-02T07:00:00Z',
    timeDecayWeight: 0.9,
  },
  {
    id: 'rev4',
    routeId: 'r102',
    busOperator: 'Konkan Travels',
    scores: { punctuality: 3, cleanliness: 4, amenities: 3 },
    comment: 'Departed 30 minutes late but rest of the journey was smooth.',
    date: '2026-02-20T20:00:00Z',
    timeDecayWeight: 0.75,
  },
  {
    id: 'rev5',
    routeId: 'r103',
    busOperator: 'KSRTC Airavat',
    scores: { punctuality: 5, cleanliness: 5, amenities: 4 },
    comment: 'Government bus but world-class service. On-time every single trip.',
    date: '2026-03-07T16:00:00Z',
    timeDecayWeight: 0.98,
  },
  {
    id: 'rev6',
    routeId: 'r103',
    busOperator: 'KSRTC Airavat',
    scores: { punctuality: 4, cleanliness: 4, amenities: 4 },
    comment: 'Good overall. Comfortable seats and professional staff.',
    date: '2026-02-28T11:00:00Z',
    timeDecayWeight: 0.82,
  },
  {
    id: 'rev7',
    routeId: 'r104',
    busOperator: 'Himachal Volvo',
    scores: { punctuality: 4, cleanliness: 3, amenities: 3 },
    comment: 'Mountain routes are challenging but the driver was very skilled.',
    date: '2026-03-09T08:00:00Z',
    timeDecayWeight: 0.99,
  },
  {
    id: 'rev8',
    routeId: 'r104',
    busOperator: 'Himachal Volvo',
    scores: { punctuality: 3, cleanliness: 3, amenities: 2 },
    comment: 'Charging ports did not work. Blankets were thin for the cold.',
    date: '2026-02-15T06:00:00Z',
    timeDecayWeight: 0.65,
  },
  {
    id: 'rev9',
    routeId: 'r105',
    busOperator: 'Tamil Nadu ECR Express',
    scores: { punctuality: 5, cleanliness: 4, amenities: 4 },
    comment: 'Beautiful coastal views throughout. Comfortable and prompt.',
    date: '2026-03-11T10:00:00Z',
    timeDecayWeight: 1.0,
  },
  {
    id: 'rev10',
    routeId: 'r105',
    busOperator: 'Tamil Nadu ECR Express',
    scores: { punctuality: 5, cleanliness: 5, amenities: 5 },
    comment: 'Absolutely flawless journey. Best bus service on the ECR!',
    date: '2026-03-12T15:00:00Z',
    timeDecayWeight: 1.0,
  },
];

// ─── Routes ───────────────────────────────────────────────────────────────────
export const MOCK_ROUTES: IRoute[] = [
  {
    id: 'r101',
    origin: 'Patna',
    destination: 'Kolkata',
    waypoints: [
      { name: 'Dhanbad Rest Stop', lat: 23.795, lng: 86.43 },
      { name: 'Asansol Bypass', lat: 23.673, lng: 86.952 },
      { name: 'Durgapur Toll Plaza', lat: 23.481, lng: 87.311 },
    ],
    trafficIndex: 'High',
    durationHours: 8,
  },
  {
    id: 'r102',
    origin: 'Mumbai',
    destination: 'Goa',
    waypoints: [
      { name: 'Panvel Junction', lat: 18.994, lng: 73.11 },
      { name: 'Kolhapur Dhaba', lat: 16.698, lng: 74.243 },
      { name: 'Sawantwadi Rest Area', lat: 15.9, lng: 73.823 },
    ],
    trafficIndex: 'Medium',
    durationHours: 12,
  },
  {
    id: 'r103',
    origin: 'Bangalore',
    destination: 'Mysore',
    waypoints: [
      { name: 'Bidadi Toll', lat: 12.795, lng: 77.39 },
      { name: 'Maddur Tiffany Stop', lat: 12.586, lng: 77.047 },
      { name: 'Mandya Rest Point', lat: 12.524, lng: 76.895 },
    ],
    trafficIndex: 'Low',
    durationHours: 3,
  },
];
