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

interface TripPricing {
  base_price: number;
  group_discounts: Array<{
    people: number;
    price_pp: number;
  }>;
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
  included?: string[];
  notIncluded?: string[];
  highlights?: string[];
  difficulty?: string;
  rating?: number;
  reviews?: number;
  numReviews?: number;
  product_code?: string;
  pricing?: TripPricing;
  important_notes?: string[];
  priceDetails?: {
    adults: number;
    children: number;
    childrenAgeRange: string;
    infants: string;
  };
  maxGroupSize?: number;
  minGroupSize?: number;
  categories?: string[];
  additionalInfo?: {
    whatToBring: string[];
    goodToKnow: string[];
  };
}

// NOTE: Some trips were provided without explicit prices. Those are seeded with price = 0.0; update as needed.
const TRIPS: TripSeed[] = [
  {
    title: '3-Days Exclusive Rwanda Luxury Mountain Gorilla Trekking',
    description: 'Experience the ultimate luxury wildlife adventure with this exclusive 3-day gorilla trekking experience in Rwanda. This high-end private trip takes you to Kinigi, home of the famous mountain gorillas, where you\'ll enjoy VIP treatment throughout your journey. Stay at the luxurious One&Only Gorilla Nest lodge and embark on a once-in-a-lifetime gorilla trekking experience in the Volcanoes National Park. The package includes private helicopter transfers, ensuring maximum comfort and stunning aerial views of Rwanda\'s breathtaking landscapes. This is a truly exclusive experience, limited to discerning travelers seeking the very best in wildlife encounters and luxury accommodations.',
    destination: 'Volcanoes National Park, Rwanda',
    duration: 3,
    price: 25577, // Starting price per person
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Helicopter Transfer to Volcanoes National Park',
        description: 'Arrive at Kigali International Airport where you\'ll receive VIP meet and greet services with fast-track customs clearance. Board a private helicopter for a scenic 30-minute flight to Musanze, the gateway to the mountain gorillas. Transfer to the luxurious One&Only Gorilla Nest lodge for check-in. Enjoy the exclusive amenities of this world-class property before dinner and a restful evening.',
        activities: [
          'VIP meet and greet at Kigali International Airport',
          'Fast-track customs clearance',
          'Scenic 30-minute helicopter transfer to Musanze',
          'Luxury transfer to One&Only Gorilla Nest',
          'Leisure time at the lodge',
          'Gourmet dinner at the lodge'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'One&Only Gorilla Nest'
      },
      {
        day: 2,
        title: 'Exclusive Gorilla Trekking Experience',
        description: 'Start your day with a gourmet breakfast before heading to the Volcanoes National Park headquarters in Kinigi. Meet your expert guides and receive a briefing about gorilla trekking etiquette. Embark on a once-in-a-lifetime trek through the lush rainforest to observe a family of mountain gorillas in their natural habitat. Spend a magical hour watching these magnificent creatures. Return to the lodge for a well-deserved lunch and spend the afternoon relaxing or enjoying an optional spa treatment.',
        activities: [
          'Early morning breakfast',
          'Transfer to Volcanoes National Park headquarters',
          'Gorilla trekking briefing',
          'Guided gorilla trek (3-6 hours depending on gorilla location)',
          'One hour with the gorilla family',
          'Return to lodge for lunch',
          'Afternoon at leisure or optional spa treatment',
          'Gourmet dinner at the lodge'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'One&Only Gorilla Nest'
      },
      {
        day: 3,
        title: 'Helicopter Return to Kigali',
        description: 'After a leisurely breakfast and check-out, board your private helicopter for the return flight to Kigali. Enjoy stunning aerial views of Rwanda\'s landscape one last time before your international departure or transfer to your next destination.',
        activities: [
          'Leisurely breakfast at the lodge',
          'Check-out from One&Only Gorilla Nest',
          'Private helicopter transfer to Kigali',
          'Transfer to Kigali International Airport or city hotel'
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Luxury helicopter transfers',
      'Mountain gorilla trekking',
      'VIP meet and greet services',
      'Luxury accommodation',
      'Gourmet dining',
      'Optional spa treatments'
    ],
    images: [
      '/images/trips/rwanda-gorilla-luxury-1.jpg',
      '/images/trips/rwanda-gorilla-luxury-2.jpg',
      '/images/trips/rwanda-gorilla-luxury-3.jpg',
      '/images/trips/rwanda-gorilla-luxury-4.jpg',
      '/images/trips/one-only-gorilla-nest-1.jpg'
    ],
    included: [
      'VIP airport meet and greet with fast-track clearance',
      'Round-trip private helicopter transfers (Kigali-Musanze-Kigali)',
      'Gorilla trekking permit ($15,000 value)',
      '2 nights luxury accommodation at One&Only Gorilla Nest',
      'All meals as specified in the itinerary',
      'Private transportation in a luxury safari vehicle',
      'Services of an English-speaking driver-guide',
      'Bottled drinking water during activities',
      'All park fees and government taxes',
      '24/7 dedicated support'
    ],
    notIncluded: [
      'International airfare',
      'Rwanda visa fees',
      'Travel insurance',
      'Optional spa treatments',
      'Premium alcoholic beverages',
      'Gratuities and personal expenses',
      'Any items not mentioned as included'
    ],
    highlights: [
      'Exclusive private helicopter transfers',
      'Once-in-a-lifetime mountain gorilla encounter',
      'Luxury accommodation at One&Only Gorilla Nest',
      'VIP treatment throughout the journey',
      'Personalized service with expert guides',
      'Breathtaking views of the Virunga Volcanoes',
      'Gourmet dining experiences'
    ],
    difficulty: 'moderate',
    rating: 5.0,
    reviews: 12,
    product_code: 'RLGT-001',
    pricing: {
      base_price: 25577,
      group_discounts: [
        { people: 2, price_pp: 24000 },
        { people: 4, price_pp: 23000 },
        { people: 6, price_pp: 22000 }
      ]
    },
    important_notes: [
      'Passport must be valid for at least 6 months from date of departure',
      'Gorilla trekking requires moderate physical fitness',
      'Minimum age for gorilla trekking is 15 years',
      'Vaccinations including Yellow Fever are recommended',
      'Booking confirmation is subject to gorilla permit availability',
      'A minimum of 60 days advance booking is recommended',
      'Cancellation policy: Strict - 90 days for full refund'
    ]
  },
  {
    title: 'Douala City Tour: Explore the Economic Capital',
    description: 'Discover the vibrant energy of Douala, Cameroon\'s largest city and economic hub, on this comprehensive city tour. With over two million inhabitants spread across 120 districts, Douala is a city that never sleeps, pulsating with life, culture, and history.\n\nThis immersive tour takes you through the heart of this dynamic metropolis, where colonial heritage meets modern African urban life. You\'ll explore historic landmarks, bustling markets, and cultural institutions that tell the story of Douala\'s past, present, and future.\n\nHighlights include the stunning Saint Peter and Paul Cathedral, the fascinating Maritime Museum, and the vibrant Youpwé fish market. You\'ll also visit local art galleries like Doual\'art and Annie Kadji, showcasing the city\'s thriving contemporary art scene. The tour offers a perfect introduction to Douala\'s unique character, from its architectural landmarks to its lively street life and cultural diversity.',
    destination: 'Douala, Cameroon',
    duration: 1,
    price: 450, // Base price for 1 person
    max_participants: 8,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Exploring Douala\'s Heritage and Culture',
        description: 'Full-day tour of Douala\'s most significant landmarks and cultural sites.',
        activities: [
          'Morning pickup from your hotel in Douala',
          'Visit the historic Saint Peter and Paul Cathedral',
          'Explore the colorful flower market',
          'Tour the bustling Youpwé fish market',
          'Lunch at a local restaurant (not included)',
          'Afternoon visit to the Maritime Museum',
          'Explore Doual\'art and Annie Kadji art galleries',
          'Return to your hotel in the evening'
        ],
        meals: [],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'City sightseeing',
      'Cultural immersion',
      'Market visits',
      'Museum tours',
      'Architectural exploration',
      'Local art appreciation'
    ],
    images: [
      '/images/trips/douala-city-1.webp',
      '/images/trips/douala-city-2.webp',
      '/images/trips/douala-city-3.jpg',
      '/images/trips/douala-city-4.jpg'
    ],
    included: [
      'Private transportation with driver',
      'Professional English/French speaking guide',
      'All entrance fees to listed attractions',
      'Bottled water in the vehicle',
      'Hotel pickup and drop-off within Douala'
    ],
    notIncluded: [
      'Meals and drinks',
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Travel insurance',
      'Accommodation before/after the tour'
    ],
    highlights: [
      'Visit the iconic Saint Peter and Paul Cathedral',
      'Experience the vibrant atmosphere of Youpwé fish market',
      'Admire the beautiful displays at the flower market',
      'Discover Cameroon\'s maritime history at the Maritime Museum',
      'Explore contemporary African art at Doual\'art and Annie Kadji galleries',
      'See the contrast between colonial architecture and modern developments',
      'Experience the dynamic energy of Cameroon\'s economic capital'
    ],
    difficulty: 'easy',
    rating: 4.5,
    reviews: 18,
    product_code: 'PASELM',
    pricing: {
      base_price: 450,
      group_discounts: [
        { people: 2, price_pp: 230 },
        { people: 3, price_pp: 170 },
        { people: 4, price_pp: 130 }
      ]
    }
  },
  {
    title: '2-Day Trek: Mount Manengouba & Twin Lakes',
    description: 'Mount Manengouba, standing at 2,411 meters above sea level, is an ancient volcano located in western Cameroon on the border between the French-speaking and English-speaking regions. This majestic mountain is renowned for its stunning twin crater lakes - the Male Lake (Lac Mâle) and Female Lake (Lac Femelle) - each with distinct colors and characteristics. The mountain is home to the Peules people, who live in small, remote villages and maintain traditional lifestyles centered around agriculture and animal husbandry.\n\nThis two-day adventure takes you through lush tropical forests, past traditional villages, and up to the breathtaking summit where you\'ll be rewarded with panoramic views and the unique experience of camping between the two legendary lakes. The mountain is part of the Cameroon Line and is a biodiversity hotspot, home to numerous endemic species including the long-fingered frog and over 270 bird species.\n\nThe journey begins with an early morning departure from Douala, followed by a scenic drive to the trailhead. The 5-hour ascent takes you through diverse ecosystems, from dense forests to alpine meadows, before reaching the stunning twin lakes at the summit. After a night of camping under the stars, you\'ll descend the next morning, taking in the spectacular views one last time before returning to Douala.',
    destination: 'Mount Manengouba, Cameroon',
    duration: 2,
    price: 899, // Base price for 1 person
    max_participants: 8,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Ascent to Mount Manengouba',
        description: 'Early morning departure from Douala and trek to the summit of Mount Manengouba.',
        activities: [
          '6:00 AM - Departure from Douala',
          'Scenic drive to the trailhead',
          'Begin the 5-hour ascent through tropical forest',
          'Picnic lunch en route',
          'Arrive at the twin lakes in the afternoon',
          'Explore the Male and Female Lakes',
          'Set up camp and enjoy dinner under the stars'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Camping at the summit'
      },
      {
        day: 2,
        title: 'Summit Exploration & Descent',
        description: 'Morning exploration of the summit area and descent back to Douala.',
        activities: [
          'Sunrise at the summit',
          'Breakfast with panoramic views',
          'Explore the Elengoum caldera',
          'Begin descent through different trails',
          'Lunch at a local village',
          'Return to Douala in the evening'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Mountain trekking',
      'Wildlife spotting',
      'Camping',
      'Nature photography',
      'Cultural interaction',
      'Scenic hikes'
    ],
    images: [
      '/images/trips/mount-manengouba-1.jpg',
      '/images/trips/mount-manengouba-2.jpg',
      '/images/trips/mount-manengouba-3.jpg',
      '/images/trips/mount-manengouba-4.jpg'
    ],
    included: [
      'Round-trip transportation from Douala',
      'Professional mountain guide',
      'All camping equipment (tent, sleeping bag, mat)',
      'All meals as specified in the itinerary',
      'Drinking water during the trek',
      'All park entrance fees',
      'Camping fees',
      'First aid kit'
    ],
    notIncluded: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Travel insurance',
      'Alcoholic beverages',
      'Optional horse rental (available on request)'
    ],
    highlights: [
      'Trek to the summit of Mount Manengouba (2,411m)', 
      'Visit the stunning Male and Female crater lakes',
      'Camp overnight between the twin lakes',
      'Witness breathtaking sunrises and sunsets',
      'Explore the unique biodiversity of the Cameroon Line',
      'Experience local Peules culture and traditions',
      'Opportunity to see endemic wildlife and bird species'
    ],
    difficulty: 'moderate',
    rating: 4.8,
    reviews: 12,
    product_code: 'P0A8LH',
    pricing: {
      base_price: 899,
      group_discounts: [
        { people: 2, price_pp: 495 },
        { people: 3, price_pp: 370 },
        { people: 4, price_pp: 299 }
      ]
    }
  },
  {
    title: 'Douala Day Tour: Jébalé Island',
    description: 'Just fifteen minutes by canoe from the port of Bonassama in Bonabéri, the enchanting island of Jébalé awaits. This hidden gem in the Wouri River is not only a place of exceptional natural beauty but also a site of deep cultural significance. The island is renowned as a training ground for initiates of the Ngondo festival, the annual water festival that celebrates the rich cultural heritage of the Sawa people along the Wouri River.\n\nAs you step onto Jébalé Island, you\'ll be transported to a world of tranquility, far removed from the hustle and bustle of Douala. The island is home to two traditional villages where time seems to stand still, offering a rare glimpse into the authentic way of life of the local communities. The island\'s commitment to sustainability is evident in its solar power plant, which provides clean energy to the residents.\n\nThe journey to Jébalé is an adventure in itself, with a scenic 15-minute motorized canoe ride from Bonassama port, offering stunning views of the Wouri River. Once on the island, you\'ll be immersed in the peaceful rhythm of island life, where the only sounds are the gentle lapping of water against the shore and the calls of tropical birds in the mangroves.\n\nThis tour is perfect for those seeking a blend of cultural immersion, natural beauty, and a peaceful retreat from city life. Whether you\'re interested in traditional Cameroonian culture, sustainable living, or simply want to experience the serene beauty of a river island, Jébalé offers an unforgettable experience.',
    destination: 'Douala, Cameroon',
    duration: 1,
    price: 199,
    max_participants: 8,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Jébalé Island Discovery',
        description: 'Full day tour to Jébalé Island with cultural immersion and exploration of local villages.',
        activities: [
          'Morning departure from Bonassama port',
          '15-minute scenic canoe ride to Jébalé Island',
          'Visit to the two traditional villages on the island',
          'Exploration of the solar power plant',
          'Lunch with local specialties',
          'Free time to enjoy the peaceful surroundings',
          'Return to Douala in the afternoon'
        ],
        meals: ['Lunch included'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Island exploration',
      'Cultural immersion',
      'Village visits',
      'Sustainable energy tour',
      'Boat tour',
      'Nature observation'
    ],
    images: [
      '/images/trips/jebale-island-1.webp',
      '/images/trips/jebale-island-2.jpg',
      '/images/trips/jebale-island-3.jpg'
    ],
    included: [
      'Round-trip canoe transfer to Jébalé Island',
      'Knowledgeable local guide',
      'All necessary visit permits',
      'Traditional Cameroonian lunch',
      'Bottled water'
    ],
    notIncluded: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Travel insurance',
      'Accommodation before/after tour',
      'Alcoholic beverages'
    ],
    highlights: [
      'Experience the cultural significance of Ngondo festival training grounds',
      'Visit two traditional villages and interact with local communities',
      'Learn about sustainable energy at the island\'s solar power plant',
      'Enjoy a peaceful retreat just minutes from Douala',
      'Scenic canoe ride through the Wouri River',
      'Taste authentic Cameroonian cuisine'
    ],
    difficulty: 'easy',
    rating: 4.6,
    reviews: 5,
    product_code: 'PGVFP1'
  },
  {
    title: 'Douala Day Tour: Manoka Island',
    description: 'Not far from the small fishing port of Youpwé, near Douala, Manoka Island is the sixth district municipality of the Urban Community of Douala and is native to the Malimba people. The island offers a perfect day of escape and a change of scenery far from the bustle of Douala, with its colonial vestiges, including the prison of Douala Manga Bell, and its population that lives mainly from fishing and fish smoking.',
    destination: 'Douala, Cameroon',
    duration: 1,
    price: 249,
    max_participants: 10,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Manoka Island Day Tour',
        description: 'Full day tour to Manoka Island with exploration of local villages, colonial sites, and beach time.',
        activities: [
          'Morning departure from Youpwé fishing port',
          'Private canoe trip to Manoka Island',
          'Explore local fishing villages',
          'Visit Douala Manga Bell prison ruins',
          'Lunch with local specialties',
          'Beach time and wildlife spotting',
          'Return to Douala in the evening'
        ],
        meals: ['Lunch included'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Island exploration',
      'Cultural immersion',
      'Beach visit',
      'Historical site visits',
      'Boat tour',
      'Wildlife spotting'
    ],
    images: [
      '/images/trips/manoka-island-1.jpg',
      '/images/trips/manoka-island-2.jpg',
      '/images/trips/manoka-island-3.jpg'
    ],
    included: [
      'Round-trip boat transfer to Manoka Island',
      'Professional English/French speaking guide',
      'All necessary permits',
      'Lunch with local specialties',
      'Bottled water'
    ],
    notIncluded: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Travel insurance',
      'Accommodation before/after tour',
      'Alcoholic beverages'
    ],
    highlights: [
      'Explore the largest island in Cameroon',
      'Visit the historic Douala Manga Bell prison ruins',
      'Experience the unique culture of the Malimba people',
      'Observe traditional fishing and fish smoking techniques',
      'Relax on pristine, uncrowded beaches',
      'Spot local wildlife including monkeys'
    ],
    difficulty: 'easy',
    rating: 4.5,
    reviews: 6,
    product_code: 'PU72NZ'
  },
  {
    title: 'Douala Day Tour: Douala-Edéa Wildlife Reserve',
    description: 'The Douala Edéa wildlife reserve (réserve de faune de Douala) is a vast wild expanse made up largely of mangroves and penetrated by numerous swamps and waterways. The Douala Edéa wildlife reserve is a refuge to rare and endangered species such as the manatee, forest elephants, chimpanzees, and dolphins. On the beaches of the coast, sea turtles come to lay their eggs, with the high season between November and January. The reserve features rich tropical coastal vegetation including rattan palms, raffias, and mangroves, along with beautiful yellow sand beaches at the end of the Wouri delta.',
    destination: 'Douala, Cameroon',
    duration: 1,
    price: 319,
    max_participants: 12,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Douala-Edéa Wildlife Reserve Day Tour',
        description: 'Full day tour to Douala-Edéa Wildlife Reserve with visits to Monkey Island, Marienberg Church, and Tissongo Beach.',
        activities: [
          'Pickup from Douala at 8am',
          'Visit Monkey Island',
          'Explore Marienberg Church',
          'Lunch at a local restaurant',
          'Relax at Tissongo Beach',
          'Return to Douala around 4pm'
        ],
        meals: ['Lunch included'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Wildlife viewing',
      'Mangrove exploration',
      'Beach visit',
      'Cultural site visits',
      'Boat tour'
    ],
    images: [
      '/images/trips/douala-edea-1.jpg',
      '/images/trips/douala-edea-2.jpg',
      '/images/trips/douala-edea-3.jpg'
    ],
    included: [
      'Transport by motorized canoe round trip from Douala',
      'Professional English/French speaking guide',
      'Entrance fees to all sites',
      'Lunch and drinks',
      'Bottled water'
    ],
    notIncluded: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Travel insurance',
      'Accommodation before/after tour',
      'Alcoholic beverages'
    ],
    highlights: [
      'Explore the vast mangrove forests and swamps',
      'Spot rare wildlife including manatees and forest elephants',
      'Visit Monkey Island and observe primates in their natural habitat',
      'Relax on the beautiful Tissongo Beach',
      'Learn about the local ecosystem and conservation efforts'
    ],
    difficulty: 'easy',
    rating: 4.7,
    reviews: 8,
    product_code: 'PFW0TF'
  },
  {
    title: 'Douala Day Tour: Ekom Nkam Falls',
    description: 'The Ekom Nkam falls (Chutes d\'Ekom) are one of the most beautiful waterfalls in Cameroon. They are 80 meters in height and consist of two different falls: a "male", which is continuously fed, and a "female", which is only fed during the rainy season. The name Ekom Nkam is derived from two different words: Ekom which is the name of the village where we find the waterfalls, and Nkam which is the name of the river from which the falls originate. In 1982 a scene from the movie "Greystoke the legend of Tarzan" with Christophe Lambert was filmed in this place. Ekom Nkam Falls is a great destination for those who love to be in nature and especially hikers, who can enjoy the nine km hiking trail if desired, although the falls can be reached by car as well.',
    destination: 'Douala, Cameroon',
    duration: 1,
    price: 129,
    max_participants: 15,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Ekom Nkam Falls Day Tour',
        description: 'Full day tour to Ekom Nkam Falls with guided exploration and lunch at the site.',
        activities: [
          'Scenic drive from Douala to Ekom village',
          'Guided tour of Ekom Nkam Falls',
          'Optional hiking on the 9km trail',
          'Lunch at a local restaurant near the falls'
        ],
        meals: ['Lunch included'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Waterfall exploration',
      'Nature photography',
      'Hiking (optional)',
      'Scenic drives through Cameroonian countryside'
    ],
    images: [
      '/images/trips/ekom-nkam-falls-1.jpg',
      '/images/trips/ekom-nkam-falls-2.jpg',
      '/images/trips/ekom-nkam-falls-3.jpg'
    ],
    included: [
      'Round-trip transportation from Douala',
      'Professional English/French speaking guide',
      'Entrance fees to Ekom Nkam Falls',
      'Lunch at a local restaurant',
      'Bottled water'
    ],
    notIncluded: [
      'Personal expenses and souvenirs',
      'Tips and gratuities',
      'Travel insurance',
      'Accommodation before/after tour',
      'Alcoholic beverages'
    ],
    highlights: [
      'Marvel at the stunning 80-meter high Ekom Nkam Falls',
      'Visit the filming location from "Greystoke: The Legend of Tarzan"',
      'Optional 9km hiking trail through beautiful scenery',
      'Experience the local culture in Ekom village',
      'Enjoy a delicious local lunch with views of the falls'
    ],
    difficulty: 'moderate',
    rating: 4.5,
    reviews: 5,
    product_code: 'PEXVWX'
  },
  {
    title: 'Douala Day Tour: Douala-Edéa Wildlife Reserve',
    description: 'The Douala Edéa wildlife reserve (réserve de faune de Douala) is a vast wild expanse made up largely of mangroves and penetrated by numerous swamps and waterways. The Douala Edéa wildlife reserve is a refuge to a rare and endangered species such as the manatee, a large herbivorous marine mammal, forest elephants, chimpanzees, dolphins and more. On the beaches of the coast, sea turtles come to lay their eggs, with the high season between November and January. It is also possible to come on an excursion to Douala-Edéa Wildlife Reserve to see sea turtles hatch their eggs.',
    destination: 'Douala, Cameroon',
    duration: 1,
    price: 319,
    max_participants: 12,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Douala Day Tour',
        description: 'Full day tour of Douala-Edéa Wildlife Reserve with visits to Monkey Island, Marienberg Church, and Tissongo Beach.',
        activities: [
          'Monkey Island visit',
          'Marienberg Church visit',
          'Tissongo Beach visit'
        ],
        meals: ['Lunch included'],
        accommodation: 'N/A'
      }
    ],
    activities: [
      'Wildlife viewing (manatees, dolphins, sea turtles in season)',
      'Mangrove exploration',
      'Beach visit',
      'Cultural and historical site visits'
    ],
    images: [
      '/images/trips/douala-edea-1.jpg',
      '/images/trips/douala-edea-2.jpg',
      '/images/trips/douala-edea-3.jpg'
    ],
    included: [
      'Transport by motorized canoe round trip from Douala',
      'Professional guide',
      'Entrance fees and activities',
      'Lunch and drinks',
      'All taxes and service charges'
    ],
    notIncluded: [
      'Personal expenses',
      'Tips and gratuities',
      'Travel insurance',
      'Accommodation before/after tour'
    ],
    highlights: [
      'Explore the diverse ecosystems of Douala-Edéa Wildlife Reserve',
      'Chance to spot manatees, dolphins, and other wildlife',
      'Visit the historic Marienberg Church',
      'Relax on the beautiful Tissongo Beach',
      'Experience the unique mangrove forests'
    ],
    difficulty: 'easy',
    rating: 4.8,
    reviews: 28,
    product_code: 'PFW0TF'
  },
  {
    title: '10-Day Discounted Rwanda Gorilla & Chimpanzee Trek Safari',
    description: 'Experience Rwanda from wildlife safaris in Akagera, sunset boat cruises, and city tours to chimpanzee and gorilla trekking, tea and coffee experiences, cultural immersion, and more. This private safari is unmatched in authenticity and price, available at this rate from November to May only.',
    destination: 'Rwanda',
    duration: 10,
    price: 4518,
    max_participants: 8,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival in Kigali',
        description: 'Arrive at Kigali International Airport. Meet your safari guide, exchange currency, transfer to hotel, enjoy amenities, dinner, and rest.',
        activities: [
          'Airport arrival',
          'Meet and greet',
          'Currency exchange',
          'Hotel check-in',
          'Welcome dinner'
        ],
        meals: ['Dinner (hotel)'],
        accommodation: 'One Click Hotel (Bed & Breakfast)'
      },
      {
        day: 2,
        title: 'Transfer to Akagera National Park - Sunset Cruise',
        description: 'Early hotel breakfast, drive to Akagera through scenic Eastern Province. En-route stopovers, check in at lodge, lunch, and sunset boat ride on Lake Ihema. Dinner and rest at lodge.',
        activities: [
          'Scenic transfer to Kayonza district',
          'Planned stopovers',
          'Check-in at safari lodge',
          'Sunset boat cruise on Lake Ihema',
          'Aquatic wildlife observation'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mantis Akagera Game Lodge (Dinner, Bed & Breakfast)'
      },
      {
        day: 3,
        title: 'Full Game Drive in Akagera - Back to Kigali',
        description: 'Full-day game drive to see the Big Five, birds, picnic, and evening transfer back to Kigali. Dinner and rest.',
        activities: [
          'Full-day safari game drive',
          'Big Five and antelope sightings',
          'Birdwatching (500+ species)',
          'Picnic lunch in the park',
          'Evening transfer to Kigali'
        ],
        meals: ['Breakfast', 'Packed lunch', 'Dinner'],
        accommodation: 'One Click Hotel (Bed & Breakfast)'
      },
      {
        day: 4,
        title: 'Kigali City Tour & Transfer to Nyungwe via Nyanza',
        description: 'Visit the Kigali Genocide Memorial, drive to Nyungwe Forest with a stop at Nyanza King’s palace, learn Rwandan history. Evening arrival and check-in at guest house, relax till dinner.',
        activities: [
          'Breakfast at hotel',
          'Kigali Genocide Memorial Tour',
          'Drive via terraced hills of Rwanda',
          'Stop at Nyanza King’s Palace',
          'Arrival at Nyungwe'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Ken Barham Guest House (Bed & Breakfast)'
      },
      {
        day: 5,
        title: 'Nyungwe Chimpanzee Trek & Canopy Walk',
        description: 'Early breakfast, chimpanzee hiking, spot migratory birds and wildlife, lunch, then an afternoon canopy walk adventure over Nyungwe forest. Evening rest.',
        activities: [
          'Chimpanzee trekking in Nyungwe',
          'Birdwatching (Ross’ turaco, sunbird, hornbill, hawk)',
          'Forest hike',
          'Lunch at guest house',
          'Canopy walk over forest',
          'Optional property amenities'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Ken Barham Guest House (Bed & Breakfast)'
      },
      {
        day: 6,
        title: 'Tea Plantation & Transfer to Lake Kivu',
        description: 'Morning at tea plantation for picking and photo ops, interact with locals, then transfer to Lake Kivu (Kibuye side), evening leisure, dinner, rest.',
        activities: [
          'Breakfast at lodge',
          'Tea plantation experience',
          'Skill demonstration (tea picking)',
          'Photography in plantations',
          'Transfer to Lake Kivu',
          'Evening leisure, amenities'
        ],
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Rwiza Cultural Village (Bed & Breakfast)'
      },
      {
        day: 7,
        title: 'Lake Kivu Boat Cruise, Coffee Experience & Transfer to Volcanoes NP',
        description: 'Morning boat cruise to explore islands, continue with coffee experience at Kopakaki Cooperative, drive to Volcanoes National Park, check-in and rest.',
        activities: [
          'Breakfast at hotel',
          'Lake Kivu boat safari',
          'Explore local islands',
          'Coffee (crop-to-cup) experience',
          'Transfer to Volcanoes National Park'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Home Inn Hotel (Bed & Breakfast)'
      },
      {
        day: 8,
        title: 'Gorilla Trekking & Cultural Experience',
        description: 'Pre-trek briefing at park HQ, guided trek to gorillas, one hour with them, return for lunch, afternoon cultural tour at Gorilla Guardians Village. Dinner & rest.',
        activities: [
          'Early breakfast',
          'Pre-trek briefing (park HQ)',
          'Mountain Gorilla trekking',
          'One hour observing gorillas',
          'Lunch',
          'Visit Gorilla Guardians Village (Iby’iwacu)',
          'Cultural activities'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Home Inn Hotel (Bed & Breakfast)'
      },
      {
        day: 9,
        title: 'Bisoke Volcano Hike',
        description: 'Briefing, join group, 4hr hike to Bisoke summit, see crater lake, picnic on top, 2hr descent, return to lodge, rest and evening at leisure.',
        activities: [
          'Breakfast at lodge',
          'Pre-hike briefing (HQ)',
          'Hike to Bisoke summit',
          'Crater lake viewing',
          'Picnic lunch on mountain',
          'Descent & return',
          'Evening leisure'
        ],
        meals: ['Breakfast', 'Picnic lunch', 'Dinner'],
        accommodation: 'Home Inn Hotel (Bed & Breakfast)'
      },
      {
        day: 10,
        title: 'Golden Monkey Trekking & Return to Kigali',
        description: 'Pre-trek HQ briefing, golden monkey trek in bamboo forest, one hour with monkeys, finish and transfer/drive to Kigali hotel or airport. End of tour.',
        activities: [
          'Breakfast at lodge',
          'Pre-trek briefing',
          'Golden monkey trekking',
          'One hour with monkeys',
          'Scenic transfer to Kigali',
          'Drop off at hotel or airport'
        ],
        meals: ['Breakfast'],
        accommodation: 'End of tour/drop off in Kigali or airport'
      }
    ],
    activities: [
      'Wildlife safari (Akagera)',
      'Game drive (Big Five)',
      'Chimpanzee trekking & Canopy walk (Nyungwe)',
      'Tea picking and plantation experience',
      'Lake Kivu boat cruise',
      'Coffee experience at Kopakaki Cooperative',
      'Gorilla trekking (Volcanoes NP)',
      'Cultural immersion at Gorilla Guardians Village',
      'Bisoke volcano hiking',
      'Golden monkey trekking',
      'Kigali Genocide Memorial visit',
      'Rwandan historical and cultural exploration',
      'Professional guide services',
      'Luxury & eco-lodge stays',
      'Photography and birdwatching opportunities'
    ],
    images: [
      '/images/trips/gorilla-chimpanzee-hero.jpg',
      '/images/trips/gorilla-chimpanzee-nyungwe.jpg',
      '/images/trips/gorilla-chimpanzee-akagera.jpg',
      '/images/trips/gorilla-chimpanzee-volcanoes.jpg',
      '/images/trips/gorilla-chimpanzee-lakekivu.jpeg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
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
      '/images/trips/cultural-gorilla-trek-1.webp',
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
      '/images/trips/gorilla-golden-monkey-2.jpeg',
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

images: [
      '/images/trips/m-hero.jpg',
      '/images/trips/monkey-safari-1.jpg',
      '/images/trips/monkey-safari-2.webp',
      '/images/trips/monkey-safari-3.jpg',
      '/images/trips/monkey-safari-4.jpg'
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
     images: [
      '/images/trips/tanzania-canvas-hero.jpg',
      '/images/trips/tanzania-canvas-1.jpg',
      '/images/trips/tanzania-canvas-2.jpg',
      '/images/trips/tanzania-canvas-3.jpg',
      '/images/trips/tanzania-canvas-4.jpg'
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

     images: [
      '/images/trips/gorilla-express-hero.wrbp',
      '/images/trips/gorilla-express-1.jpg',
      '/images/trips/gorilla-express-2.jpg',
      '/images/trips/gorilla-express-3.webp',
      '/images/trips/gorilla-express-4.jpg'
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

    images: [
      '/images/trips/gorilla-fly-hero.jpg',
      '/images/trips/gorilla-fly-1.jpg',
      '/images/trips/gorilla-fly-2.jpg',
      '/images/trips/gorilla-fly-3.jpg',
      '/images/trips/gorilla-fly-4.jpg'
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

    images: [
      '/images/trips/chimpanzee-uganda-hero.jpg',
      '/images/trips/chimpanzee-uganda-1.jpg',
      '/images/trips/chimpanzee-uganda-2.jpg',
      '/images/trips/chimpanzee-uganda.jpg',
      '/images/trips/chimpanzee-uganda-4.jpg'
    ],

    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '4 Days Chimpanzee Trekking and Lake Kivu Adventure',
    description: 'This immersive 4-day private safari takes you through the heart of Rwanda\'s natural and cultural wonders. Journey to Nyungwe Forest National Park—one of the oldest rainforests in Africa—to trek wild chimpanzees and walk above the canopy on a thrilling 70-meter high walkway. The adventure concludes with a serene escape to Lake Kivu, where you\'ll experience the unique "singing fishermen" tradition and explore a local coffee plantation. This carefully curated experience combines primate encounters, breathtaking forest views, cultural immersion, and lakeside relaxation in one unforgettable journey.',
    destination: 'Rwanda',
    duration: 4,
    price: 1393,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Kigali City Tour & Transfer to Nyungwe',
        description: 'Begin your adventure with a comprehensive morning tour of Kigali, including a visit to the Genocide Memorial—a place of remembrance and learning. Afterward, embark on a scenic 5-hour drive through Rwanda\'s beautiful terraced hillsides to Nyungwe Forest. En route, stop at the King\'s Palace in Nyanza to learn about Rwanda\'s rich royal history and traditional culture. Arrive at your lodge in the late afternoon, check in, and enjoy a relaxing evening surrounded by the sounds of the ancient forest.',
        activities: [
          'Kigali city tour',
          'Genocide Memorial visit',
          'Scenic drive through terraced hillsides',
          'King\'s Palace visit in Nyanza',
          'Learn about Rwandan royal history',
          'Arrival at Nyungwe Forest lodge'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Nyungwe Forest Lodge or similar (Full Board)'
      },
      {
        day: 2,
        title: 'Chimpanzee Trekking & Canopy Walkway',
        description: 'Rise early at 5:00 AM for an unforgettable chimpanzee trekking experience in Nyungwe Forest. Follow your expert guide through the dense rainforest in search of habituated chimpanzee families. Listen for their distinctive pant-hoots echoing through the forest before you spot them. Spend time observing these fascinating primates in their natural habitat. After lunch, take to the skies on the spectacular 70-meter high Canopy Walkway—one of only three in East Africa. Walk above the ancient forest canopy for breathtaking bird\'s eye views and the chance to spot rare birds and monkeys from above.',
        activities: [
          'Early morning chimpanzee trekking (5:00 AM start)',
          'Forest hiking and wildlife observation',
          'Chimpanzee family encounter',
          'Birdwatching (Ross\' turaco, grey-cheeked hornbill, sunbirds)',
          '70-meter high Canopy Walkway experience',
          'Aerial views of ancient rainforest',
          'Photography opportunities'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Nyungwe Forest Lodge or similar (Full Board)'
      },
      {
        day: 3,
        title: 'Kamiranzovu Trail & Lake Kivu',
        description: 'After breakfast, hike the Kamiranzovu Marsh trail through pristine forest to discover rare orchids, cascading waterfalls, and diverse birdlife. This peaceful walk offers a different perspective of Nyungwe\'s biodiversity. In the afternoon, drive to the stunning shores of Lake Kivu—one of Africa\'s Great Lakes. Check into your lakeside accommodation and relax. As evening falls, experience the unique tradition of night fishing with local "singing fishermen" who use traditional methods and songs while fishing on the lake—a cultural experience you won\'t find anywhere else.',
        activities: [
          'Kamiranzovu Marsh trail hike',
          'Rare orchid and waterfall viewing',
          'Forest birdwatching',
          'Scenic transfer to Lake Kivu',
          'Lakeside accommodation check-in',
          'Traditional night fishing experience',
          'Cultural interaction with singing fishermen'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lake Kivu resort or similar (Full Board)'
      },
      {
        day: 4,
        title: 'Tea Plantation Tour & Return to Kigali',
        description: 'Visit a lush tea plantation to see how Rwanda\'s world-famous tea is harvested and processed. Learn about the tea-making process from leaf to cup, interact with local workers, and enjoy fresh tea tasting. Take stunning photos of the emerald-green tea fields against the backdrop of rolling hills. Enjoy a final lakeside lunch with beautiful views before beginning the scenic 3-hour drive back to Kigali. Arrive in the capital in time for your departure or extend your stay to explore more of Rwanda.',
        activities: [
          'Tea plantation tour and education',
          'Tea harvesting demonstration',
          'Tea processing observation',
          'Fresh tea tasting',
          'Photography in tea fields',
          'Lakeside lunch',
          'Scenic return drive to Kigali',
          'Airport or hotel drop-off'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Chimpanzee trekking in Nyungwe Forest',
      '70-meter high Canopy Walkway experience',
      'Kigali city tour and Genocide Memorial',
      'King\'s Palace cultural visit',
      'Kamiranzovu Marsh trail hike',
      'Lake Kivu night fishing with singing fishermen',
      'Tea plantation tour and tasting',
      'Birdwatching and wildlife observation',
      'Cultural immersion experiences'
    ],
    images: [
      '/images/trips/chimpanzee-trek-hero.jpg',
      '/images/trips/chimpanzee-trek-1.jpg',
      '/images/trips/chimpanzee-trek-2.jpg',
      '/images/trips/chimpanzee-trek-3.jpg',
      '/images/trips/chimpanzee-trek-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '4 Days Queen Elizabeth Wildlife Safari and Lake Relaxation',
    description: 'Cross the border from Rwanda into Uganda for an extraordinary safari that blends high-octane wildlife viewing with deep relaxation. Explore Queen Elizabeth National Park, famous for its unique tree-climbing lions and the Kazinga Channel—home to the world\'s highest concentration of hippos. Experience thrilling game drives in search of elephants, buffalo, and big cats, then enjoy a boat cruise teeming with wildlife. The adventure concludes with a peaceful retreat to Lake Bunyonyi—one of the deepest and most beautiful lakes in Africa—where you\'ll island-hop and unwind in stunning natural surroundings. This cross-border safari offers the perfect balance of adventure and tranquility.',
    destination: 'Uganda',
    duration: 4,
    price: 1741,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Kigali to Queen Elizabeth National Park',
        description: 'Early morning pickup from your Kigali hotel or airport. Begin the scenic journey across the border into Uganda through the Cyanika or Gatuna border crossing. Your guide will assist with all border formalities. Continue through the beautiful landscapes of southwestern Uganda, passing through rolling hills and rural villages. Arrive at Queen Elizabeth National Park in the late afternoon and check into your lodge. After a brief rest, embark on an evening game drive to spot elephants, buffalo, and other wildlife as they become active in the cooler temperatures. Return to the lodge for dinner and overnight.',
        activities: [
          'Border crossing from Rwanda to Uganda',
          'Scenic drive through Ugandan countryside',
          'Lodge check-in at Queen Elizabeth National Park',
          'Evening game drive',
          'Wildlife spotting (elephants, buffalo)',
          'Sunset photography'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Mweya Safari Lodge or similar (Full Board)'
      },
      {
        day: 2,
        title: 'Morning Game Drive & Kazinga Channel Cruise',
        description: 'Rise early for a morning game drive in the Kasenyi plains—prime territory for spotting lions, leopards, and other predators. The early hours offer the best wildlife viewing opportunities as animals are most active. Search for the park\'s famous tree-climbing lions and watch for herds of elephants, Uganda kob, and other antelope species. Return to the lodge for breakfast and relaxation. In the afternoon, embark on a boat cruise along the Kazinga Channel, a natural waterway connecting Lake George and Lake Edward. This is home to the world\'s highest concentration of hippos, and you\'ll also see massive Nile crocodiles, elephants bathing, and countless water birds including pelicans, cormorants, and kingfishers.',
        activities: [
          'Early morning game drive in Kasenyi plains',
          'Lion and leopard spotting',
          'Elephant and antelope viewing',
          'Wildlife photography',
          'Kazinga Channel boat cruise',
          'Hippo and crocodile observation',
          'Birdwatching (pelicans, cormorants, kingfishers)',
          'Elephant bathing viewing'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Mweya Safari Lodge or similar (Full Board)'
      },
      {
        day: 3,
        title: 'Ishasha Sector & Lake Bunyonyi',
        description: 'After breakfast, drive through the Ishasha sector of Queen Elizabeth National Park, keeping a sharp eye out for the famous tree-climbing lions—a unique behavior found in only a few places in Africa. These magnificent cats can often be seen lounging in the branches of fig trees. Continue your journey through the beautiful highlands of southwestern Uganda, passing through terraced hillsides and traditional villages. Arrive at Lake Bunyonyi in the late afternoon—a stunning, deep crater lake surrounded by terraced hills. Check into your lakeside accommodation and enjoy a relaxing evening by the fire, taking in the peaceful atmosphere and breathtaking views of the 29 islands dotting the lake.',
        activities: [
          'Ishasha sector game drive',
          'Tree-climbing lion viewing',
          'Scenic drive through Ugandan highlands',
          'Arrival at Lake Bunyonyi',
          'Lakeside accommodation check-in',
          'Evening relaxation by the fire',
          'Island viewing and photography'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lake Bunyonyi resort or similar (Full Board)'
      },
      {
        day: 4,
        title: 'Canoe Ride & Return to Kigali',
        description: 'Wake up to stunning views of Lake Bunyonyi and its islands. After breakfast, take a morning dugout canoe ride or motorized boat tour to explore the 29 islands of Lake Bunyonyi. Learn about the local culture, visit some of the inhabited islands, and enjoy the serene beauty of this deep, clear lake. The lake is known for being bilharzia-free, making it safe for swimming. After a lakeside lunch, begin the scenic drive back across the border into Rwanda. Your guide will assist with border formalities. Arrive in Kigali in the late afternoon for your departure or hotel drop-off.',
        activities: [
          'Lake Bunyonyi boat excursion',
          'Island-hopping tour',
          'Cultural interaction with local communities',
          'Swimming in the lake (bilharzia-free)',
          'Lakeside lunch',
          'Border crossing back to Rwanda',
          'Return to Kigali',
          'Airport or hotel drop-off'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Cross-border safari (Rwanda to Uganda)',
      'Queen Elizabeth National Park game drives',
      'Tree-climbing lion viewing in Ishasha',
      'Kazinga Channel boat cruise',
      'Hippo and crocodile viewing',
      'Lake Bunyonyi island-hopping',
      'Wildlife photography',
      'Birdwatching',
      'Cultural experiences'
    ],
    images: [
      '/images/trips/queen-elizabeth-hero.jpg',
      '/images/trips/queen-elizabeth-1.jpg',
      '/images/trips/queen-elizabeth-2.jpg',
      '/images/trips/queen-elizabeth-3.jpg',
      '/images/trips/queen-elizabeth-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '3 Days Chimpanzee Trekking and Lake Kivu Adventure',
    description: 'Designed for travelers with limited time, this 3-day "Primate and Lake" circuit packs the best of Southwest Rwanda into one unforgettable trip. You\'ll encounter the fascinating primates of Nyungwe Forest—one of Africa\'s oldest rainforests—and experience the relaxing atmosphere of Rubavu (Gisenyi) on the pristine shores of Lake Kivu. This compact adventure combines thrilling chimpanzee trekking, a spectacular canopy walk above the forest, and lakeside relaxation with unique experiences like visiting Napoleon Island\'s fruit bat colony and exploring natural hot springs. Perfect for those who want maximum adventure in minimum time.',
    destination: 'Rwanda',
    duration: 3,
    price: 1134,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Transfer to Nyungwe via Huye',
        description: 'Depart from Kigali in the morning and begin your journey to Nyungwe Forest. En route, stop at the Ethnographic Museum in Huye (formerly Butare)—Rwanda\'s oldest and most comprehensive museum. Explore exhibits showcasing traditional Rwandan culture, history, and artifacts. Continue through the beautiful terraced hillsides that characterize much of Rwanda\'s landscape. Arrive at Nyungwe Forest in the late afternoon and check into your lodge nestled in the ancient rainforest. Enjoy a relaxing evening surrounded by the sounds of the forest, preparing for tomorrow\'s adventure.',
        activities: [
          'Departure from Kigali',
          'Ethnographic Museum visit in Huye',
          'Cultural and historical education',
          'Scenic drive through terraced hills',
          'Arrival at Nyungwe Forest',
          'Lodge check-in',
          'Evening forest relaxation'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'Nyungwe Forest Lodge or similar (Full Board)'
      },
      {
        day: 2,
        title: 'Chimpanzee Trek & Canopy Walk',
        description: 'Rise early for an adventurous trek into Nyungwe Forest in search of habituated chimpanzee families. Follow your expert guide through the dense rainforest, listening for the distinctive pant-hoots that signal chimpanzee presence. Once you locate a family, spend time observing these intelligent primates as they feed, play, and interact in their natural habitat. The experience is both thrilling and educational. After a forest lunch, prepare for the highlight: walking the 160-meter long canopy bridge suspended high above the forest floor. This exhilarating walk offers unparalleled views of the ancient forest and opportunities to spot birds and monkeys from above. In the late afternoon, transfer to Lake Kivu and check into your lakeside accommodation in Rubavu (Gisenyi).',
        activities: [
          'Early morning chimpanzee trekking',
          'Forest hiking and wildlife tracking',
          'Chimpanzee family observation',
          'Birdwatching (migratory and forest species)',
          'Forest lunch',
          '160-meter Canopy Walkway experience',
          'Aerial forest views',
          'Transfer to Lake Kivu',
          'Lakeside accommodation check-in'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Lake Kivu resort or similar (Full Board)'
      },
      {
        day: 3,
        title: 'Lake Kivu Boat Cruise & Kigali Return',
        description: 'After breakfast, embark on a morning boat cruise on Lake Kivu to Napoleon Island—famous for its massive colony of fruit bats. Watch in awe as thousands of bats take flight or observe them roosting in the trees. The island offers unique photography opportunities and a chance to see this remarkable natural phenomenon. Continue to explore the lake\'s beautiful surroundings before visiting the natural hot springs in Gisenyi, where you can learn about the area\'s volcanic activity. Enjoy a final lakeside lunch with stunning views of the lake and surrounding hills. In the afternoon, begin the scenic drive back to Kigali, arriving in time for your departure or to extend your stay in Rwanda.',
        activities: [
          'Lake Kivu boat cruise',
          'Napoleon Island visit',
          'Fruit bat colony observation',
          'Photography opportunities',
          'Natural hot springs exploration',
          'Volcanic activity education',
          'Lakeside lunch',
          'Scenic return drive to Kigali',
          'Airport or hotel drop-off'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Chimpanzee trekking in Nyungwe Forest',
      '160-meter Canopy Walkway experience',
      'Ethnographic Museum cultural visit',
      'Lake Kivu boat cruise',
      'Napoleon Island fruit bat colony',
      'Natural hot springs exploration',
      'Birdwatching and wildlife observation',
      'Forest and lakeside photography'
    ],
    images: [
      '/images/trips/chimpanzee-lake-3day-hero.jpg',
      '/images/trips/chimpanzee-lake-3day-1.jpg',
      '/images/trips/chimpanzee-lake-3day-2.jpg',
      '/images/trips/chimpanzee-lake-3day-3.jpg',
      '/images/trips/chimpanzee-lake-3day-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: '5 Days Gorilla Trekking (Uganda) and Golden Monkey Experience',
    description: 'The ultimate primate odyssey awaits on this extraordinary 5-day adventure that takes you to the misty mountains of Uganda\'s Bwindi Impenetrable or Mgahinga Gorilla National Park for a face-to-face encounter with Mountain Gorillas—one of the world\'s most endangered and magnificent creatures. You\'ll also trek the rare and endangered Golden Monkeys, known for their striking fur and playful antics. Immerse yourself in the rich culture of the Batwa Pygmies, the original "Keepers of the Forest," through traditional performances and storytelling. This comprehensive safari combines the best of Uganda\'s primate experiences with cultural immersion, stunning mountain scenery, and the adventure of a lifetime. Includes the valuable Uganda Gorilla Permit ($800 value) in the package price.',
    destination: 'Uganda',
    duration: 5,
    price: 2656,
    max_participants: 6,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival & Kigali City Tour',
        description: 'Welcome at Kigali International Airport where you\'ll be met by your professional guide. Begin with a comprehensive city tour of Kigali, one of Africa\'s cleanest and safest capitals. Visit the Kigali Genocide Memorial—a place of remembrance and learning dedicated to the victims of the 1994 genocide. This powerful experience provides important context about Rwanda\'s history and remarkable journey of reconciliation. Explore the city\'s vibrant markets and modern developments. Check into your hotel and enjoy an evening at leisure, preparing for the adventure ahead. Overnight in Kigali.',
        activities: [
          'Airport arrival and meet & greet',
          'Kigali city tour',
          'Kigali Genocide Memorial visit',
          'Learn about Rwanda\'s history and resilience',
          'City exploration',
          'Hotel check-in',
          'Evening at leisure'
        ],
        meals: ['Dinner'],
        accommodation: 'Kigali hotel (Bed & Breakfast)'
      },
      {
        day: 2,
        title: 'Transfer to Bwindi/Mgahinga (Uganda)',
        description: 'After breakfast, begin the scenic drive through the "Little Switzerland of Africa"—the beautiful highlands of southwestern Uganda. The journey takes you through rolling hills, terraced farmland, and traditional villages. Cross the border into Uganda (your guide will assist with all formalities) and continue to Bwindi Impenetrable or Mgahinga Gorilla National Park. The drive offers spectacular views of the Virunga volcanic mountain range. Arrive at your lodge in the late afternoon, strategically located to offer stunning views of the misty mountains. Check in, relax, and attend a pre-trek briefing about tomorrow\'s gorilla trekking experience. Enjoy dinner and rest in preparation for the adventure of a lifetime.',
        activities: [
          'Scenic drive through "Little Switzerland of Africa"',
          'Border crossing to Uganda',
          'Mountain range viewing',
          'Lodge check-in with mountain views',
          'Pre-trek briefing',
          'Gorilla trekking preparation',
          'Evening relaxation'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Bwindi/Mgahinga lodge (Full Board)'
      },
      {
        day: 3,
        title: 'Gorilla Trekking & Batwa Cultural Experience',
        description: 'The highlight of your adventure: gorilla trekking day! After an early breakfast, proceed to the park headquarters for a comprehensive briefing about gorilla behavior, trekking guidelines, and safety precautions. You\'ll be assigned to a gorilla family group and join experienced trackers and guides. Trek into the dense, misty forest in search of mountain gorillas—this can take anywhere from 1 to 6 hours depending on the gorillas\' location. Once you find them, you\'ll spend a magical hour observing these gentle giants as they feed, play, and interact. The experience is truly life-changing. Return to the lodge for lunch and rest. In the afternoon, meet the Batwa Pygmies—the original forest inhabitants—for an authentic cultural experience including traditional performances, storytelling, and demonstrations of their ancient forest knowledge.',
        activities: [
          'Early breakfast',
          'Pre-trek briefing at park headquarters',
          'Mountain gorilla trekking (1-6 hours)',
          'One hour with gorilla family',
          'Gorilla observation and photography',
          'Forest hiking',
          'Return to lodge',
          'Batwa Pygmy cultural experience',
          'Traditional performances',
          'Storytelling and cultural education'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Bwindi/Mgahinga lodge (Full Board)'
      },
      {
        day: 4,
        title: 'Golden Monkey Trekking',
        description: 'After breakfast, head back into the bamboo forests of Mgahinga or the surrounding areas to track the endangered Golden Monkeys. These beautiful primates, with their striking golden-orange fur, are fast-moving and playful, making the trek both challenging and rewarding. Your guide will help you locate a troop, and once found, you\'ll spend time observing their fascinating behavior as they leap through the bamboo. The Golden Monkey trek is typically easier and shorter than gorilla trekking, making it perfect for the day after your gorilla adventure. Return to the lodge for lunch. Spend the afternoon relaxing at the lodge, taking a community walk to interact with local people, or simply enjoying the stunning mountain views and reflecting on your incredible primate encounters.',
        activities: [
          'Breakfast at lodge',
          'Golden Monkey trekking',
          'Bamboo forest exploration',
          'Golden Monkey troop observation',
          'Wildlife photography',
          'Community walk (optional)',
          'Local interaction',
          'Lodge relaxation',
          'Mountain views'
        ],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: 'Bwindi/Mgahinga lodge (Full Board)'
      },
      {
        day: 5,
        title: 'Return to Kigali',
        description: 'Enjoy a final Ugandan breakfast with views of the misty mountains. Begin the scenic drive back across the border into Rwanda. Your guide will assist with border formalities. The journey takes you through beautiful landscapes, and you\'ll have opportunities for last-minute photography and souvenir shopping. Arrive in Kigali in the late afternoon. Depending on your flight schedule, you may have time for some last-minute shopping or a final meal in the city. Transfer to Kigali International Airport for your departure flight, or extend your stay to explore more of Rwanda. End of tour.',
        activities: [
          'Final breakfast with mountain views',
          'Scenic drive back to Rwanda',
          'Border crossing',
          'Last-minute photography',
          'Souvenir shopping (optional)',
          'Arrival in Kigali',
          'Airport transfer',
          'Departure'
        ],
        meals: ['Breakfast', 'Lunch'],
        accommodation: 'N/A (Departure)'
      }
    ],
    activities: [
      'Mountain gorilla trekking in Uganda (permit included)',
      'Golden Monkey trekking',
      'Batwa Pygmy cultural experience',
      'Kigali city tour and Genocide Memorial',
      'Cross-border safari (Rwanda to Uganda)',
      'Mountain range viewing',
      'Community walks and local interaction',
      'Wildlife photography',
      'Cultural performances and storytelling'
    ],
    images: [
      '/images/trips/gorilla-golden-monkey-hero.jpg',
      '/images/trips/gorilla-golden-monkey-1.jpg',
      '/images/trips/gorilla-golden-monkey-2.jpeg',
      '/images/trips/gorilla-golden-monkey-3.jpg',
      '/images/trips/gorilla-golden-monkey-4.jpg'
    ],
    insurance: 'Travel insurance provided by Akagera Aviator. Coverage includes medical emergencies, trip cancellation, and personal accident protection up to $50,000. Insurance certificate will be provided upon booking confirmation.'
  },
  {
    title: 'Lobéké National Park Expedition',
    description: `Integrated into the Congo Basin, Lobéké National Park (part of the tri-national UNESCO World-Heritage landscape) is famed for its forest clearings that attract elephants, gorillas, chimpanzees and a vast array of birdlife. This six-day over-land adventure runs from Yaoundé to the heart of the park, combining wildlife viewing with cultural encounters in remote villages.`,
    destination: 'Cameroon – Lobéké National Park',
    duration: 6,
    price: 0,
    max_participants: 12,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      { day: 1, title: 'Yaoundé → Bertoua → Batouri', description: 'Drive 440 km on tarred road (≈7 h). Overnight in Batouri motel.', activities: [], meals: [], accommodation: 'Batouri motel' },
      { day: 2, title: 'Batouri → Yokadouma → Mambélé', description: '360 km dirt road (≈7 h). Overnight in Mambélé motel.', activities: [], meals: [], accommodation: 'Mambélé motel' },
      { day: 3, title: 'Enter Lobéké National Park', description: 'Morning transfer, first forest “bai” wildlife viewing, set up tents, overnight camping.', activities: [], meals: [], accommodation: 'Tented camp' },
      { day: 4, title: 'Full-day Safari in Lobéké', description: 'Explore multiple bais for elephants, gorillas & birdlife. Overnight camping.', activities: [], meals: [], accommodation: 'Tented camp' },
      { day: 5, title: 'Lobéké → Yokadouma', description: 'Morning safari then drive back; overnight in Yokadouma motel.', activities: [], meals: [], accommodation: 'Yokadouma motel' },
      { day: 6, title: 'Yokadouma → Yaoundé', description: 'Return drive via Bertoua. End of tour.', activities: [], meals: [], accommodation: 'N/A' }
    ],
    activities: [
      'Forest bai wildlife observation',
      'Gorilla & chimpanzee tracking',
      'Elephant & buffalo viewing',
      'Bird-watching',
      'Rain-forest camping',
      'Over-land cultural travel'
    ],
    images: ['/images/trips/lobeke-hero.jpg',
              '/images/trips/lobeke-1.jpg',
              '/images/trips/lobeke-2.jpg',
              '/images/trips/lobeke-3.jpg',
              '/images/trips/lobeke-4.jpg',
    ]
  },
  {
    title: 'Nki National Park Wilderness Expedition',
    description: `Often called the last true wilderness of Cameroon, Nki National Park protects more than 300,000 ha of pristine Congo-Basin rainforest harbouring ~6,000 Western lowland gorillas, forest elephants, rare birds and the semi-nomadic Baka people. This 12-day expedition combines long river cruises on the Ngoko, deep-forest camping and authentic encounters with the local communities.`,
    destination: 'Cameroon – Nki National Park',
    duration: 12,
    price: 0,
    max_participants: 12,
    current_participants: 0,
    status: 'active',
    detailed_itinerary: [
      { day: 1, title: 'Arrival in Yaoundé', description: 'Airport meet-and-greet, transfer to Hôtel Franco, dinner & overnight.', activities: [], meals: ['Dinner'], accommodation: 'Hôtel Franco (Yaoundé)' },
      { day: 2, title: 'Yaoundé → Bertoua → Batouri', description: 'Drive 440 km on tarred road (≈7 h). Overnight in Batouri motel.', activities: [], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Batouri motel' },
      { day: 3, title: 'Batouri → Yokadouma → Mambélé → Mouloundou', description: '420 km untarred road (≈9 h) through forest towns to river port of Mouloundou. Overnight motel.', activities: [], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Mouloundou motel' },
      { day: 4, title: 'Ngoko River Cruise (Day 1)', description: 'Board motorised canoe; begin 240 km upstream journey. Village visit en-route. Camp on riverbank (Cameroon or Congo side).', activities: ['River navigation','Village interaction'], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Tented camp' },
      { day: 5, title: 'Ngoko River Cruise (Day 2)', description: 'Continue cruise to Nki NP boundary; wildlife spotting from boat. Overnight riverside camp.', activities: ['Birdwatching','Photography'], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Tented camp' },
      { day: 6, title: 'Into Nki National Park', description: 'Establish base camp near Ibambe Bai; afternoon forest walk with trackers.', activities: ['Forest hike','Gorilla & elephant tracking'], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Tented camp' },
      { day: 7, title: 'Exploring Bais & Wildlife', description: 'Full-day safari visiting mineral licks frequented by wildlife; camera-trap checks.', activities: ['Wildlife viewing','Camera-trap inspection'], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Tented camp' },
      { day: 8, title: 'Cultural Exchange with Baka', description: 'Spend the day with Baka Pygmies: learn hunting songs, medicinal plants & net-making.', activities: ['Cultural immersion','Ethnobotany'], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Tented camp' },
      { day: 9, title: 'Return Cruise (Day 1)', description: 'Break camp, begin downstream voyage, overnight in riverside village.', activities: ['River navigation'], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Tented camp / village homestay' },
      { day: 10, title: 'Return Cruise (Day 2)', description: 'Continue to Mouloundou, arrive late afternoon, motel overnight.', activities: [], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Mouloundou motel' },
      { day: 11, title: 'Mouloundou → Batouri', description: 'Road journey north-west, overnight Batouri motel.', activities: [], meals: ['Breakfast','Lunch','Dinner'], accommodation: 'Batouri motel' },
      { day: 12, title: 'Batouri → Yaoundé', description: 'Final drive back to Yaoundé; tour ends.', activities: [], meals: ['Breakfast','Lunch'], accommodation: 'N/A' }
    ],
    activities: [
      'Motorised canoe expedition on Ngoko River',
      'Deep-forest wildlife observation',
      'Gorilla & elephant tracking',
      'Birdwatching (250+ species)',
      'Camping in pristine rainforest',
      'Cultural immersion with Baka Pygmies'
    ],
    images: [
      '/images/trips/chimpanzee-uganda-hero.jpg',
      '/images/trips/chimpanzee-uganda-1.jpg',
      '/images/trips/chimpanzee-uganda-2.jpg',
      '/images/trips/chimpanzee-uganda-4.jpg',
      '/images/trips/chimpanzee-trek-3.jpg'
    ],
    highlights: [
      'Visit a world-class primate sanctuary and rehabilitation center',
      'Observe gorillas, chimpanzees, and various monkey species in naturalistic enclosures',
      'Learn about primate conservation efforts in Cameroon',
      'Walk through beautiful forest trails with knowledgeable guides',
      'Support ethical wildlife tourism and conservation initiatives',
      'Perfect for families and wildlife enthusiasts of all ages',
      'Convenient day trip from Yaoundé'
    ],
    included: [
      'English/French speaking guide',
      'Private transportation from Yaoundé',
      'Park entrance and conservation fees',
      'Guided walking tour of the sanctuary',
      'Bottled water',
      'All government taxes and service charges'
    ]
  },
  {
  title: '3 Days 2 Nights: Serengeti Safari From Zanzibar & Balloon Safari',
  description: 'Experience an unforgettable 3-day safari in Serengeti National Park starting from Zanzibar, featuring thrilling game drives, a hot air balloon safari, and night game drives. Encounter the Big Five and witness the stunning landscapes of the Serengeti from both ground and sky.',
  destination: 'Serengeti National Park, Tanzania',
  duration: 3,
  price: 2792, // Price per adult
  max_participants: 12,
  current_participants: 0,
  status: 'active',
  product_code: 'sgt3d2n',
  highlights: [
    'Hot air balloon safari at sunrise',
    'Day and night game drives in Serengeti',
    'See the Big Five in their natural habitat',
    'Scenic flight from Zanzibar to Serengeti',
    'Bush breakfast in the wild',
    'Professional guide and open-top safari vehicle'
  ],
  included: [
    'Roundtrip flight from Zanzibar to Serengeti',
    '2 nights at Africa Safari Serengeti Ikoma (full board)',
    'All park fees and conservation charges',
    'Hot air balloon safari experience',
    'Professional English-speaking guide',
    'All game drives in 4x4 safari vehicle',
    'Bush breakfast and picnic lunches',
    'Night game drive experience',
    'All airport/hotel transfers',
    'Bottled water during game drives',
    'All government taxes and VAT'
  ],
  notIncluded: [
    'International flights to Zanzibar',
    'Travel insurance',
    'Alcoholic and soft drinks',
    'Tips for guides and camp staff',
    'Items of personal nature',
    'Visa fees'
  ],
  difficulty: 'moderate',
  rating: 5.0,
  numReviews: 0, // New trip, no reviews yet
  detailed_itinerary: [
    {
      day: 1,
      title: 'Arrival & Start Serengeti Safari',
      description: 'Morning flight from Zanzibar to Serengeti followed by afternoon game drive and night safari.',
      activities: [
        'Flight to Serengeti',
        'Afternoon game drive',
        'Night safari',
        'Wildlife photography'
      ],
      meals: ['Lunch', 'Dinner'],
      accommodation: 'Africa Safari Serengeti Ikoma'
    },
    {
      day: 2,
      title: 'Full-Day Serengeti Safari',
      description: 'Full day exploring different areas of Serengeti with game drives and wildlife viewing.',
      activities: [
        'Morning game drive',
        'Afternoon game drive',
        'Wildlife spotting',
        'Scenic landscape viewing'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Africa Safari Serengeti Ikoma'
    },
    {
      day: 3,
      title: 'Hot Air Balloon Safari & Return',
      description: 'Early morning balloon safari followed by bush breakfast and return flight to Zanzibar.',
      activities: [
        'Hot air balloon safari',
        'Bush breakfast',
        'Return flight to Zanzibar'
      ],
      meals: ['Breakfast'],
      accommodation: 'N/A'
    }
  ],
  images: [
    '/images/trips/serengeti-1.jpg',
    '/images/trips/serengeti-2.jpg',
    '/images/trips/serengeti-3.jpg',
    '/images/trips/serengeti-balloon.jpg'
  ],
  important_notes: [
    'Minimum age for balloon safari is 7 years',
    'Single supplement available on request',
    'Children rates apply for ages 3-9 years',
    'Flight schedule subject to change based on weather conditions',
    'What to pack: Neutral-colored clothing, hat, sunscreen, binoculars, camera'
  ]
},
{
  title: '3 Days 2 Nights: Serengeti Safari From Zanzibar & Balloon Safari',
  description: 'Join our 3-day safari to Serengeti National Park which starts from Zanzibar, filled with unforgettable wildlife encounters and a unique hot air balloon experience. Discover the park\'s diverse ecosystems, observe the Big Five, and enjoy both day and night explorations in this breathtaking African wilderness.',
  destination: 'Serengeti National Park, Tanzania',
  duration: 3,
  price: 2792,
  max_participants: 12,
  current_participants: 0,
  status: 'active',
  product_code: 'sgt3d2n',
  highlights: [
    'Hot air balloon safari over Serengeti plains',
    'Game drives to spot the Big Five',
    'Night game drive experience',
    'Scenic flight from Zanzibar to Serengeti',
    'Bush breakfast in the wild',
    'Professional guide and open-top safari vehicle'
  ],
  included: [
    'Roundtrip flight from Zanzibar to Serengeti',
    '2 nights at Africa Safari Serengeti Ikoma (full board)',
    'All park fees and conservation charges',
    'Hot air balloon safari experience',
    'Professional English-speaking guide',
    'All game drives in 4x4 safari vehicle',
    'Bush breakfast and picnic lunches',
    'Night game drive experience',
    'All airport/hotel transfers',
    'Bottled water during game drives',
    'All government taxes and VAT'
  ],
  notIncluded: [
    'International flights to Zanzibar',
    'Travel insurance',
    'Alcoholic and soft drinks',
    'Tips for guides and camp staff',
    'Items of personal nature',
    'Visa fees'
  ],
  difficulty: 'moderate',
  rating: 5.0,
  numReviews: 0,
  detailed_itinerary: [
    {
      day: 1,
      title: 'Arrival & Start Serengeti Safari',
      description: 'Morning flight from Zanzibar to Serengeti followed by afternoon game drive and night safari.',
      activities: [
        'Hotel pick-up in Zanzibar',
        'Flight to Seronera airstrip',
        'Afternoon game drive',
        'Night safari',
        'Wildlife photography'
      ],
      meals: ['Lunch', 'Dinner'],
      accommodation: 'Africa Safari Serengeti Ikoma'
    },
    {
      day: 2,
      title: 'Full-Day Serengeti Safari',
      description: 'Full day exploring different areas of Serengeti with game drives and wildlife viewing.',
      activities: [
        'Morning game drive',
        'Coffee/tea break in the bush',
        'Picnic lunch in the wild',
        'Afternoon game drive',
        'Wildlife spotting',
        'Scenic landscape viewing'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Africa Safari Serengeti Ikoma'
    },
    {
      day: 3,
      title: 'Hot Air Balloon Safari & Return',
      description: 'Early morning balloon safari followed by bush breakfast and return flight to Zanzibar.',
      activities: [
        'Hot air balloon safari at sunrise',
        'Bush breakfast',
        'Transfer to Seronera airstrip',
        'Flight back to Zanzibar',
        'Hotel drop-off'
      ],
      meals: ['Breakfast'],
      accommodation: 'N/A'
    }
  ],
  images: [
    '/images/trips/serengeti-1.jpg',
    '/images/trips/serengeti-2.jpg',
    '/images/trips/serengeti-3.jpg',
    '/images/trips/serengeti-balloon.jpg'
  ],
  important_notes: [
    'Minimum age for balloon safari is 7 years',
    'Single supplement available on request',
    'Child rate: $1225 (ages 3-9 years)',
    'Flight schedule subject to change based on weather conditions',
    'What to pack: Neutral-colored clothing, hat, sunscreen, binoculars, camera',
    'Travel insurance is highly recommended'
  ]
  },
  {
  title: '4 Days Tanzania Safari: Ngorongoro Crater & Tarangire National Park',
  description: 'Experience the best of Tanzania\'s wildlife with our 4-day safari. Explore Tarangire National Park, famous for its massive elephant herds and ancient baobab trees, and the Ngorongoro Crater, a UNESCO World Heritage Site teeming with diverse wildlife including the rare black rhino. This private safari offers a flexible, personalized experience with your own safari vehicle and local English-speaking guide.',
  destination: 'Tarangire & Ngorongoro, Tanzania',
  duration: 4,
  price: 1550, // Price per adult for 2 people
  max_participants: 6,
  current_participants: 0,
  status: 'active',
  product_code: 'tza4d',
  highlights: [
    'Game drives in Tarangire National Park',
    'Full-day exploration of Ngorongoro Crater',
    'Chance to see the Big Five',
    'Private safari vehicle with pop-up roof',
    'Professional English-speaking guide',
    'Stunning landscapes and photography opportunities'
  ],
  included: [
    'All park fees and conservation charges',
    '3 nights accommodation (lodge or camping option)',
    'Professional English-speaking safari guide',
    'Private 4x4 safari vehicle with pop-up roof',
    'All game drives and activities as per itinerary',
    'Meals as specified (full board during safari)',
    'Bottled water during game drives',
    'All government taxes and VAT',
    'Airport transfers (Kilimanjaro International Airport)'
  ],
  notIncluded: [
    'International flights',
    'Tanzania visa fees',
    'Travel insurance',
    'Alcoholic and soft drinks',
    'Tips for guides and camp staff',
    'Personal expenses and souvenirs',
    'Optional activities not mentioned in the itinerary'
  ],
  difficulty: 'moderate',
  rating: 5.0,
  numReviews: 0,
  detailed_itinerary: [
    {
      day: 1,
      title: 'Arrival in Tanzania',
      description: 'Welcome to Tanzania! Upon arrival at Kilimanjaro International Airport, you\'ll be greeted by your private guide and transferred to your hotel in Arusha.',
      activities: [
        'Airport meet and greet',
        'Transfer to Arusha',
        'Hotel check-in',
        'Safari briefing'
      ],
      meals: ['Dinner'],
      accommodation: 'Lodge in Arusha'
    },
    {
      day: 2,
      title: 'Tarangire National Park',
      description: 'Full day exploring Tarangire National Park, famous for its massive elephant herds and ancient baobab trees.',
      activities: [
        'Morning game drive',
        'Wildlife viewing at Tarangire River',
        'Picnic lunch in the bush',
        'Afternoon game drive',
        'Sunset photography'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Lodge/Camp near Tarangire'
    },
    {
      day: 3,
      title: 'Ngorongoro Crater',
      description: 'Full day exploring the Ngorongoro Crater, a UNESCO World Heritage Site and one of Africa\'s greatest wildlife havens.',
      activities: [
        'Descend into the crater',
        'Game drive in search of the Big Five',
        'Picnic lunch at the crater floor',
        'Wildlife photography',
        'Ascend from the crater in the evening'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Lodge/Camp near Ngorongoro'
    },
    {
      day: 4,
      title: 'Departure',
      description: 'Transfer back to Kilimanjaro International Airport for your departure flight or extend your trip to Zanzibar.',
      activities: [
        'Breakfast at the lodge',
        'Scenic drive back to Arusha',
        'Optional cultural tour (time permitting)',
        'Airport transfer'
      ],
      meals: ['Breakfast'],
      accommodation: 'N/A'
    }
  ],
  images: [
    '/images/trips/ngorongoro-1.jpg',
    '/images/trips/tarangire-1.jpg',
    '/images/trips/ngorongoro-2.jpg',
    '/images/trips/tarangire-2.jpg'
  ],
  important_notes: [
    'Child rate: $1010 (ages 3-9 years)',
    'Camping option available at $1150 per adult, $930 per child',
    'Single supplement available on request',
    'Group discounts available for 3+ people',
    'Extend your trip with a Zanzibar beach getaway',
    'Travel insurance is highly recommended',
    'Vaccinations recommended: Yellow Fever, Malaria prophylaxis'
  ]
  },
  {
    title: 'Zanzibar 4 Days 3 Nights Package',
    description: 'Stress-free 4-day holiday in Zanzibar with hand-picked hotel, transfers and curated excursions: Stone Town tour, Spice farm visit, Prison Island and Mnemba dolphin & snorkeling trip.',
    destination: 'Zanzibar, Tanzania',
    duration: 4,
    price: 890,
    max_participants: 30,
    current_participants: 0,
    status: 'active',
    product_code: 'znz4d3n',
    highlights: [
      'Stone Town UNESCO heritage tour',
      'Spice farm tasting experience',
      'Giant Aldabra tortoises at Prison Island',
      'Swim with dolphins near Mnemba Atoll',
      'Snorkeling vibrant coral reefs',
      'Daily breakfast & dinner included'
    ],
    included: [
      '3-night accommodation (3★/4★/5★ option)',
      'Return airport ↔ hotel transfers',
      'Breakfast & dinner daily',
      'Transport during listed excursions',
      'Entrance fees to sites & parks',
      'Professional English-speaking driver/guide',
      'Drinking water on excursions',
      'Local SIM card',
      'All taxes and VAT'
    ],
    notIncluded: [
      'International flights',
      'Travel & medical insurance',
      'Lunches and extra drinks',
      'Personal expenses & souvenirs',
      'Tips and gratuities'
    ],
    difficulty: 'easy',
    rating: 4.8,
    numReviews: 24,
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival – Transfer to Hotel',
        description: 'Meet & greet at Zanzibar airport. Private transfer to beach hotel. Rest of the day at leisure.',
        activities: ['Private airport transfer', 'Hotel check-in & relaxation'],
        meals: ['Dinner'],
        accommodation: 'Beach resort in Zanzibar'
      },
      {
        day: 2,
        title: 'Stone Town • Spice Farm • Prison Island',
        description: 'Guided Stone Town walking tour, aromatic Spice Farm visit with local lunch, and boat trip to Prison Island to see giant tortoises.',
        activities: ['Stone Town heritage tour', 'Spice tasting & lunch', 'Boat to Prison Island', 'Giant tortoise sanctuary'],
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Beach resort in Zanzibar'
      },
      {
        day: 3,
        title: 'Mnemba Dolphins & Snorkeling (Half-Day)',
        description: 'Morning speed-boat to Mnemba Atoll: swim with dolphins responsibly and snorkel colourful reefs. Afternoon free.',
        activities: ['Dolphin spotting', 'Snorkeling gear provided', 'Relax on Matemwe beach'],
        meals: ['Breakfast', 'Dinner'],
        accommodation: 'Beach resort in Zanzibar'
      },
      {
        day: 4,
        title: 'Departure – Transfer to Airport',
        description: 'Check-out and private transfer to the airport according to flight schedule.',
        activities: ['Hotel check-out', 'Private airport transfer'],
        meals: ['Breakfast'],
        accommodation: 'N/A'
      }
    ],
    images: [
      '/images/trips/zanzibar-hero.jpg',
      '/images/trips/zanzibar-1.jpg',
      '/images/trips/zanzibar-2.jpg',
      '/images/trips/zanzibar-3.jpg',
      '/images'
    ]
  },
  {
  title: 'Zanzibar 6 Days 5 Nights Package',
  description: 'Experience the best of Zanzibar with this comprehensive 6-day package including beach relaxation, cultural tours, and water activities. Enjoy the perfect blend of adventure and relaxation with visits to Stone Town, Spice Farms, Prison Island, and Mnemba Atoll for dolphin swimming and snorkeling.',
  destination: 'Zanzibar, Tanzania',
  duration: 6,
  price: 1250, // Base price, can be adjusted based on hotel category
  max_participants: 20,
  current_participants: 0,
  status: 'active',
  product_code: 'znz6d5n',
  highlights: [
    'Full-day Safari Blue trip with snorkeling',
    'Stone Town UNESCO heritage tour',
    'Spice farm tasting experience',
    'Giant Aldabra tortoises at Prison Island',
    'Dolphin swimming near Mnemba Atoll',
    'Relaxing beach days'
  ],
  included: [
    '5-night accommodation (3★/4★/5★ option)',
    'Return airport transfers',
    'Breakfast & dinner daily',
    'Full-day Safari Blue trip with lunch',
    'Stone Town & Spice Farm tour with lunch',
    'Prison Island visit',
    'Half-day dolphin & snorkeling trip',
    'Transport during all excursions',
    'Entrance fees to all sites & parks',
    'Professional English-speaking guide',
    'Drinking water during excursions',
    'Local SIM card',
    'All government taxes and VAT'
  ],
  notIncluded: [
    'International flights',
    'Travel insurance',
    'Lunch on non-excursion days',
    'Alcoholic and soft drinks',
    'Tips for guides and hotel staff',
    'Personal expenses and souvenirs',
    'Optional activities not mentioned'
  ],
  difficulty: 'easy',
  rating: 4.9,
  numReviews: 0,
  detailed_itinerary: [
    {
      day: 1,
      title: 'Arrival in Zanzibar',
      description: 'Welcome to Zanzibar! Upon arrival at Zanzibar International Airport, you\'ll be greeted by our driver and transferred to your hotel.',
      activities: [
        'Airport meet and greet',
        'Hotel transfer',
        'Check-in and orientation',
        'Beach relaxation'
      ],
      meals: ['Dinner'],
      accommodation: 'Beachfront hotel in Zanzibar'
    },
    {
      day: 2,
      title: 'Full-Day Safari Blue Trip',
      description: 'Full day sailing and snorkeling adventure in the beautiful waters of Menai Bay.',
      activities: [
        'Sailing to Kwale Island',
        'Snorkeling in coral reefs',
        'Sandbank relaxation',
        'Seafood barbecue lunch',
        'Exotic fruit tasting'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Beachfront hotel in Zanzibar'
    },
    {
      day: 3,
      title: 'Free Day at Leisure',
      description: 'Enjoy a relaxing day at your own pace. Optional activities can be arranged.',
      activities: [
        'Beach relaxation',
        'Hotel facilities',
        'Optional activities (at extra cost)'
      ],
      meals: ['Breakfast', 'Dinner'],
      accommodation: 'Beachfront hotel in Zanzibar'
    },
    {
      day: 4,
      title: 'Stone Town & Spice Farm Tour',
      description: 'Explore the cultural heart of Zanzibar with visits to Stone Town and a spice farm.',
      activities: [
        'Stone Town walking tour',
        'Spice farm visit and tasting',
        'Traditional Swahili lunch',
        'Prison Island visit',
        'Giant tortoise encounter'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Beachfront hotel in Zanzibar'
    },
    {
      day: 5,
      title: 'Mnemba Dolphin & Snorkeling',
      description: 'Half-day excursion to swim with dolphins and explore coral reefs.',
      activities: [
        'Dolphin swimming',
        'Snorkeling at Mnemba Atoll',
        'Marine life viewing',
        'Beach time at Matemwe'
      ],
      meals: ['Breakfast', 'Dinner'],
      accommodation: 'Beachfront hotel in Zanzibar'
    },
    {
      day: 6,
      title: 'Departure',
      description: 'Transfer to Zanzibar International Airport for your departure flight.',
      activities: [
        'Hotel check-out',
        'Airport transfer',
        'Flight check-in'
      ],
      meals: ['Breakfast'],
      accommodation: 'N/A'
    }
  ],
  images: [
    '/images/trips/zanzibar-beach-1.jpg',
    '/images/trips/zanzibar-stone-town.jpg',
    '/images/trips/zanzibar-dolphins.jpg',
    '/images/trips/zanzibar-spice-farm.jpg'
  ],
  important_notes: [
    'Hotel categories available: 3★, 4★, or 5★ (prices vary)',
    'Child rates available (ages 3-9)',
    'Single supplement available on request',
    'Minimum age for dolphin swimming: 6 years',
    'What to pack: Swimwear, sunscreen, hat, comfortable walking shoes, camera',
    'Vaccinations recommended: Yellow Fever, Malaria prophylaxis'
  ]
},
{
  title: '3 Days Masai Mara Safari',
  description: 'Experience the magic of Masai Mara with this 3-day safari adventure. Witness the Big Five, enjoy breathtaking landscapes, and immerse yourself in Maasai culture. This budget-friendly package includes comfortable accommodation, game drives, and all park fees.',
  destination: 'Masai Mara, Kenya',
  duration: 3,
  price: 1100, // Starting price per person
  max_participants: 12,
  current_participants: 0,
  status: 'active',
  product_code: 'mmr3d',
  highlights: [
    'Game drives in search of the Big Five',
    'Visit to a traditional Maasai village',
    'Scenic views of the Great Rift Valley',
    'Professional safari guide',
    'Comfortable tented camp accommodation',
    'All-inclusive package'
  ],
  included: [
    '2 nights accommodation at Enchoro Wildlife Camp',
    'All park entrance fees',
    'Transport in 4x4 safari vehicle',
    'Professional English-speaking driver/guide',
    'All game drives as per itinerary',
    'Meals as specified (3 meals per day)',
    'Bottled drinking water during game drives',
    'Maasai village visit'
  ],
  notIncluded: [
    'International flights',
    'Travel insurance',
    'Visa fees',
    'Alcoholic and soft drinks',
    'Tips for guides and camp staff',
    'Personal expenses and souvenirs',
    'Optional activities not mentioned',
    'Extra game drives (additional cost)'
  ],
  difficulty: 'moderate',
  rating: 4.8,
  numReviews: 0,
  detailed_itinerary: [
    {
      day: 1,
      title: 'Nairobi to Masai Mara',
      description: 'Scenic drive from Nairobi to Masai Mara with a stop at the Great Rift Valley viewpoint.',
      activities: [
        'Pickup from Nairobi hotel',
        'Scenic drive through Great Rift Valley',
        'Photo stop at Rift Valley viewpoint',
        'Lunch at the camp',
        'Evening Maasai village visit',
        'Cultural activities with Maasai community'
      ],
      meals: ['Lunch', 'Dinner'],
      accommodation: 'Enchoro Wildlife Camp'
    },
    {
      day: 2,
      title: 'Full Day in Masai Mara',
      description: 'Full day game drive in search of the Big Five and other wildlife.',
      activities: [
        'Early morning game drive',
        'Picnic lunch at Mara River',
        'Afternoon game drive',
        'Wildlife photography',
        'Sundowner drinks (own expense)'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Enchoro Wildlife Camp'
    },
    {
      day: 3,
      title: 'Masai Mara to Nairobi',
      description: 'Morning game drive followed by return journey to Nairobi.',
      activities: [
        'Early morning game drive',
        'Breakfast at the camp',
        'Return journey to Nairobi',
        'Picnic lunch en route',
        'Drop-off at your hotel'
      ],
      meals: ['Breakfast', 'Lunch'],
      accommodation: 'N/A'
    }
  ],
  images: [
    '/images/trips/masaimara-1.jpg',
    '/images/trips/masaimara-2.jpg',
    '/images/trips/masaimara-3.jpg',
    '/images/trips/masaimara-4.jpg'
  ],
  important_notes: [
    'Starting price is $1100 per person (based on double occupancy)',
    'Single supplement available on request',
    'Optional evening game drive available at extra cost: $100 (Jan-Jun) or $200 (Jul-Dec)',
    'What to pack: Neutral-colored clothing, hat, sunscreen, binoculars, camera',
    'Vaccinations recommended: Yellow Fever, Malaria prophylaxis',
    'Best time to visit: July-October for the Great Migration',
    'Children under 3 years stay free of charge'
  ],
},
  {
  title: '4 Days Amboseli, Tsavo West & Tsavo East Safari to Mombasa',
  description: 'Experience the best of Kenya\'s wildlife on this 4-day safari adventure, featuring Amboseli National Park with its iconic views of Mount Kilimanjaro, and the diverse landscapes of Tsavo West and Tsavo East National Parks. Conclude your journey with a transfer to the beautiful beaches of Mombasa, Diani, Watamu, or Malindi.',
  destination: 'Amboseli, Tsavo West, Tsavo East, Kenya',
  duration: 4,
  price: 1630, // Starting price per person (based on 4 pax)
  max_participants: 6,
  current_participants: 0,
  status: 'active',
  product_code: 'ke4d',
  highlights: [
    'Breathtaking views of Mount Kilimanjaro in Amboseli',
    'Visit to Mzima Springs in Tsavo West',
    'Game drives in three different national parks',
    'Chance to see the Big Five',
    'Scenic landscapes and diverse wildlife',
    'Comfortable lodge accommodations'
  ],
  included: [
    '3 nights accommodation in standard lodges',
    'All park entrance fees',
    'Transport in 4x4 safari vehicle with pop-up roof',
    'Professional English-speaking driver/guide',
    'All game drives as per itinerary',
    'Meals as specified (full board during safari)',
    'Bottled drinking water during game drives',
    'Return transfers to Mombasa/Diani/Watamu/Malindi'
  ],
  notIncluded: [
    'International flights',
    'Travel insurance',
    'Visa fees',
    'Alcoholic and soft drinks',
    'Tips for guides and lodge staff',
    'Personal expenses and souvenirs',
    'Optional activities not mentioned',
    'Accommodation in Mombasa/Diani/Watamu/Malindi'
  ],
  difficulty: 'moderate',
  rating: 4.7,
  numReviews: 0,
  detailed_itinerary: [
    {
      day: 1,
      title: 'Nairobi to Amboseli National Park',
      description: 'Scenic drive to Amboseli with afternoon game drives and views of Mount Kilimanjaro.',
      activities: [
        'Pickup from Nairobi hotel/airport',
        'Scenic drive to Amboseli (4.5 hours)',
        'Afternoon game drive',
        'Wildlife viewing with Kilimanjaro backdrop'
      ],
      meals: ['Lunch', 'Dinner'],
      accommodation: 'Manjaro Tented Camp'
    },
    {
      day: 2,
      title: 'Amboseli to Tsavo West',
      description: 'Morning game drive in Amboseli followed by transfer to Tsavo West National Park.',
      activities: [
        'Early morning game drive',
        'Breakfast at the lodge',
        'Transfer to Tsavo West (3 hours)',
        'Visit Mzima Springs',
        'Afternoon game drive'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Ngulia Safari Lodge'
    },
    {
      day: 3,
      title: 'Tsavo West to Tsavo East',
      description: 'Game drives in Tsavo West before heading to Tsavo East National Park.',
      activities: [
        'Early morning game drive',
        'Breakfast at the lodge',
        'Transfer to Tsavo East (3 hours)',
        'Afternoon game drive',
        'Visit to Aruba Dam'
      ],
      meals: ['Breakfast', 'Lunch', 'Dinner'],
      accommodation: 'Voi Safari Lodge'
    },
    {
      day: 4,
      title: 'Tsavo East to Mombasa/Diani/Watamu',
      description: 'Morning game drive followed by transfer to the coast.',
      activities: [
        'Early morning game drive',
        'Breakfast at the lodge',
        'Transfer to Mombasa (4 hours)',
        'Drop-off at your coastal hotel'
      ],
      meals: ['Breakfast'],
      accommodation: 'N/A'
    }
  ],
  images: [
    '/images/trips/amboseli-kilimanjaro.jpg',
    '/images/trips/tsavo-west.jpg',
    '/images/trips/tsavo-east.jpg',
    '/images/trips/kenya-safari.jpg'
  ],
  important_notes: [
    'Pricing per person: 1 pax $1,630 | 2 pax $1,100 | 3 pax $930 | 4+ pax $830',
    'Single supplement available on request',
    'What to pack: Neutral-colored clothing, hat, sunscreen, binoculars, camera',
    'Vaccinations recommended: Yellow Fever, Malaria prophylaxis',
    'Best time to visit: June-October and January-February for best wildlife viewing',
    'Children rates available on request'
  ],

  },
  {
    title: 'Egypt Budget Travel Packages | 10 Days Egypt Tour',
    description: 'See the best of Egypt without breaking the bank with this carefully curated 10-day budget itinerary covering Cairo, Aswan, Luxor and Hurghada. Experience ancient wonders, vibrant culture and Red Sea relaxation—all at an unbeatable price.',
    destination: 'Cairo, Aswan, Luxor, Hurghada, Egypt',
    duration: 10,
    price: 950, // Starting price per person (double occupancy)
    max_participants: 16,
    current_participants: 0,
    status: 'active',
    product_code: 'egy10d',
    highlights: [
      'Giza Pyramids & Sphinx',
      'Grand Egyptian Museum',
      'Citadel of Saladin & Coptic Cairo',
      'Philae Temple & High Dam',
      'Abu Simbel Temples',
      'Valley of the Kings & Karnak Temple',
      'Relaxing Red Sea stay in Hurghada',
      'Budget-friendly overnight trains & buses'
    ],
    included: [
      'Pickup & drop-off at Cairo International Airport',
      '3 nights in Cairo B&B hotel',
      '1 night in Aswan B&B hotel',
      '2 nights in Luxor B&B hotel',
      '2 nights in Hurghada B&B hotel',
      'VIP seating train tickets (Cairo–Aswan & Luxor–Cairo)',
      'Train ticket Aswan–Luxor',
      'Tourist bus tickets (Luxor–Hurghada & Hurghada–Cairo)',
      'Private sightseeing tours with English-speaking Egyptologist guide',
      'All transfers by air-conditioned vehicle',
      'Bottled water during excursions',
      'All taxes & service charge'
    ],
    notIncluded: [
      'International airfare',
      'Entry visa to Egypt',
      'Entrance fees to sightseeing locations',
      'Optional tours (e.g., Hot Air Balloon, Giftun Island snorkeling)',
      'Tipping',
      'Travel insurance',
      'Meals not specified',
      'Personal expenses & souvenirs'
    ],
    difficulty: 'easy',
    rating: 4.9,
    numReviews: 0,
    detailed_itinerary: [
      {
        day: 1,
        title: 'Arrival in Cairo',
        description: 'Meet-and-greet at Cairo Airport and transfer to hotel.',
        activities: [
          'Airport assistance & transfer',
          'Hotel check-in',
          'Free time to rest'
        ],
        meals: [],
        accommodation: 'Cairo B&B Hotel'
      },
      {
        day: 2,
        title: 'Giza Pyramids & Grand Egyptian Museum',
        description: 'Full-day tour of the pyramids, Sphinx and the new Grand Egyptian Museum.',
        activities: [
          'Great Pyramid of Cheops',
          'Pyramids of Chephren & Mycerinus',
          'Sphinx photo stop',
          'Guided visit to Grand Egyptian Museum'
        ],
        meals: ['Breakfast'],
        accommodation: 'Cairo B&B Hotel'
      },
      {
        day: 3,
        title: 'Cairo City Tour & Overnight Train',
        description: 'Citadel, Coptic Cairo and Khan El Khalili bazaar before boarding overnight train to Aswan.',
        activities: [
          'Citadel of Saladin & Mohamed Ali Mosque',
          'Hanging Church & Ben Ezra Synagogue',
          'Shopping at Khan El Khalili',
          'Night VIP seating train to Aswan'
        ],
        meals: ['Breakfast'],
        accommodation: 'Overnight Train (seated)'
      },
      {
        day: 4,
        title: 'Aswan – Philae Temple & High Dam',
        description: 'Morning arrival and sightseeing in Aswan.',
        activities: [
          'Hotel check-in',
          'Motorboat ride to Philae Temple',
          'Visit High Dam'
        ],
        meals: ['Breakfast'],
        accommodation: 'Aswan B&B Hotel'
      },
      {
        day: 5,
        title: 'Abu Simbel & Train to Luxor',
        description: 'Early excursion to Abu Simbel then afternoon train to Luxor.',
        activities: [
          '3-hour drive to Abu Simbel',
          'Guided visit to Great & Small Temples',
          'Return to Aswan',
          'Train to Luxor'
        ],
        meals: ['Breakfast'],
        accommodation: 'Luxor B&B Hotel'
      },
      {
        day: 6,
        title: 'Luxor East & West Banks',
        description: 'Comprehensive tour of Luxor’s highlights.',
        activities: [
          'Valley of the Kings',
          'Temple of Queen Hatshepsut',
          'Colossi of Memnon',
          'Karnak Temple',
          'Luxor Temple'
        ],
        meals: ['Breakfast'],
        accommodation: 'Luxor B&B Hotel'
      },
      {
        day: 7,
        title: 'Bus to Hurghada',
        description: 'Morning bus ride to Hurghada and beach leisure.',
        activities: [
          'Transfer to bus station',
          'AC tourist bus to Hurghada',
          'Hotel check-in',
          'Free afternoon at the beach'
        ],
        meals: ['Breakfast'],
        accommodation: 'Hurghada B&B Hotel'
      },
      {
        day: 8,
        title: 'Free Day in Hurghada',
        description: 'Enjoy the Red Sea resort or optional snorkeling/desert safari.',
        activities: [
          'Relax on the beach',
          'Optional Giftun Island snorkeling',
          'Optional Bedouin desert safari'
        ],
        meals: ['Breakfast'],
        accommodation: 'Hurghada B&B Hotel'
      },
      {
        day: 9,
        title: 'Return to Cairo',
        description: 'Bus back to Cairo, evening at leisure.',
        activities: [
          'Bus Hurghada–Cairo',
          'Hotel check-in',
          'Optional Nile dinner cruise'
        ],
        meals: ['Breakfast'],
        accommodation: 'Cairo B&B Hotel'
      },
      {
        day: 10,
        title: 'Departure from Cairo',
        description: 'Transfer to Cairo International Airport for departure.',
        activities: [
          'Hotel checkout',
          'Airport transfer'
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A'
      }
    ],
    images: [
      '/images/trips/egypt-pyramids.jpg',
      '/images/trips/abu-simbel.jpg',
      '/images/trips/luxor-temple.jpg',
      '/images/trips/hurghada-beach.jpg'
    ],
    important_notes: [
      'Budget package: accommodation in clean B&B hotels',
      'Entrance fees are NOT included – pay only for the sites you choose',
      'Optional upgrades/tours available on request',
      'Recommended tipping: USD 5–10 per person per day',
      'Passport must be valid for at least 6 months'
    ]
  },
  {
    title: '2 Days White Desert Tour from Cairo: Camping & 4×4 Safari Adventure',
    description: 'Immerse yourself in the wild beauty of Egypt’s Western Desert on this 2-day adventure from Cairo. Explore the volcanic Black Desert, the sparkling Crystal Mountain and the surreal chalk formations of the White Desert before camping under a canopy of stars.',
    destination: 'Bahariya Oasis & White Desert, Egypt',
    duration: 2,
    price: 320, // Starting price per person
    max_participants: 12,
    current_participants: 0,
    status: 'active',
    product_code: 'egywd2d',
    highlights: [
      'Volcanic landscapes of the Black Desert',
      'Crystal Mountain quartz ridge',
      'Sandboarding in Valley of Agabat',
      'Chalk formations of the White Desert',
      'Authentic Bedouin camping & stargazing',
      'Sunrise photo session in the desert'
    ],
    included: [
      'Hotel pick-up & drop-off in Cairo',
      'Transfers Cairo–Bahariya–Cairo by private A/C vehicle',
      'Desert transfers by private 4×4 land cruiser',
      '1 night Bedouin desert camping (tents & gear)',
      'Meals: Day 1 – Lunch & Dinner; Day 2 – Breakfast',
      'Bottled water & juice',
      'English-speaking desert guide/driver',
      'All taxes & service charges'
    ],
    notIncluded: [
      'Extras not mentioned in the itinerary',
      'Entrance fees to sites (if applicable)',
      'Tipping',
      'Personal expenses & souvenirs',
      'Travel insurance'
    ],
    difficulty: 'easy',
    rating: 4.8,
    numReviews: 0,
    detailed_itinerary: [
      {
        day: 1,
        title: 'Cairo ➔ Bahariya Oasis ➔ White Desert',
        description: 'Morning drive from Cairo, lunch in Al-Bawaiti then 4×4 safari through Black Desert, Crystal Mountain & Agabat Valley before setting up camp.',
        activities: [
          '07:00 pick-up from Cairo hotel',
          '5-hour drive to Bahariya Oasis',
          'Lunch in Al-Bawaiti',
          '4×4 exploration of Black Desert',
          'Swim at El Haize spring',
          'Visit Crystal Mountain',
          'Sandboarding on dunes',
          'Old White Desert formations (Mushroom, Sphinx, Chicken)',
          'Bedouin dinner & campfire',
          'Overnight camping under stars'
        ],
        meals: ['Lunch', 'Dinner'],
        accommodation: 'White Desert Camp'
      },
      {
        day: 2,
        title: 'White Desert ➔ Bahariya ➔ Cairo',
        description: 'Sunrise, breakfast, more formations then return to Cairo.',
        activities: [
          'Sunrise photo session',
          'Ice Cream Valley & Palm Tree formations',
          'Dip in hot spring',
          'Return 4×4 to Bahariya',
          'Drive back to Cairo – drop-off around 17:00'
        ],
        meals: ['Breakfast'],
        accommodation: 'N/A'
      }
    ],
    images: [
      '/images/trips/white-desert-1.jpg',
      '/images/trips/white-desert-2.jpg',
      '/images/trips/black-desert.jpg',
      '/images/trips/crystal-mountain.jpg'
    ],
    important_notes: [
      'Bring warm clothing: desert nights can be cold',
      'Wear closed shoes suitable for sand',
      'Bathrooms are basic while camping',
      'Itinerary may vary due to desert conditions',
      'Vegetarian meals available on request'
    ]
  }
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
          trip.images || [], // Use trip images array from seed data
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
,
  {
    title: 'Walking and Trekking Trip on Mount Mbaminkon',
    description: 'If you are the kind of person who loves adrenaline, vegetation and biodiversity rolled into one trek, Mount Mbaminkon on the outskirts of Yaoundé is a must-visit. Enjoy breathtaking views, rich flora and fauna, and panoramic vistas of the city and surrounding villages all in a single day.',
    destination: 'Yaoundé, Cameroon',
    duration: 1,
    price: 120,
    max_participants: 20,
    current_participants: 0,
    status: 'active',
    product_code: 'mtmba',
    highlights: [
      'Scenic trek through lush vegetation',
      'Chance to spot butterflies, birds, monkeys and other wildlife',
      'Panoramic views of Yaoundé from the summit',
      'Visit authentic Fan Béti architecture in Mbaminkon village',
      'Celebrate with local palm wine after the hike'
    ],
    included: [
      'Professional local trekking guide',
      'Round-trip transportation from Yaoundé',
      'Village access and mountain fees',
      'Bottled water',
      'Palm wine tasting',
      'All government taxes and service charges'
    ],
    notIncluded: [
      'Meals and snacks',
      'Travel and medical insurance',
      'Personal trekking equipment',
      'Tips and gratuities',
      'Items not listed as included'
    ],
    difficulty: 'moderate',
    rating: 4.7,
    numReviews: 8,
    detailed_itinerary: [
      {
        day: 1,
        title: 'Mount Mbaminkon Trek',
        description: 'Morning pick-up in Yaoundé and drive (≈25 km) to Mbaminkon village. Meet the local guide and begin the ascent, learning about the flora and fauna en-route. At the summit, enjoy sweeping views of Yaoundé and nearby villages before descending. Toast with fresh palm wine in the village before returning to the city.',
        activities: [
          'Drive from Yaoundé to Mbaminkon village',
          'Guided trek to the summit (3-4 hrs round-trip)',
          'Wildlife and bird spotting',
          'Summit photography session',
          'Palm wine celebration with locals'
        ],
        meals: [],
        accommodation: 'N/A'
      }
    ],
    images: [
      '/images/trips/mbaminkon-1.jpg',
      '/images/trips/mbaminkon-2.jpg',
      '/images/trips/mbaminkon-3.jpg'
    ]
  }
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
