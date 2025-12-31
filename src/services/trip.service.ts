import { pool } from '../config/db';
import { ITripInput } from '../interfaces/trip.interface';

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
  images: string[] | null;
  highlights: string[] | null;
  included: string[] | null;
  not_included: string[] | null;
  difficulty: string;
  rating: number;
  reviews: number;
  status: string;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}

// Helper to map PG row -> API object keeping `_id` for frontend compatibility
const mapTrip = (row: TripRow) => ({
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
  itinerary: row.itinerary ?? [],
  images: row.images ?? [],
  highlights: row.highlights ?? [],
  included: row.included ?? [],
  notIncluded: row.not_included ?? [],
  difficulty: row.difficulty,
  rating: Number(row.rating),
  reviews: row.reviews,
  status: row.status,
  createdBy: row.created_by,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// --- PG IMPLEMENTATION ---

export const createTrip = async (tripData: ITripInput, userId: string) => {
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
      itinerary, images, highlights, included, not_included, difficulty, created_by
    ) VALUES (
      $1, $2, $3, $4, $5, $6, 0, $7, $8, $9, $10, $11, $12, $13, $14, $15
    ) RETURNING *`;

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

export const getAllTrips = async (
  page = 1,
  limit = 10,
  filters: any = {}
): Promise<{ trips: any[]; total: number; pages: number }> => {
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

  const whereSQL = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';

  const totalRes = await pool.query(`SELECT COUNT(*) FROM trips ${whereSQL}`, params);
  const total = Number(totalRes.rows[0].count);

  params.push(limit, offset);

  const tripsRes = await pool.query(
    `SELECT * FROM trips ${whereSQL} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  const trips = tripsRes.rows.map(mapTrip);

  return {
    trips,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const getTripById = async (tripId: string) => {
  const { rows } = await pool.query('SELECT * FROM trips WHERE id = $1', [tripId]);
  if (rows.length === 0) return null;
  return mapTrip(rows[0] as TripRow);
};

// Not yet implemented for PG – placeholders to avoid import errors
export const updateTrip = async () => null;
export const deleteTrip = async () => null;
export const searchTrips = async () => [];
export const getTripsByDestination = async () => [];
export const updateTripParticipants = async () => null;
    ...tripData,
    createdBy: userId,
  });
  return trip;
};

export const getAllTrips = async (
  page: number = 1,
  limit: number = 10,
  filters?: any
): Promise<{ trips: ITrip[]; total: number; pages: number }> => {
  const skip = (page - 1) * limit;
  const query: any = { status: 'active' };

  if (filters?.destination) {
    query.destination = { $regex: filters.destination, $options: 'i' };
  }
  if (filters?.minPrice) {
    query.price = { ...query.price, $gte: filters.minPrice };
  }
  if (filters?.maxPrice) {
    query.price = { ...query.price, $lte: filters.maxPrice };
  }
  if (filters?.difficulty) {
    query.difficulty = filters.difficulty;
  }
  if (filters?.minDuration) {
    query.duration = { ...query.duration, $gte: filters.minDuration };
  }
  if (filters?.maxDuration) {
    query.duration = { ...query.duration, $lte: filters.maxDuration };
  }

  const total = await Trip.countDocuments(query);
  const trips = await Trip.find(query)
    .populate('createdBy', 'name email')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    trips,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const getTripById = async (tripId: string): Promise<ITrip | null> => {
  return await Trip.findById(tripId).populate('createdBy', 'name email');
};

export const updateTrip = async (tripId: string, tripData: Partial<ITripInput>): Promise<ITrip | null> => {
  return await Trip.findByIdAndUpdate(tripId, tripData, {
    new: true,
    runValidators: true,
  }).populate('createdBy', 'name email');
};

export const deleteTrip = async (tripId: string): Promise<ITrip | null> => {
  return await Trip.findByIdAndDelete(tripId);
};

export const searchTrips = async (searchTerm: string): Promise<ITrip[]> => {
  return await Trip.find({
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { destination: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
    ],
    status: 'active',
  }).populate('createdBy', 'name email');
};

export const getTripsByDestination = async (destination: string): Promise<ITrip[]> => {
  return await Trip.find({
    destination: { $regex: destination, $options: 'i' },
    status: 'active',
  }).populate('createdBy', 'name email');
};

export const updateTripParticipants = async (tripId: string, increment: number): Promise<ITrip | null> => {
  return await Trip.findByIdAndUpdate(
    tripId,
    { $inc: { currentParticipants: increment } },
    { new: true }
  );
};
