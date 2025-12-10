import { ITrip, ITripInput } from '../interfaces/trip.interface';
import Trip from '../models/trip.model';

export const createTrip = async (tripData: ITripInput, userId: string): Promise<ITrip> => {
  const trip = await Trip.create({
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
