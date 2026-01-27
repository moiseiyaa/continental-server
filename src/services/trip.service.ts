// Trip service – PostgreSQL implementation
import { pool } from '../config/db';
import { ITripInput } from '../interfaces/trip.interface';

export interface Trip {
  _id: string;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  maxParticipants: number;
  currentParticipants: number;
  startDate: Date;
  endDate: Date;
  itinerary: string[];
  detailedItinerary?: any; // JSONB field with day-by-day details
  images: string[];
  highlights: string[];
  included: string[];
  notIncluded: string[];
  activities?: string[];
  insurance?: string;
  difficulty: string;
  rating: number;
  reviews: number;
  status: string;
  createdBy: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface TripRow {
  id: number;
  title: string;
  description: string;
  destination: string;
  duration: number;
  price: number;
  max_participants: number;
  current_participants: number;
  start_date: Date;
  end_date: Date;
  itinerary: string[] | null;
  detailed_itinerary: any; // JSONB field
  images: string[] | null;
  highlights: string[] | null;
  included: string[] | null;
  not_included: string[] | null;
  activities: string[] | null;
  insurance: string | null;
  difficulty: string;
  rating: number;
  reviews: number;
  status: string;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

// Helper to map PostgreSQL row to API object
const mapTrip = (row: TripRow): Trip => ({
  _id: row.id.toString(),
  title: row.title,
  description: row.description,
  destination: row.destination,
  duration: row.duration,
  price: Number(row.price),
  maxParticipants: row.max_participants,
  currentParticipants: row.current_participants,
  startDate: row.start_date,
  endDate: row.end_date,
  itinerary: row.itinerary || [],
  detailedItinerary: row.detailed_itinerary || null,
  images: row.images || [],
  highlights: row.highlights || [],
  included: row.included || [],
  notIncluded: row.not_included || [],
  activities: row.activities || [],
  insurance: row.insurance ?? undefined,
  difficulty: row.difficulty,
  rating: Number(row.rating),
  reviews: row.reviews,
  status: row.status,
  createdBy: row.created_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// Create a new trip
export const createTrip = async (tripData: ITripInput, userId: string): Promise<Trip> => {
  const {
    title,
    description,
    destination,
    duration,
    price,
    maxParticipants,
    startDate,
    endDate,
    itinerary = [],
    images = [],
    highlights = [],
    included = [],
    notIncluded = [],
    difficulty = 'moderate',
  } = tripData;

  const queryText = `
    INSERT INTO trips (
      title, description, destination, duration, price,
      max_participants, current_participants, start_date, end_date,
      itinerary, images, highlights, included, not_included, difficulty, status, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, 0, $7, $8, $9, $10, $11, $12, $13, $14, 'active', $15
    ) RETURNING *
  `;

  const values = [
    title,
    description,
    destination,
    duration,
    price,
    maxParticipants,
    startDate,
    endDate,
    itinerary,
    images,
    highlights,
    included,
    notIncluded,
    difficulty,
    userId ? Number(userId) : null,
  ];

  const { rows } = await pool.query(queryText, values);
  return mapTrip(rows[0] as TripRow);
};

// Get all trips with pagination and filters (optimized single query approach)
export const getAllTrips = async (
  page = 1,
  limit = 10,
  filters: any = {}
): Promise<{ trips: Trip[]; total: number; pages: number }> => {
  const offset = (page - 1) * limit;

  // Build dynamic WHERE clause
  const clauses: string[] = ["status = 'active'"];
  const params: any[] = [];

  if (filters.destination) {
    params.push(`%${filters.destination}%`);
    clauses.push(`destination ILIKE $${params.length}`);
  }
  if (filters.minPrice) {
    params.push(filters.minPrice);
    clauses.push(`price >= $${params.length}`);
  }
  if (filters.maxPrice) {
    params.push(filters.maxPrice);
    clauses.push(`price <= $${params.length}`);
  }
  if (filters.difficulty) {
    params.push(filters.difficulty);
    clauses.push(`difficulty = $${params.length}`);
  }
  if (filters.minDuration) {
    params.push(filters.minDuration);
    clauses.push(`duration >= $${params.length}`);
  }
  if (filters.maxDuration) {
    params.push(filters.maxDuration);
    clauses.push(`duration <= $${params.length}`);
  }

  const whereSQL = clauses.length > 1 ? `WHERE ${clauses.join(' AND ')}` : '';

  // Use single query with window function for better performance
  const queryText = `
    SELECT 
      *,
      COUNT(*) OVER() as total_count
    FROM trips 
    ${whereSQL} 
    ORDER BY created_at DESC 
    LIMIT $${params.length + 1} 
    OFFSET $${params.length + 2}
  `;

  const queryParams = [...params, limit, offset];
  const { rows } = await pool.query(queryText, queryParams);

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const trips = rows.map((row: any) => {
    const { total_count, ...tripData } = row;
    return mapTrip(tripData as TripRow);
  });

  return {
    trips,
    total,
    pages: Math.ceil(total / limit),
  };
};

// Get trip by ID
export const getTripById = async (id: string): Promise<Trip | null> => {
  const { rows } = await pool.query('SELECT * FROM trips WHERE id = $1', [id]);
  return rows.length ? mapTrip(rows[0] as TripRow) : null;
};

// Update trip
export const updateTrip = async (tripId: string, tripData: Partial<ITripInput>): Promise<Trip | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const allowedFields = [
    'title', 'description', 'destination', 'duration', 'price',
    'maxParticipants', 'startDate', 'endDate', 'itinerary',
    'images', 'highlights', 'included', 'notIncluded', 'difficulty'
  ];

  for (const [key, value] of Object.entries(tripData)) {
    if (allowedFields.includes(key) && value !== undefined) {
      const dbKey = key === 'maxParticipants' ? 'max_participants' :
                   key === 'startDate' ? 'start_date' :
                   key === 'endDate' ? 'end_date' :
                   key === 'notIncluded' ? 'not_included' : key;
      updates.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (updates.length === 0) {
    return getTripById(tripId);
  }

  values.push(tripId);
  const queryText = `
    UPDATE trips 
    SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
    WHERE id = $${paramCount}
    RETURNING *
  `;

  const { rows } = await pool.query(queryText, values);
  return rows.length ? mapTrip(rows[0] as TripRow) : null;
};

// Delete trip (soft delete by setting status)
export const deleteTrip = async (tripId: string): Promise<Trip | null> => {
  const { rows } = await pool.query(
    `UPDATE trips SET status = 'inactive', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
    [tripId]
  );
  return rows.length ? mapTrip(rows[0] as TripRow) : null;
};

// Search trips
export const searchTrips = async (searchTerm: string): Promise<Trip[]> => {
  const { rows } = await pool.query(
    `SELECT * FROM trips 
     WHERE status = 'active' 
     AND (
       title ILIKE $1 
       OR destination ILIKE $1 
       OR description ILIKE $1
     )
     ORDER BY created_at DESC
     LIMIT 50`,
    [`%${searchTerm}%`]
  );
  return rows.map(mapTrip);
};

// Get trips by destination
export const getTripsByDestination = async (destination: string): Promise<Trip[]> => {
  const { rows } = await pool.query(
    `SELECT * FROM trips 
     WHERE status = 'active' 
     AND destination ILIKE $1 
     ORDER BY created_at DESC`,
    [`%${destination}%`]
  );
  return rows.map(mapTrip);
};

// Update trip participants (atomic operation)
export const updateTripParticipants = async (tripId: string, increment: number): Promise<Trip | null> => {
  const { rows } = await pool.query(
    `UPDATE trips 
     SET current_participants = current_participants + $1,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2 
     AND status = 'active'
     RETURNING *`,
    [increment, tripId]
  );
  return rows.length ? mapTrip(rows[0] as TripRow) : null;
};
