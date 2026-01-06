import { pool } from '../config/db';
import { config } from 'dotenv';

// Load environment variables (works locally; Vercel uses env dashboard)
config();

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

interface TripSeed {
  title: string;
  description: string;
  destination: string;
  duration: number; // in days
  price: number; // USD
  max_participants: number;
  current_participants: number;
  status: string;
  detailed_itinerary?: DayItinerary[];
  activities?: string[];
  images?: string[];
  insurance?: string;
}

// NOTE: Some trips were provided without explicit prices. Those are seeded with price = 0.0; update as needed.
const TRIPS: TripSeed[] = [
  {
    title: 'Akagera SafariShare (Group Tour)',
    description: 'A budget-friendly, social safari designed for solo travelers or small groups. It utilizes shared transport to keep costs low while exploring Rwanda\'s only Big Five park.',
    destination: 'Akagera National Park',
    duration: 1,
    price: 100,
    max_participants: 8,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Full Day Safari Adventure',
        description: 'Pick up from Kigali at 05:00 AM. Entry at Akagera South Gate. Full-day game drive searching for lions, rhinos, and giraffes. Picnic lunch. Exit via North Gate. Return to Kigali by evening.',
        activities: [
          'Game drive through savannah plains',
          'Wildlife spotting (lions, rhinos, giraffes)',
          'Bird watching',
          'Photography opportunities',
          'Scenic views of rolling hills'
        ],
        meals: ['Picnic lunch'],
        accommodation: 'N/A (Day trip)'
      }
    ],
    activities: [
      'Game drive in shared 4x4 safari vehicle',
      'Big Five wildlife viewing',
      'Bird watching',
      'Photography sessions',
      'Professional guide services'
    ],
    images: [
      '/images/trips/akagera-safarishare-hero.jpg',
      '/images/trips/akagera-safarishare-1.jpg',
      '/images/trips/akagera-safarishare-2.jpg',
      '/images/trips/akagera-safarishare-3.jpg',
      '/images/trips/akagera-safarishare-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: 'Safari Car (Private Day Tour)',
    description: 'A private, high-flexibility tour in a custom-built 4x4 safari vehicle with a pop-up roof for 360-degree photography.',
    destination: 'Akagera National Park',
    duration: 1,
    price: 400,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Private Safari Experience',
        description: 'Private hotel pick-up. Scenic 2.5-hour drive to the park. Full-circuit game drive from South to North. Lake Ihema views. Personalized wildlife tracking with a professional guide. Late afternoon return to Kigali.',
        activities: [
          'Private 4x4 safari vehicle with pop-up roof',
          '360-degree photography opportunities',
          'Full-circuit game drive (South to North)',
          'Lake Ihema scenic views',
          'Personalized wildlife tracking',
          'Professional guide services'
        ],
        meals: ['Lunch (included)'],
        accommodation: 'N/A (Day trip)'
      }
    ],
    activities: [
      'Private custom-built 4x4 safari vehicle',
      'Pop-up roof for 360-degree photography',
      'Full-circuit game drive',
      'Lake Ihema views',
      'Personalized wildlife tracking',
      'Professional guide'
    ],
    images: [
      '/images/trips/safari-car-private-hero.jpg',
      '/images/trips/safari-car-private-1.jpg',
      '/images/trips/safari-car-private-2.jpg',
      '/images/trips/safari-car-private-3.jpg',
      '/images/trips/safari-car-private-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: 'Akagera Safari in Landcruiser V8',
    description: 'A luxury day safari focused on comfort. The Landcruiser V8 offers superior suspension and air conditioning, making it ideal for families or those sensitive to rough terrain.',
    destination: 'Akagera National Park',
    duration: 1,
    price: 450,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Luxury Safari Experience',
        description: 'Luxury V8 transfer to Akagera. Full-day private game drive. Guided exploration of the park\'s diverse ecosystems (wetlands, savannah, and woodland). Return to Kigali in premium comfort.',
        activities: [
          'Luxury Landcruiser V8 transfer',
          'Full-day private game drive',
          'Guided exploration of diverse ecosystems',
          'Wetlands, savannah, and woodland viewing',
          'Wildlife photography',
          'Premium comfort experience'
        ],
        meals: ['Lunch (included)'],
        accommodation: 'N/A (Day trip)'
      }
    ],
    activities: [
      'Luxury Landcruiser V8 vehicle',
      'Superior suspension and air conditioning',
      'Full-day private game drive',
      'Diverse ecosystem exploration',
      'Professional guide',
      'Premium comfort experience'
    ],
    images: [
      '/images/trips/akagera-landcruiser-v8-hero.jpg',
      '/images/trips/akagera-landcruiser-v8-1.jpg',
      '/images/trips/akagera-landcruiser-v8-2.jpg',
      '/images/trips/akagera-landcruiser-v8-3.jpg',
      '/images/trips/akagera-landcruiser-v8-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: 'Akagera Wilderness Camping Safari Adventure',
    description: 'A 2-day immersive experience for nature lovers, combining wildlife viewing with an overnight stay in a wilderness camp under the stars.',
    destination: 'Akagera National Park',
    duration: 2,
    price: 990,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Kigali to Akagera & Boat Safari',
        description: 'Kigali to Akagera. Afternoon boat safari on Lake Ihema (hippos/crocodiles). Evening campfire and dinner. Overnight at Mutumba or Shakani campsite.',
        activities: [
          'Transfer from Kigali to Akagera',
          'Afternoon boat safari on Lake Ihema',
          'Hippo and crocodile viewing',
          'Evening campfire',
          'Wilderness camping experience'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Mutumba or Shakani campsite (wilderness camping)'
      },
      {
        day: 2,
        title: 'Early Morning Game Drive & Return',
        description: 'Early morning game drive (best for spotting predators). Continued exploration of the northern plains. Late afternoon drive back to Kigali.',
        activities: [
          'Early morning game drive',
          'Predator spotting',
          'Northern plains exploration',
          'Wildlife photography',
          'Return to Kigali'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Return to Kigali)'
      }
    ],
    activities: [
      'Boat safari on Lake Ihema',
      'Hippo and crocodile viewing',
      'Wilderness camping under the stars',
      'Early morning game drive',
      'Predator spotting',
      'Northern plains exploration',
      'Campfire experience'
    ],
    images: [
      '/images/trips/akagera-camping-hero.jpg',
      '/images/trips/akagera-camping-1.jpg',
      '/images/trips/akagera-camping-2.jpg',
      '/images/trips/akagera-camping-3.jpg',
      '/images/trips/akagera-camping-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '2 Days Cultural Village & Gorilla Trekking',
    description: 'A blend of Rwanda\'s royal history and its most famous wildlife encounter.',
    destination: 'Volcanoes National Park',
    duration: 2,
    price: 0,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Cultural Village Visit',
        description: 'Visit the King\'s Palace Museum in Nyanza. Transfer to Musanze (Volcanoes National Park).',
        activities: [
          'Visit King\'s Palace Museum in Nyanza',
          'Learn about Rwanda\'s royal history',
          'Transfer to Musanze',
          'Cultural immersion experience'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Musanze'
      },
      {
        day: 2,
        title: 'Gorilla Trekking & Cultural Village',
        description: 'Mountain Gorilla Trekking (early morning). Visit Gorilla Guardians Cultural Village. Return to Kigali.',
        activities: [
          'Mountain Gorilla Trekking',
          'Visit Gorilla Guardians Cultural Village',
          'Cultural performances',
          'Wildlife photography',
          'Return to Kigali'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Return to Kigali)'
      }
    ],
    activities: [
      'King\'s Palace Museum visit',
      'Cultural village experience',
      'Mountain Gorilla Trekking',
      'Gorilla Guardians Cultural Village',
      'Cultural performances',
      'Professional guide services'
    ],
    images: [
      '/images/trips/cultural-gorilla-trek-hero.jpg',
      '/images/trips/cultural-gorilla-trek-1.jpg',
      '/images/trips/cultural-gorilla-trek-2.jpg',
      '/images/trips/cultural-gorilla-trek-3.jpg',
      '/images/trips/cultural-gorilla-trek-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '3 Days Gorilla & Golden Monkey Trekking',
    description: 'A deep dive into the primates of the Virunga Mountains, covering both the Mountain Gorillas and the rare Golden Monkeys.',
    destination: 'Volcanoes National Park',
    duration: 3,
    price: 3240,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Transfer to Musanze',
        description: 'Transfer from Kigali to Musanze. Evening relaxation at a mountain lodge.',
        activities: [
          'Transfer from Kigali to Musanze',
          'Scenic drive through the Virunga Mountains',
          'Evening relaxation',
          'Mountain lodge experience'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Musanze'
      },
      {
        day: 2,
        title: 'Gorilla Trekking & Cultural Experience',
        description: 'Gorilla Trekking (high-altitude forest). Afternoon cultural experience.',
        activities: [
          'Mountain Gorilla Trekking',
          'High-altitude forest exploration',
          'Gorilla family encounters',
          'Afternoon cultural experience',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Musanze'
      },
      {
        day: 3,
        title: 'Golden Monkey Trekking & Return',
        description: 'Golden Monkey Trekking. Scenic lunch. Return to Kigali.',
        activities: [
          'Golden Monkey Trekking',
          'Rare primate encounters',
          'Scenic lunch',
          'Wildlife photography',
          'Return to Kigali'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Return to Kigali)'
      }
    ],
    activities: [
      'Mountain Gorilla Trekking',
      'Golden Monkey Trekking',
      'High-altitude forest exploration',
      'Cultural experiences',
      'Wildlife photography',
      'Professional guide services'
    ],
    images: [
      '/images/trips/gorilla-golden-monkey-hero.jpg',
      '/images/trips/gorilla-golden-monkey-1.jpg',
      '/images/trips/gorilla-golden-monkey-2.jpg',
      '/images/trips/gorilla-golden-monkey-3.jpg',
      '/images/trips/gorilla-golden-monkey-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '4 Days Gorilla & Golden Monkey Trekking',
    description: 'An extended primate tour that includes time for history and reflection in the capital city.',
    destination: 'Volcanoes National Park',
    duration: 4,
    price: 2985,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival & Kigali City Tour',
        description: 'Arrival & Kigali City Tour (Genocide Memorial). Transfer to Volcanoes NP.',
        activities: [
          'Kigali City Tour',
          'Genocide Memorial visit',
          'Historical reflection',
          'Transfer to Volcanoes NP',
          'Cultural immersion'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Volcanoes NP'
      },
      {
        day: 2,
        title: 'Gorilla Trekking',
        description: 'Gorilla Trekking in the bamboo forests.',
        activities: [
          'Gorilla Trekking in bamboo forests',
          'Mountain Gorilla encounters',
          'Forest exploration',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Volcanoes NP'
      },
      {
        day: 3,
        title: 'Golden Monkey Trekking & Twin Lakes',
        description: 'Golden Monkey Trekking. Visit to the Twin Lakes (Burera & Ruhondo).',
        activities: [
          'Golden Monkey Trekking',
          'Rare primate encounters',
          'Visit Twin Lakes (Burera & Ruhondo)',
          'Scenic lake views',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Volcanoes NP'
      },
      {
        day: 4,
        title: 'Leisurely Departure',
        description: 'Leisurely breakfast. Final photography opportunities. Transfer to Kigali airport.',
        activities: [
          'Leisurely breakfast',
          'Final photography opportunities',
          'Scenic views',
          'Transfer to Kigali airport'
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Kigali City Tour',
      'Genocide Memorial visit',
      'Gorilla Trekking in bamboo forests',
      'Golden Monkey Trekking',
      'Twin Lakes visit (Burera & Ruhondo)',
      'Cultural experiences',
      'Wildlife photography',
      'Professional guide services'
    ],
    images: [
      '/images/trips/gorilla-golden-monkey-4days-hero.jpg',
      '/images/trips/gorilla-golden-monkey-4days-1.jpg',
      '/images/trips/gorilla-golden-monkey-4days-2.jpg',
      '/images/trips/gorilla-golden-monkey-4days-3.jpg',
      '/images/trips/gorilla-golden-monkey-4days-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '4 Days Akagera Safari & Gorilla Trekking',
    description: 'The ultimate "Rwanda in a Nutshell" tour, covering both the savannah Big Five and the mountain gorillas.',
    destination: 'Akagera & Volcanoes NP',
    duration: 4,
    price: 1265,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival and Kigali Eco-tour',
        description: 'Arrival and Kigali Eco-tour.',
        activities: [
          'Kigali arrival',
          'Eco-tour of Kigali',
          'City exploration',
          'Cultural immersion'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Hotel in Kigali'
      },
      {
        day: 2,
        title: 'Full-day Game Drive in Akagera',
        description: 'Full-day Game Drive in Akagera National Park.',
        activities: [
          'Full-day game drive in Akagera',
          'Big Five wildlife viewing',
          'Savannah exploration',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Akagera National Park'
      },
      {
        day: 3,
        title: 'Transfer to Volcanoes National Park',
        description: 'Transfer across the country to Volcanoes National Park.',
        activities: [
          'Scenic transfer to Volcanoes NP',
          'Cross-country journey',
          'Mountain views',
          'Cultural stops along the way'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mountain lodge in Volcanoes NP'
      },
      {
        day: 4,
        title: 'Gorilla Trekking & Return',
        description: 'Gorilla Trekking. Afternoon transfer to Kigali.',
        activities: [
          'Mountain Gorilla Trekking',
          'Gorilla family encounters',
          'Forest exploration',
          'Wildlife photography',
          'Return to Kigali'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Return to Kigali)'
      }
    ],
    activities: [
      'Kigali Eco-tour',
      'Full-day game drive in Akagera',
      'Big Five wildlife viewing',
      'Mountain Gorilla Trekking',
      'Cross-country transfer',
      'Wildlife photography',
      'Professional guide services'
    ],
    images: [
      '/images/trips/akagera-gorilla-combo-hero.jpg',
      '/images/trips/akagera-gorilla-combo-1.jpg',
      '/images/trips/akagera-gorilla-combo-2.jpg',
      '/images/trips/akagera-gorilla-combo-3.jpg',
      '/images/trips/akagera-gorilla-combo-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '6 Days Rwanda Safari (5-Star Luxury)',
    description: 'A luxury expedition through Rwanda\'s diverse landscapes, from the eastern plains to the southwestern rainforests.',
    destination: 'Rwanda',
    duration: 6,
    price: 1920,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Akagera National Park - Arrival',
        description: 'Arrival in Akagali. Transfer to Akagera National Park. Afternoon game drive.',
        activities: [
          'Transfer to Akagera National Park',
          'Afternoon game drive',
          'Wildlife viewing',
          'Lodge check-in'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Akagera'
      },
      {
        day: 2,
        title: 'Akagera - Private Game Drives & Boat Trip',
        description: 'Private game drives and Lake Ihema boat trip.',
        activities: [
          'Private game drives',
          'Lake Ihema boat trip',
          'Big Five wildlife viewing',
          'Bird watching',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Akagera'
      },
      {
        day: 3,
        title: 'Transfer to Nyungwe National Park',
        description: 'Transfer to Nyungwe National Park.',
        activities: [
          'Scenic transfer to Nyungwe',
          'Cross-country journey',
          'Rainforest views',
          'Cultural stops'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Nyungwe'
      },
      {
        day: 4,
        title: 'Chimpanzee Trekking & Canopy Walkway',
        description: 'Chimpanzee Trekking and Canopy Walkway (60m above the forest).',
        activities: [
          'Chimpanzee Trekking',
          'Canopy Walkway (60m above forest)',
          'Rainforest exploration',
          'Primate encounters',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Nyungwe'
      },
      {
        day: 5,
        title: 'Hiking in Bigugu or Kamiranzovu Swamp',
        description: 'Hiking in Bigugu or Kamiranzovu Swamp.',
        activities: [
          'Hiking in Bigugu or Kamiranzovu Swamp',
          'Rainforest hiking',
          'Bird watching',
          'Nature photography',
          'Ecosystem exploration'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Nyungwe'
      },
      {
        day: 6,
        title: 'Return via Ethnographic Museum',
        description: 'Return to Kigali via the ethnographic museum in Huye.',
        activities: [
          'Visit ethnographic museum in Huye',
          'Cultural learning',
          'Scenic return journey',
          'Transfer to Kigali'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Return to Kigali)'
      }
    ],
    activities: [
      'Private game drives in Akagera',
      'Lake Ihema boat trip',
      'Big Five wildlife viewing',
      'Chimpanzee Trekking',
      'Canopy Walkway (60m above forest)',
      'Hiking in Bigugu or Kamiranzovu Swamp',
      'Ethnographic museum visit',
      'Wildlife photography',
      'Professional guide services'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '7 Days Kenya Classic Featuring Safari (5-Star)',
    description: 'A premium, high-end safari focusing on the very best of Kenya with top-tier lodge stays.',
    destination: 'Kenya',
    duration: 7,
    price: 3315,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Nairobi Arrival',
        description: 'Nairobi arrival.',
        activities: [
          'Nairobi arrival',
          'Airport transfer',
          'Hotel check-in',
          'Briefing session'
        ],
        meals: ['Dinner'],
        accommodation: '5-Star hotel in Nairobi'
      },
      {
        day: 2,
        title: 'Maasai Mara - Extensive Game Drives',
        description: 'Transfer to Maasai Mara. Extensive game drives in a private 4x4.',
        activities: [
          'Transfer to Maasai Mara',
          'Extensive game drives',
          'Private 4x4 safari vehicle',
          'Wildlife viewing',
          'Big cat spotting'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Maasai Mara'
      },
      {
        day: 3,
        title: 'Maasai Mara - Full Day Safari',
        description: 'Full day in Maasai Mara. Extensive game drives in a private 4x4.',
        activities: [
          'Full-day game drives',
          'Big cat encounters',
          'Great Migration viewing (seasonal)',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge in Maasai Mara'
      },
      {
        day: 4,
        title: 'Lake Nakuru - Birdwatching & Rhino Sanctuary',
        description: 'Transfer to Lake Nakuru. Birdwatching and rhino sanctuary visit.',
        activities: [
          'Transfer to Lake Nakuru',
          'Birdwatching (flamingos)',
          'Rhino sanctuary visit',
          'Wildlife viewing',
          'Photography opportunities'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge at Lake Nakuru'
      },
      {
        day: 5,
        title: 'Lake Nakuru - Full Day Exploration',
        description: 'Full day at Lake Nakuru. Birdwatching and rhino sanctuary visit.',
        activities: [
          'Full-day exploration',
          'Flamingo viewing',
          'Rhino encounters',
          'Bird watching',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star lodge at Lake Nakuru'
      },
      {
        day: 6,
        title: 'Return to Nairobi',
        description: 'Return to Nairobi. Farewell dinner at The Carnivore.',
        activities: [
          'Return to Nairobi',
          'Farewell dinner at The Carnivore',
          'Cultural dining experience',
          'Evening relaxation'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star hotel in Nairobi'
      },
      {
        day: 7,
        title: 'Departure',
        description: 'Departure.',
        activities: [
          'Hotel checkout',
          'Airport transfer',
          'Departure'
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Extensive game drives in Maasai Mara',
      'Private 4x4 safari vehicle',
      'Big cat encounters',
      'Great Migration viewing (seasonal)',
      'Birdwatching at Lake Nakuru',
      'Rhino sanctuary visit',
      'Flamingo viewing',
      'Farewell dinner at The Carnivore',
      'Wildlife photography',
      'Professional guide services'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '8 Days Kenya Under Canvas (5-Star)',
    description: 'A luxury tented camp safari through Kenya\'s most iconic reserves, offering an authentic "out of Africa" feel.',
    destination: 'Kenya',
    duration: 8,
    price: 2188,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Amboseli NP - Arrival',
        description: 'Arrival in Amboseli NP. Views of Mt. Kilimanjaro and massive elephant herds.',
        activities: [
          'Arrival in Amboseli NP',
          'Views of Mt. Kilimanjaro',
          'Massive elephant herd viewing',
          'Game drive',
          'Luxury tented camp check-in'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp in Amboseli'
      },
      {
        day: 2,
        title: 'Amboseli NP - Full Day Safari',
        description: 'Full day in Amboseli NP. Views of Mt. Kilimanjaro and massive elephant herds.',
        activities: [
          'Full-day game drives',
          'Mt. Kilimanjaro views',
          'Elephant herd encounters',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp in Amboseli'
      },
      {
        day: 3,
        title: 'Lake Nakuru & Naivasha - Transfer',
        description: 'Transfer to Lake Nakuru & Naivasha. Flamingos, rhinos, and boat safaris.',
        activities: [
          'Transfer to Lake Nakuru & Naivasha',
          'Flamingo viewing',
          'Rhino encounters',
          'Boat safaris',
          'Wildlife viewing'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp at Lake Nakuru'
      },
      {
        day: 4,
        title: 'Lake Nakuru & Naivasha - Full Day',
        description: 'Full day at Lake Nakuru & Naivasha. Flamingos, rhinos, and boat safaris.',
        activities: [
          'Full-day exploration',
          'Flamingo viewing',
          'Rhino sanctuary visit',
          'Boat safaris on Lake Naivasha',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp at Lake Nakuru'
      },
      {
        day: 5,
        title: 'Maasai Mara - Arrival',
        description: 'Transfer to Maasai Mara. Three full days in the world\'s most famous wildlife arena, searching for big cats and the Great Migration.',
        activities: [
          'Transfer to Maasai Mara',
          'Game drive',
          'Big cat searching',
          'Great Migration viewing (seasonal)',
          'Wildlife encounters'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp in Maasai Mara'
      },
      {
        day: 6,
        title: 'Maasai Mara - Full Day Safari',
        description: 'Full day in Maasai Mara. Searching for big cats and the Great Migration.',
        activities: [
          'Full-day game drives',
          'Big cat encounters',
          'Great Migration viewing (seasonal)',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp in Maasai Mara'
      },
      {
        day: 7,
        title: 'Maasai Mara - Full Day Safari',
        description: 'Full day in Maasai Mara. Searching for big cats and the Great Migration.',
        activities: [
          'Full-day game drives',
          'Big cat encounters',
          'Great Migration viewing (seasonal)',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: '5-Star luxury tented camp in Maasai Mara'
      },
      {
        day: 8,
        title: 'Maasai Mara - Departure',
        description: 'Final game drive. Return to Nairobi. Departure.',
        activities: [
          'Final game drive',
          'Last wildlife viewing',
          'Return to Nairobi',
          'Airport transfer',
          'Departure'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Views of Mt. Kilimanjaro',
      'Massive elephant herd viewing',
      'Flamingo viewing at Lake Nakuru',
      'Rhino encounters',
      'Boat safaris on Lake Naivasha',
      'Big cat encounters in Maasai Mara',
      'Great Migration viewing (seasonal)',
      'Luxury tented camp experience',
      'Wildlife photography',
      'Professional guide services'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
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
  {
    title: '8 Days Tanzania Under Canvas (5-Star)',
    description: 'This is a high-end, 5-star luxury safari that offers an authentic African experience by staying in premium tented camps "under canvas". The tour is designed to provide an immersive connection with nature while maintaining maximum comfort and service.',
    destination: 'Tanzania',
    duration: 8,
    price: 2495,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival & Transfer to Tarangire National Park',
        description: 'Arrival in Tanzania. Transfer to Tarangire National Park. Known for its massive baobab trees and large elephant herds. Afternoon game drive. Check-in to premium tented camp.',
        activities: [
          'Airport arrival and transfer',
          'Afternoon game drive in Tarangire',
          'Elephant herd viewing',
          'Baobab tree photography',
          'Wildlife spotting',
          'Premium tented camp check-in'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Premium tented camp in Tarangire'
      },
      {
        day: 2,
        title: 'Full Day in Tarangire National Park',
        description: 'Full day exploring Tarangire National Park. Known for its massive baobab trees and large elephant herds. Morning and afternoon game drives.',
        activities: [
          'Morning game drive',
          'Elephant herd encounters',
          'Baobab tree exploration',
          'Afternoon game drive',
          'Wildlife photography',
          'Bird watching'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium tented camp in Tarangire'
      },
      {
        day: 3,
        title: 'Lake Manyara National Park',
        description: 'Transfer to Lake Manyara National Park. A scenic park famous for its tree-climbing lions and diverse birdlife. Full day game drive.',
        activities: [
          'Transfer to Lake Manyara',
          'Tree-climbing lion spotting',
          'Diverse birdlife viewing',
          'Scenic lake views',
          'Game drive',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium tented camp at Lake Manyara'
      },
      {
        day: 4,
        title: 'Ngorongoro Crater',
        description: 'Transfer to Ngorongoro Crater. A UNESCO World Heritage site and "natural amphitheater" providing some of the best wildlife viewing in Africa within the caldera of an extinct volcano. Full day crater exploration.',
        activities: [
          'Transfer to Ngorongoro Crater',
          'Crater descent',
          'UNESCO World Heritage site visit',
          'Exceptional wildlife viewing',
          'Big Five encounters',
          'Crater rim views',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium tented camp on Ngorongoro Crater rim'
      },
      {
        day: 5,
        title: 'Serengeti National Park - Arrival',
        description: 'Transfer to Serengeti National Park. Three full days dedicated to the vast plains of the Serengeti, home to the Great Migration and a high concentration of big cats. Afternoon game drive.',
        activities: [
          'Transfer to Serengeti',
          'Afternoon game drive',
          'Great Migration viewing (seasonal)',
          'Big cat encounters',
          'Vast plains exploration',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium tented camp in Serengeti'
      },
      {
        day: 6,
        title: 'Serengeti - Full Day Safari',
        description: 'Full day in Serengeti National Park. Dedicated to the vast plains of the Serengeti, home to the Great Migration and a high concentration of big cats.',
        activities: [
          'Full-day game drives',
          'Great Migration viewing (seasonal)',
          'Big cat encounters (lions, leopards, cheetahs)',
          'Vast plains exploration',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium tented camp in Serengeti'
      },
      {
        day: 7,
        title: 'Serengeti - Full Day Safari',
        description: 'Full day in Serengeti National Park. Dedicated to the vast plains of the Serengeti, home to the Great Migration and a high concentration of big cats.',
        activities: [
          'Full-day game drives',
          'Great Migration viewing (seasonal)',
          'Big cat encounters',
          'Vast plains exploration',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Premium tented camp in Serengeti'
      },
      {
        day: 8,
        title: 'Final Game Drive & Departure',
        description: 'Final morning game drive followed by a transfer back for your outbound flight.',
        activities: [
          'Final morning game drive',
          'Last wildlife viewing',
          'Transfer to airport',
          'Departure'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Premium tented camp accommodation',
      'Game drives in Tarangire National Park',
      'Elephant herd viewing',
      'Baobab tree exploration',
      'Tree-climbing lion spotting at Lake Manyara',
      'Ngorongoro Crater exploration',
      'UNESCO World Heritage site visit',
      'Serengeti National Park game drives',
      'Great Migration viewing (seasonal)',
      'Big cat encounters',
      'Wildlife photography',
      'Professional guide services',
      '5-star luxury service'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '3 Days Gorilla Express via Kampala',
    description: 'This express safari is designed for those with limited time who still want a focused encounter with mountain gorillas in Bwindi Impenetrable National Park. It involves a scenic drive across the equator and through the "Switzerland of Africa" highlands.',
    destination: 'Uganda',
    duration: 3,
    price: 0,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Departure from Kampala/Entebbe to Bwindi',
        description: 'Depart from Kampala or Entebbe and drive southwest. Stop at the Equator for photos and proceed through Savannah grasslands and banana plantations to Bwindi.',
        activities: [
          'Scenic drive from Kampala/Entebbe',
          'Equator crossing and photo stop',
          'Drive through Savannah grasslands',
          'Banana plantation views',
          'Arrival at Bwindi Impenetrable National Park',
          'Lodge check-in'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Lodge near Bwindi Impenetrable National Park'
      },
      {
        day: 2,
        title: 'Gorilla Tracking Adventure',
        description: 'Enter the forest at dawn for gorilla tracking after a briefing from park guides. Spend one hour observing a gorilla family in their natural habitat.',
        activities: [
          'Early morning briefing at park headquarters',
          'Gorilla tracking in Bwindi Impenetrable Forest',
          'One hour observing gorilla family',
          'Forest trekking',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge near Bwindi Impenetrable National Park'
      },
      {
        day: 3,
        title: 'Return to Kampala/Entebbe',
        description: 'After breakfast, depart Bwindi and drive back to Kampala or Entebbe for your departure or a brief city tour.',
        activities: [
          'Scenic drive back to Kampala/Entebbe',
          'Optional city tour',
          'Departure or extended stay'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Gorilla trekking in Bwindi Impenetrable National Park',
      'Equator crossing experience',
      'Scenic drive through highlands',
      'Wildlife photography',
      'Professional guide services',
      'Gorilla family observation'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '3 Days Gorilla Fly-In Express',
    description: 'A premium, time-saving option that avoids the long 9-hour drive from Kampala by using domestic flights to reach the gorilla highlands.',
    destination: 'Uganda',
    duration: 3,
    price: 2420,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Fly to Gorilla Highlands & Community Walk',
        description: 'Fly from Entebbe International Airport to Kihihi or Kisoro Airstrip. Transfer to your lodge for lunch and enjoy an optional afternoon community walk to meet the local Batwa people.',
        activities: [
          'Domestic flight from Entebbe to Kihihi/Kisoro',
          'Airport transfer to lodge',
          'Lodge check-in',
          'Optional Batwa community walk',
          'Cultural interaction with local people',
          'Forest lodge experience'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Lodge in gorilla highlands'
      },
      {
        day: 2,
        title: 'Gorilla Tracking Adventure',
        description: 'Early morning transfer to park headquarters for a briefing. Embark on your gorilla tracking adventure, which can last from 2 to 6 hours.',
        activities: [
          'Early morning transfer to park headquarters',
          'Gorilla tracking briefing',
          'Gorilla tracking adventure (2-6 hours)',
          'Gorilla family observation',
          'Forest trekking',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in gorilla highlands'
      },
      {
        day: 3,
        title: 'Return Flight to Entebbe',
        description: 'Enjoy a final breakfast in the forest before your return flight to Entebbe.',
        activities: [
          'Final breakfast at lodge',
          'Transfer to airstrip',
          'Return flight to Entebbe',
          'Departure'
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Domestic flights (Entebbe to Kihihi/Kisoro and return)',
      'Gorilla trekking in Bwindi Impenetrable National Park',
      'Batwa community cultural walk',
      'Wildlife photography',
      'Professional guide services',
      'Time-saving express option'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '12 Days Gorilla, Rhinos, Chimpanzee Trekking & Water Safari',
    description: 'The most comprehensive Ugandan expedition, covering the "Big Five," primates, and river-based adventures across the country\'s diverse national parks.',
    destination: 'Uganda',
    duration: 12,
    price: 6254,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival in Entebbe',
        description: 'Arrival at Entebbe and transfer to your hotel.',
        activities: [
          'Airport arrival',
          'Transfer to hotel',
          'Rest and acclimatization'
        ],
        meals: ['Dinner'],
        accommodation: 'Hotel in Entebbe'
      },
      {
        day: 2,
        title: 'White-Water Rafting on the Nile',
        description: 'Drive to Jinja for white-water rafting on the Nile.',
        activities: [
          'Transfer to Jinja',
          'White-water rafting on the Nile',
          'Adventure water sports',
          'Nile River experience'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Jinja'
      },
      {
        day: 3,
        title: 'Rhino Tracking & Transfer to Murchison Falls',
        description: 'Transfer to Ziwa Rhino Sanctuary for on-foot rhino tracking, then proceed to Murchison Falls National Park.',
        activities: [
          'Transfer to Ziwa Rhino Sanctuary',
          'On-foot rhino tracking',
          'Rhino conservation experience',
          'Transfer to Murchison Falls National Park',
          'Park entry and check-in'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Murchison Falls National Park'
      },
      {
        day: 4,
        title: 'Murchison Falls Game Drive & Boat Cruise',
        description: 'Morning game drive in Murchison Falls followed by an afternoon boat cruise to the base of the world\'s most powerful waterfall.',
        activities: [
          'Morning game drive',
          'Wildlife viewing',
          'Afternoon boat cruise',
          'Murchison Falls viewing',
          'World\'s most powerful waterfall experience',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Murchison Falls National Park'
      },
      {
        day: 5,
        title: 'Transfer to Kibale Forest',
        description: 'Drive south to Hoima or directly to Kibale Forest National Park.',
        activities: [
          'Scenic drive south',
          'Transfer to Kibale Forest National Park',
          'Park entry and check-in'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Kibale Forest National Park'
      },
      {
        day: 6,
        title: 'Chimpanzee Tracking & Bigodi Wetland',
        description: 'Chimpanzee tracking in Kibale Forest and a nature walk in the Bigodi Wetland Sanctuary.',
        activities: [
          'Chimpanzee tracking in Kibale Forest',
          'Primate observation',
          'Nature walk in Bigodi Wetland Sanctuary',
          'Bird watching',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Kibale Forest National Park'
      },
      {
        day: 7,
        title: 'Transfer to Queen Elizabeth National Park',
        description: 'Transfer to Queen Elizabeth National Park with an evening game drive.',
        activities: [
          'Transfer to Queen Elizabeth National Park',
          'Park entry and check-in',
          'Evening game drive',
          'Wildlife viewing'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Queen Elizabeth National Park'
      },
      {
        day: 8,
        title: 'Queen Elizabeth Game Drive & Kazinga Channel',
        description: 'Morning game drive and an afternoon boat safari on the Kazinga Channel to see hippos and elephants.',
        activities: [
          'Morning game drive',
          'Wildlife viewing',
          'Afternoon boat safari on Kazinga Channel',
          'Hippo and elephant viewing',
          'Bird watching',
          'Wildlife photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Queen Elizabeth National Park'
      },
      {
        day: 9,
        title: 'Tree-Climbing Lions in Ishasha',
        description: 'Drive to the Ishasha sector of Queen Elizabeth NP to search for unique tree-climbing lions.',
        activities: [
          'Transfer to Ishasha sector',
          'Game drive searching for tree-climbing lions',
          'Unique wildlife encounter',
          'Wildlife photography',
          'Professional guide services'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge in Ishasha sector'
      },
      {
        day: 10,
        title: 'Transfer to Bwindi Impenetrable National Park',
        description: 'Proceed to Bwindi Impenetrable National Park.',
        activities: [
          'Scenic transfer to Bwindi',
          'Park entry and check-in',
          'Rest and preparation for gorilla trekking'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge near Bwindi Impenetrable National Park'
      },
      {
        day: 11,
        title: 'Gorilla Trekking - The Highlight',
        description: 'Gorilla Trekking in Bwindi—the highlight of the trip.',
        activities: [
          'Early morning briefing at park headquarters',
          'Gorilla trekking in Bwindi Impenetrable Forest',
          'Gorilla family observation',
          'Forest trekking',
          'Wildlife photography',
          'Professional guide services',
          'Once-in-a-lifetime experience'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lodge near Bwindi Impenetrable National Park'
      },
      {
        day: 12,
        title: 'Return to Entebbe & Departure',
        description: 'Return drive to Entebbe with a stop at the Equator for souvenirs before your flight.',
        activities: [
          'Scenic drive back to Entebbe',
          'Equator crossing and souvenir shopping',
          'Airport transfer',
          'Departure'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'White-water rafting on the Nile',
      'Rhino tracking at Ziwa Rhino Sanctuary',
      'Murchison Falls game drives and boat cruise',
      'Chimpanzee tracking in Kibale Forest',
      'Bigodi Wetland Sanctuary nature walk',
      'Queen Elizabeth National Park game drives',
      'Kazinga Channel boat safari',
      'Tree-climbing lion viewing in Ishasha',
      'Gorilla trekking in Bwindi Impenetrable National Park',
      'Equator crossing experience',
      'Comprehensive wildlife viewing',
      'Wildlife photography',
      'Professional guide services',
      'Big Five encounters'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
];

async function seed(): Promise<void> {
  const client = await pool.connect();
  let success = false;
  
  try {
    await client.query('BEGIN');

    // Create trips table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS trips (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        destination VARCHAR(255) NOT NULL,
        duration INTEGER NOT NULL,
        price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        max_participants INTEGER NOT NULL DEFAULT 6,
        current_participants INTEGER NOT NULL DEFAULT 0,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        itinerary TEXT[] DEFAULT '{}',
        detailed_itinerary JSONB,
        images TEXT[] DEFAULT '{}',
        highlights TEXT[] DEFAULT '{}',
        included TEXT[] DEFAULT '{}',
        not_included TEXT[] DEFAULT '{}',
        activities TEXT[] DEFAULT '{}',
        insurance TEXT,
        difficulty VARCHAR(50) DEFAULT 'moderate',
        rating NUMERIC(3, 2) DEFAULT 0,
        reviews INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'active',
        created_by INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created trips table (if it didn\'t exist)');

    // Add new columns if they don't exist (for existing tables)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trips' AND column_name='detailed_itinerary') THEN
          ALTER TABLE trips ADD COLUMN detailed_itinerary JSONB;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trips' AND column_name='activities') THEN
          ALTER TABLE trips ADD COLUMN activities TEXT[] DEFAULT '{}';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trips' AND column_name='insurance') THEN
          ALTER TABLE trips ADD COLUMN insurance TEXT;
        END IF;
      END $$;
    `);
    console.log('✅ Ensured new columns exist');

    // Clear existing trips
    await client.query('TRUNCATE TABLE trips RESTART IDENTITY CASCADE');
    console.log('✅ Cleared existing trips');

    // Insert trips
    for (const trip of TRIPS) {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + trip.duration * 24 * 60 * 60 * 1000);

      // Convert detailed_itinerary to JSON string for JSONB storage
      const detailedItineraryJson = trip.detailed_itinerary ? JSON.stringify(trip.detailed_itinerary) : null;
      
      await client.query(
        `INSERT INTO trips (
          title, description, destination, duration, price,
          max_participants, current_participants, start_date, end_date,
          status, rating, reviews, difficulty, itinerary, highlights, included, images, 
          detailed_itinerary, activities, insurance, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), NOW())`,
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
          4.5, // Default rating
          0,   // Default reviews
          'moderate', // Default difficulty
          '{}', // Empty itinerary array
          '{}', // Empty highlights array
          '{}', // Empty included array
          '{}', // Empty images array
          detailedItineraryJson, // Detailed itinerary as JSONB
          trip.activities || [], // Activities array
          trip.insurance || null, // Insurance text
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`🚀 Seeded ${TRIPS.length} trips`);
    console.log('✅ Database seeding completed successfully!');
    success = true;
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed trips:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    success = false;
  } finally {
    client.release();
    await pool.end();
    process.exit(success ? 0 : 1);
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
