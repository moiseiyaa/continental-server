import { pool } from '../config/db';
import { config } from 'dotenv';

// Load environment variables
config();

interface BlogSeed {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  tags: string[];
  featuredImage?: string;
  published: boolean;
}

const BLOGS: BlogSeed[] = [
  {
    title: 'Visit Rwanda: The Land of a Thousand Hills',
    slug: 'visit-rwanda-land-of-thousand-hills',
    excerpt: 'Discover why Rwanda is one of Africa\'s most captivating destinations, from mountain gorillas to vibrant culture and stunning landscapes.',
    content: `# Visit Rwanda: The Land of a Thousand Hills

Rwanda, often called "The Land of a Thousand Hills," is a small but incredibly diverse country in East Africa that offers travelers an unforgettable experience. Despite its tragic history, Rwanda has emerged as one of Africa's most progressive and beautiful destinations.

## Why Visit Rwanda?

### Mountain Gorilla Trekking
One of the most iconic experiences in Rwanda is trekking to see the endangered mountain gorillas in Volcanoes National Park. This once-in-a-lifetime opportunity brings you face-to-face with these gentle giants in their natural habitat. The park is home to over 300 gorillas, and permits are carefully managed to ensure conservation.

### Rich Cultural Heritage
Rwanda's culture is vibrant and deeply rooted in tradition. Visit the King's Palace in Nyanza to learn about Rwanda's royal history, or experience the Intore dance, a traditional warrior dance that showcases the country's cultural richness.

### Stunning Landscapes
From the rolling hills that give the country its nickname to the serene Lake Kivu and the dense Nyungwe Forest, Rwanda's landscapes are breathtaking. The country is incredibly clean and well-maintained, making it a pleasure to explore.

### Wildlife and Nature
Beyond gorillas, Rwanda offers incredible wildlife viewing in Akagera National Park, where you can see the Big Five. The park has been successfully restored and now hosts lions, elephants, rhinos, and more.

## Best Time to Visit

The best time to visit Rwanda is during the dry seasons: June to September and December to February. These periods offer the best conditions for gorilla trekking and wildlife viewing.

## Getting Around

Rwanda has excellent infrastructure with well-maintained roads. The capital city, Kigali, is modern and safe, making it easy to explore the country from this central hub.

Whether you're seeking adventure, wildlife, culture, or simply a unique travel experience, Rwanda has something special to offer every visitor.`,
    author: 'Continental Travels',
    category: 'Travel Guide',
    tags: ['Rwanda', 'Travel', 'Gorillas', 'Culture', 'Wildlife'],
    published: true,
  },
  {
    title: 'Best Hotels in Rwanda: Luxury and Comfort in the Heart of Africa',
    slug: 'best-hotels-rwanda-luxury-comfort',
    excerpt: 'Explore Rwanda\'s finest accommodations, from luxury lodges near gorilla habitats to boutique hotels in Kigali, offering world-class service and stunning views.',
    content: `# Best Hotels in Rwanda: Luxury and Comfort in the Heart of Africa

Rwanda offers a range of exceptional accommodations that combine luxury with authentic African experiences. Whether you're staying in the capital or near the national parks, you'll find hotels that exceed expectations.

## Luxury Lodges Near Volcanoes National Park

### Bisate Lodge
Nestled in the foothills of the Virunga Mountains, Bisate Lodge offers an ultra-luxury experience with stunning views of the volcanoes. Each villa is designed with sustainability in mind and provides an intimate gorilla trekking experience.

### Sabyinyo Silverback Lodge
Owned by the local community, this lodge offers comfortable accommodation with a focus on community development. It's perfectly located for gorilla trekking and provides excellent service.

## Kigali Hotels

### The Retreat by Heaven
A boutique hotel in Kigali that combines modern luxury with Rwandan hospitality. The hotel features beautiful gardens, a spa, and excellent dining options.

### Kigali Serena Hotel
Located in the heart of Kigali, this international hotel offers world-class amenities, multiple restaurants, and easy access to the city's attractions.

## Lake Kivu Accommodations

### Lake Kivu Serena Hotel
Overlooking the beautiful Lake Kivu, this hotel offers stunning lake views, water activities, and a peaceful retreat from the city.

## What to Expect

Rwandan hotels are known for their exceptional service, cleanliness, and attention to detail. Many properties focus on sustainability and community involvement, making your stay meaningful beyond comfort.

## Booking Tips

- Book gorilla trekking lodges well in advance, especially during peak season
- Consider staying in Kigali for city exploration and near parks for wildlife experiences
- Many lodges offer package deals that include gorilla permits and activities

From eco-lodges to luxury resorts, Rwanda's hospitality industry sets a high standard for African tourism.`,
    author: 'Continental Travels',
    category: 'Accommodation',
    tags: ['Rwanda', 'Hotels', 'Luxury', 'Accommodation', 'Travel'],
    published: true,
  },
  {
    title: 'Best National Parks in East Africa: A Wildlife Lover\'s Guide',
    slug: 'best-national-parks-east-africa',
    excerpt: 'Discover the most spectacular national parks across East Africa, from the Serengeti\'s great migration to Rwanda\'s gorilla sanctuaries and Kenya\'s Maasai Mara.',
    content: `# Best National Parks in East Africa: A Wildlife Lover's Guide

East Africa is home to some of the world's most spectacular national parks, offering incredible wildlife viewing, diverse ecosystems, and unforgettable safari experiences.

## Rwanda

### Volcanoes National Park
Famous for mountain gorilla trekking, this park offers one of the most intimate wildlife experiences on Earth. The park is also home to golden monkeys and stunning volcanic landscapes.

### Akagera National Park
Rwanda's only savannah park, Akagera has been successfully restored and now hosts the Big Five. The park features diverse habitats including lakes, wetlands, and savannah.

### Nyungwe National Park
One of Africa's oldest rainforests, Nyungwe is home to 13 primate species including chimpanzees and colobus monkeys. The canopy walkway offers unique perspectives of the forest.

## Kenya

### Maasai Mara National Reserve
Famous for the Great Migration, where millions of wildebeest and zebras cross the Mara River. The reserve offers excellent year-round game viewing and cultural experiences with the Maasai people.

### Amboseli National Park
Known for its large elephant herds and stunning views of Mount Kilimanjaro, Amboseli provides classic African safari experiences.

### Lake Nakuru National Park
A birdwatcher's paradise, Lake Nakuru is famous for its flamingo populations and is also home to rhinos, lions, and leopards.

## Tanzania

### Serengeti National Park
The iconic Serengeti hosts the Great Migration and offers some of Africa's best game viewing. The endless plains and abundant wildlife create an unforgettable safari experience.

### Ngorongoro Conservation Area
The Ngorongoro Crater is a natural wonder, hosting a high density of wildlife in a stunning caldera setting.

## Uganda

### Bwindi Impenetrable National Park
Home to half of the world's remaining mountain gorillas, Bwindi offers challenging but rewarding gorilla trekking experiences.

### Murchison Falls National Park
Named after the dramatic waterfall where the Nile forces through a narrow gorge, this park offers excellent wildlife viewing and boat safaris.

## Planning Your Visit

- Best time: Dry seasons (June-September, December-February) for optimal wildlife viewing
- Permits: Book gorilla and chimpanzee permits well in advance
- Duration: Plan at least 2-3 days per park to fully experience each destination
- Guides: Professional guides enhance your experience and ensure safety

East Africa's national parks offer diverse experiences from gorilla encounters to the great migration, making it a premier destination for wildlife enthusiasts.`,
    author: 'Continental Travels',
    category: 'Wildlife',
    tags: ['East Africa', 'National Parks', 'Wildlife', 'Safari', 'Conservation'],
    published: true,
  },
  {
    title: 'Gorilla Trekking in Rwanda: Everything You Need to Know',
    slug: 'gorilla-trekking-rwanda-guide',
    excerpt: 'Complete guide to gorilla trekking in Rwanda, including permit information, what to expect, best times to visit, and essential tips for an unforgettable experience.',
    content: `# Gorilla Trekking in Rwanda: Everything You Need to Know

Gorilla trekking in Rwanda is a bucket-list experience that brings you face-to-face with endangered mountain gorillas in their natural habitat. Here's everything you need to know to make the most of this incredible adventure.

## About Mountain Gorillas

Mountain gorillas are one of the world's most endangered species, with only about 1,000 remaining in the wild. Rwanda's Volcanoes National Park is home to approximately 300 of these gentle giants, living in family groups led by a dominant silverback.

## Getting a Permit

### Cost
Gorilla trekking permits in Rwanda cost $1,500 per person. This fee goes directly to conservation efforts and community development.

### Booking
- Book permits at least 3-6 months in advance, especially for peak season
- Permits can be purchased through the Rwanda Development Board or authorized tour operators
- Permits are non-refundable, so ensure your travel dates are confirmed

## What to Expect

### The Trek
- Treks can last from 1-8 hours depending on where the gorilla family is located
- You'll hike through dense forest, sometimes at high altitude
- Physical fitness is recommended, though groups are assigned based on difficulty level
- You'll spend one hour with the gorillas once found

### The Experience
- Groups are limited to 8 people per gorilla family
- You'll be accompanied by experienced guides and trackers
- Maintain a 7-meter distance from the gorillas
- Photography is allowed (no flash)
- The experience is intimate and often emotional

## Best Time to Visit

- Dry seasons (June-September, December-February) offer easier trekking conditions
- However, gorilla trekking is possible year-round
- Morning treks are generally recommended for better lighting and gorilla activity

## What to Bring

- Long-sleeved shirts and pants (protection from stinging nettles)
- Waterproof jacket
- Sturdy hiking boots
- Gardening gloves
- Daypack with water and snacks
- Camera (no flash)
- Insect repellent

## Health Requirements

- Minimum age: 15 years
- You must be in good health (gorillas are susceptible to human diseases)
- If you have a cold or flu, you may be denied participation
- Face masks may be required

## Conservation Impact

Your permit fee directly supports:
- Gorilla conservation and protection
- Community development projects
- Park management and anti-poaching efforts
- Research and monitoring programs

## Tips for Success

1. **Physical Preparation**: Start exercising before your trip, especially if you're not used to hiking
2. **Pack Light**: You'll carry your own gear during the trek
3. **Listen to Guides**: They know the gorillas and will ensure your safety
4. **Be Patient**: Finding gorillas can take time, but it's worth the wait
5. **Respect the Rules**: Follow all guidelines to protect both you and the gorillas

Gorilla trekking in Rwanda is more than a tourist activity—it's a conservation success story and a chance to connect with one of our closest relatives in the animal kingdom.`,
    author: 'Continental Travels',
    category: 'Adventure',
    tags: ['Rwanda', 'Gorillas', 'Wildlife', 'Adventure', 'Conservation'],
    published: true,
  },
  {
    title: 'Cultural Experiences in Rwanda: Beyond Wildlife',
    slug: 'cultural-experiences-rwanda',
    excerpt: 'Explore Rwanda\'s rich cultural heritage, from traditional dances and royal history to local markets, community visits, and authentic Rwandan cuisine.',
    content: `# Cultural Experiences in Rwanda: Beyond Wildlife

While Rwanda is famous for gorilla trekking and wildlife, the country's rich cultural heritage offers equally compelling experiences for travelers seeking authentic connections.

## Traditional Dance and Music

### Intore Dance
The Intore (warrior) dance is Rwanda's most famous traditional performance. Originally performed by warriors returning from battle, it features energetic movements, drumming, and colorful costumes. You can experience this at cultural villages and during special events.

### Traditional Music
Rwandan music is deeply connected to storytelling and community. Instruments like the inanga (zither) and ikembe (thumb piano) create beautiful melodies that have been passed down through generations.

## Historical Sites

### King's Palace Museum (Nyanza)
Visit the reconstructed royal palace to learn about Rwanda's pre-colonial monarchy. The site includes traditional architecture, royal artifacts, and insights into Rwanda's governance system.

### Ethnographic Museum (Butare)
Located in Huye, this museum houses one of Africa's finest ethnographic collections, showcasing Rwanda's cultural history, traditional crafts, and way of life.

### Kigali Genocide Memorial
While emotionally challenging, this memorial provides essential context for understanding modern Rwanda. It honors the victims and tells the story of the country's remarkable recovery.

## Local Markets and Crafts

### Kimisagara Market (Kigali)
Experience the vibrant local market culture, where you can find traditional crafts, fresh produce, and everyday items. It's a great place to interact with locals and practice Kinyarwanda.

### Local Artisans
Visit cooperatives where local artisans create traditional baskets (agaseke), pottery, and wood carvings. These make meaningful souvenirs while supporting local communities.

## Community-Based Tourism

### Iby'Iwacu Cultural Village
Located near Volcanoes National Park, this village offers authentic cultural experiences including traditional housing, food, music, and dance. It's run by former poachers who now work in conservation.

### Coffee and Tea Tours
Rwanda produces excellent coffee and tea. Visit plantations to learn about the process, meet farmers, and enjoy tastings. These tours support local communities and offer insight into Rwanda's agricultural heritage.

## Traditional Food Experiences

### Local Cuisine
Try traditional dishes like:
- **Ugali**: Maize porridge, a staple food
- **Isombe**: Cassava leaves with groundnuts
- **Brochettes**: Grilled meat skewers
- **Akabenz**: Traditional pork dish

### Cooking Classes
Learn to prepare traditional Rwandan meals with local families or at cultural centers. It's a hands-on way to connect with the culture.

## Language and Interaction

### Learning Kinyarwanda
Even learning a few phrases like "Muraho" (hello) and "Murakoze" (thank you) goes a long way in connecting with locals. Rwandans appreciate visitors who make an effort to learn their language.

### Community Visits
Many tour operators offer community visits where you can meet local families, learn about daily life, and participate in activities like farming or craft-making.

## Festivals and Events

### Kwita Izina (Gorilla Naming Ceremony)
An annual celebration where baby gorillas are named, combining conservation awareness with cultural celebration.

### Umuganura (Harvest Festival)
A traditional harvest festival celebrating Rwanda's agricultural heritage with music, dance, and community gatherings.

## Responsible Cultural Tourism

- Respect local customs and traditions
- Ask permission before taking photos of people
- Support local artisans by purchasing authentic crafts
- Choose community-based tourism experiences
- Learn about Rwanda's history and culture before visiting

Rwanda's culture is resilient, vibrant, and welcoming. Beyond the wildlife, these cultural experiences provide deeper understanding and connection to this remarkable country.`,
    author: 'Continental Travels',
    category: 'Culture',
    tags: ['Rwanda', 'Culture', 'Heritage', 'Traditions', 'Community'],
    published: true,
  },
];

async function seed(): Promise<void> {
  const client = await pool.connect();
  let success = false;
  
  try {
    await client.query('BEGIN');

    // Create blogs table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags TEXT[] DEFAULT '{}',
        featured_image VARCHAR(500),
        published BOOLEAN DEFAULT true,
        published_at TIMESTAMP,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created blogs table (if it didn\'t exist)');

    // Clear existing blogs
    await client.query('TRUNCATE TABLE blogs RESTART IDENTITY CASCADE');
    console.log('✅ Cleared existing blogs');

    // Insert blogs
    for (const blog of BLOGS) {
      const publishedAt = blog.published ? new Date() : null;
      
      await client.query(
        `INSERT INTO blogs (
          title, slug, content, excerpt, author, category, tags, featured_image, published, published_at, views, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
        [
          blog.title,
          blog.slug,
          blog.content,
          blog.excerpt,
          blog.author,
          blog.category,
          blog.tags,
          blog.featuredImage || null,
          blog.published,
          publishedAt,
          0, // Initial views
        ],
      );
    }

    await client.query('COMMIT');
    console.log(`🚀 Seeded ${BLOGS.length} blogs`);
    console.log('✅ Database seeding completed successfully!');
    success = true;
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed blogs:', error.message);
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

