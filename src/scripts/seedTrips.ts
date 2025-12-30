import mongoose from 'mongoose';
import { config } from 'dotenv';
import path from 'path';
import Trip from '../models/trip.model';

// Load env (works locally; Vercel uses env dashboard)
config({ path: path.join(__dirname, '../../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL;
if (!MONGODB_URI) {
  console.error('❌  MONGODB_URI is not set');
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI as string);
  console.log('✅ Connected to MongoDB');

  const trips = [
    {
      title: '4-Day Akagera Safari & Gorilla Trekking',
      description:
        'Experience Rwanda end-to-end: Big-Five game drives in Akagera National Park followed by an unforgettable gorilla trek in Volcanoes National Park.',
      destination: 'Akagera & Volcanoes NP',
      duration: 4,
      price: 1265,
      maxParticipants: 6,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: [
        'Day 1 – Transfer to Akagera, sunset game drive',
        'Day 2 – Full-day safari (lakes & wetlands)',
        'Day 3 – Drive to Volcanoes NP, cultural village',
        'Day 4 – Early-morning gorilla trekking & return to Kigali',
      ],
      highlights: [
        'Big-Five sightings',
        'Night game drive',
        'Boat safari on Lake Ihema',
        'Gorilla trekking permit included',
      ],
      included: ['Transport', 'Accommodation', 'Park fees', 'Gorilla permit', 'Professional guide'],
      notIncluded: ['Flights', 'Visa fees', 'Personal expenses'],
      difficulty: 'moderate',
      rating: 5,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: '3-Day Safari in Akagera',
      description:
        'Private safari focusing on Akagera’s southern lakes and wetlands including a boat safari and night drive to track nocturnal predators.',
      destination: 'Akagera National Park',
      duration: 3,
      price: 2300,
      maxParticipants: 6,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: [
        'Day 1 – Kigali to Akagera, afternoon boat ride',
        'Day 2 – Dawn & dusk game drives (night drive optional)',
        'Day 3 – Northern plains safari & return to Kigali',
      ],
      highlights: ['Boat ride', 'Night drive', 'Wetland birdlife'],
      included: ['Transport', 'Accommodation', 'Park fees', 'Professional guide'],
      notIncluded: ['Flights', 'Visa fees', 'Personal expenses'],
      difficulty: 'easy',
      rating: 4.7,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: '2-Day Akagera Safari – Night Game Drive',
      description: 'Short safari with special night game drive to spot lions and leopards.',
      destination: 'Akagera National Park',
      duration: 2,
      price: 1200,
      maxParticipants: 6,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: [
        'Day 1 – Mid-morning transfer, sunset safari',
        'Night – Game drive',
        'Day 2 – Morning safari & return',
      ],
      highlights: ['Night predator tracking'],
      included: ['Transport', 'Accommodation', 'Park fees', 'Professional guide'],
      notIncluded: ['Flights', 'Visa fees', 'Personal expenses'],
      difficulty: 'easy',
      rating: 4.5,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: '2-Day Akagera Safari – Boat Ride',
      description: 'Spot hippos & crocodiles on Lake Ihema combined with classic game drives.',
      destination: 'Akagera National Park',
      duration: 2,
      price: 1200,
      maxParticipants: 6,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: [
        'Day 1 – Transfer to Akagera, boat safari',
        'Day 2 – Morning game drive & return',
      ],
      highlights: ['Boat ride on Lake Ihema'],
      included: ['Transport', 'Accommodation', 'Park fees', 'Professional guide'],
      notIncluded: ['Flights', 'Visa fees', 'Personal expenses'],
      difficulty: 'easy',
      rating: 4.3,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: 'Rwanda’s Only Group Safari',
      description: 'Budget-friendly shared safari ideal for solo travellers. Departs 5:30 AM.',
      destination: 'Akagera National Park',
      duration: 1,
      price: 250,
      maxParticipants: 8,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: ['Full-day game drive'],
      highlights: ['Shared cost', 'Ideal for solo travellers'],
      included: ['Transport', 'Guide'],
      notIncluded: ['Lunch', 'Park fees'],
      difficulty: 'easy',
      rating: 4.2,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: 'Akagera SafariShare',
      description: 'Weekend shared safari (Fri–Sun) excluding lunch & park fees.',
      destination: 'Akagera National Park',
      duration: 1,
      price: 100,
      maxParticipants: 8,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: ['12-hour shared safari'],
      highlights: ['Budget option', 'Weekend only'],
      included: ['Transport', 'Guide'],
      notIncluded: ['Lunch', 'Park fees'],
      difficulty: 'easy',
      rating: 4.0,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: '1-Day Private Safari',
      description: 'Personalised full-day journey through the park with private guide & vehicle.',
      destination: 'Akagera National Park',
      duration: 1,
      price: 500,
      maxParticipants: 6,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: ['Full-day private game drive'],
      highlights: ['Private vehicle', 'Flexible schedule'],
      included: ['Transport', 'Guide', 'Water'],
      notIncluded: ['Lunch', 'Park fees'],
      difficulty: 'easy',
      rating: 4.8,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: 'Hot-Air Balloon Safari',
      description: 'Unique 3-hour balloon flight over Akagera at sunrise for spectacular aerial views.',
      destination: 'Akagera National Park',
      duration: 0.125, // 3 hours in days
      price: 400,
      maxParticipants: 16,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: ['Balloon flight', 'Champagne bush breakfast'],
      highlights: ['Aerial views', 'Epic photography'],
      included: ['Flight', 'Bush breakfast', 'Park fees'],
      notIncluded: ['Transfers'],
      difficulty: 'easy',
      rating: 4.9,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
    {
      title: 'Wilderness Camping Safari',
      description: 'Overnight camping at Shakani or Mutumba sites under the Rwandan stars.',
      destination: 'Akagera National Park',
      duration: 2,
      price: 990,
      maxParticipants: 6,
      currentParticipants: 0,
      startDate: new Date(),
      endDate: new Date(),
      itinerary: ['Day 1 – Southern circuit & camp setup', 'Day 2 – Northern safari & return'],
      highlights: ['Camping under stars'],
      included: ['Tents', 'Meals', 'Transport', 'Guide', 'Park fees'],
      notIncluded: ['Sleeping bags'],
      difficulty: 'moderate',
      rating: 4.6,
      reviews: 0,
      status: 'active',
      createdBy: 'seed-script',
    },
  ];

  for (const trip of trips) {
    await Trip.updateOne({ title: trip.title }, trip, { upsert: true });
  }

  console.log('🚀 Trips seeded/updated');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
