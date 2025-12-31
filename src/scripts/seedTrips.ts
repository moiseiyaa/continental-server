import { pool } from '../config/db';
import { config } from 'dotenv';

// Load environment variables (works locally; Vercel uses env dashboard)
config();

interface TripSeed {
  title: string;
  description: string;
  destination: string;
  duration: number; // in days
  price: number; // USD
  max_participants: number;
  current_participants: number;
  status: string;
}

// NOTE: Some trips were provided without explicit prices. Those are seeded with price = 0.0; update as needed.
const TRIPS: TripSeed[] = [
  {
    title: 'Akagera SafariShare (Group Tour)',
    description: 'A budget-friendly shared game drive departing from Kigali every Friday, Saturday, and Sunday.',
    destination: 'Akagera National Park',
    duration: 1,
    price: 100,
    max_participants: 8,
    current_participants: 0,
    status: 'active',
  },
  {
    title: 'Safari Car (Private Tour)',
    description: 'A private day trip in a custom 4x4 safari vehicle with a pop-up roof.',
    destination: 'Akagera National Park',
    duration: 1,
    price: 400,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: 'Akagera Safari in Landcruiser V8',
    description: 'A premium private day trip using a luxury V8 vehicle for maximum comfort on bumpy terrain.',
    destination: 'Akagera National Park',
    duration: 1,
    price: 450,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: 'Akagera Wilderness Camping Safari Adventure',
    description: 'A 2-day immersive experience sleeping in the wild under the stars.',
    destination: 'Akagera National Park',
    duration: 2,
    price: 990,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '2 Days Cultural Village & Gorilla Trekking',
    description: 'Combines Rwanda’s royal history with the iconic gorilla trek.',
    destination: 'Volcanoes National Park',
    duration: 2,
    price: 0,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '3 Days Gorilla & Golden Monkey Trekking',
    description: 'Focuses on the two most endangered primates in the Virunga Mountains.',
    destination: 'Volcanoes National Park',
    duration: 3,
    price: 3240,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '4 Days Gorilla & Golden Monkey Trekking',
    description: 'Extended Gorilla & Golden Monkey trekking experience with additional scenic activities.',
    destination: 'Volcanoes National Park',
    duration: 4,
    price: 2985,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '4 Days Akagera Safari & Gorilla Trekking',
    description: 'Combines Akagera savannah wildlife with Volcanoes NP gorilla trekking. Luxury upgrade available (USD 3,850).',
    destination: 'Akagera & Volcanoes NP',
    duration: 4,
    price: 1265,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '6 Days Rwanda Safari (5-Star Luxury)',
    description: 'A luxury safari covering Akagera and Nyungwe National Parks with high-end lodges.',
    destination: 'Rwanda',
    duration: 6,
    price: 1920,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '7 Days Kenya Classic Featuring Safari (5-Star)',
    description: 'Experience Lake Nakuru’s rhinos & flamingos and Masai Mara’s wildlife spectacle with five-star comfort.',
    destination: 'Kenya',
    duration: 7,
    price: 3315,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '8 Days Kenya Under Canvas (5-Star)',
    description: 'An exclusive tented luxury camping safari through Amboseli, Lake Nakuru, Naivasha, and Masai Mara.',
    destination: 'Kenya',
    duration: 8,
    price: 2188,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
  {
    title: '8 Days Colobus Monkey Trekking & Safari',
    description: 'Covers Kigali, Akagera savannah, Lake Kivu beach, Nyungwe colobus & chimps, and Volcanoes NP gorillas.',
    destination: 'Rwanda',
    duration: 8,
    price: 0,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
  },
];

async function seed(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing trips
    await client.query('TRUNCATE TABLE trips RESTART IDENTITY CASCADE');
    console.log('✅ Cleared existing trips');

    // Insert trips
    for (const trip of TRIPS) {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + trip.duration * 24 * 60 * 60 * 1000);

      await client.query(
        `INSERT INTO trips (
          title, description, destination, duration, price,
          max_participants, current_participants, start_date, end_date,
          status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())`,
        [
          trip.title,
          trip.description,
          trip.destination,
          trip.duration,
          trip.price,
          trip.max_participants,
          trip.current_participants,
          startDate,
          endDate,
          trip.status,
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`🚀 Seeded ${TRIPS.length} trips`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed trips:', error);
  } finally {
    client.release();
    await pool.end();
    process.exit(0);
  }
}

seed();
/*{
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
          },
  ];

  for (const trip of trips) {
    await Trip.updateOne({ title: trip.title }, trip, { upsert: true, strict:false });
  }

  console.log('🚀 Trips seeded/updated');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
*/
