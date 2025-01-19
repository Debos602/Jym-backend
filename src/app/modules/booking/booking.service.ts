import { TBooking } from './booking.interface';
import BookingModel from './booking.model';
import CarModel from '../car/car.model';

const createBooking = async (
  carId: string,
  userId: string,
  date: string,
  startTime: string,
) => {
  try {
    // Create the booking

    const booking = await BookingModel.create({
      car: carId,
      user: userId,
      date,
      startTime,
      totalCost: 0, // Default value, will be updated later
      status: 'pending',
      paymentStatus: 'pending',
    });

    // Update the car's status to unavailable
    const car = await CarModel.findByIdAndUpdate(
      carId,
      { status: 'unavailable' },
      { new: true },
    );

    if (!car) {
      throw new Error('Car not found');
    }

    // Fetch additional details for the booking
    const populatedBooking = await BookingModel.findById(booking._id)
      .populate('user') // Populate user details
      .populate('car') // Populate car details
      .exec();

    if (!populatedBooking) {
      throw new Error('Booking not found');
    }

    // Prepare payment data

    return populatedBooking;
  } catch (error) {
    // Throw the error to be handled by the controller
    throw new Error(`Error creating booking: ${error}`);
  }
};

const getAllBookings = async () => {
  try {
    const bookings = await BookingModel.find()
      .populate('user') // Populate user details
      .populate('car'); // Populate car details

    return bookings;
  } catch (error) {
    throw new Error(`Error getting bookings: ${error}`);
  }
};
const getAllBookingsUser = async (id: string) => {
  try {
    // Fetch all bookings for a given user ID
    const bookings = await BookingModel.find({ user: id })
      .populate('user') // Populate user details
      .populate('car'); // Populate car details

    return bookings;
  } catch (error) {
    throw new Error(`Error getting bookings`);
  }
};

const returnCarService = async (
  bookingId: string,
  endTime: string,
  status: string,
): Promise<TBooking | null> => {
  // Find the booking by ID
  const booking = await BookingModel.findById(bookingId)
    .populate('user')
    .populate('car')
    .exec();

  // If no booking is found, return null instead of throwing an error
  if (!booking) {
    return null; // Handle in controller as a 404
  }

  // Helper function to convert time string (HH:mm or hh:mm AM/PM) to total hours
  const timeToHours = (time: string): number => {
    let totalHours = 0;
    const timeParts = time.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);

    if (timeParts) {
      let hours = Number(timeParts[1]);
      const minutes = Number(timeParts[2]);
      const isPM = timeParts[3] && timeParts[3].toUpperCase() === 'PM';

      if (isPM && hours < 12) {
        hours += 12; // Convert PM hours to 24-hour format
      } else if (!isPM && hours === 12) {
        hours = 0; // Convert 12 AM to 0 hours
      }

      totalHours = hours + minutes / 60;
    }

    return totalHours;
  };

  // Log and convert times

  const startHours = timeToHours(booking.startTime);
  let endHours = timeToHours(endTime);

  if (isNaN(startHours) || isNaN(endHours)) {
    throw new Error('Invalid start time or end time');
  }

  // Handle next-day end time case
  if (endHours < startHours) {
    endHours += 24;
  }

  const durationHours = endHours - startHours;

  if (isNaN(durationHours) || durationHours < 0) {
    throw new Error('Invalid duration');
  }

  const pricePerHour = booking.car?.pricePerHour ?? 0;
  if (pricePerHour <= 0) {
    throw new Error('Invalid price per hour');
  }

  const totalCost = durationHours * pricePerHour;
  if (isNaN(totalCost) || totalCost < 0) {
    throw new Error('Total cost calculation failed');
  }

  booking.status = status;
  booking.endTime = endTime;
  booking.totalCost = totalCost;
  await booking.save();

  // Update car status
  if (booking.car) {
    await CarModel.findByIdAndUpdate(booking.car._id, { status: 'available' });
  }

  return booking;
};

const deleteSingleBookingfromDb = async (bookingId: string) => {
  try {
    const deletedBooking = await BookingModel.findByIdAndDelete(bookingId);
    if (!deletedBooking) {
      return null; // Return null if booking not found
    }
    const carId = deletedBooking.car._id; // Assuming car is populated in the booking
    await CarModel.findByIdAndUpdate(carId, { status: 'available' });
    return deletedBooking; // return null if not found
  } catch (error) {
    throw new Error(`Error deleting booking: ${error}`);
  }
};
const updateBooking = async (bookingId: string, booking: Partial<TBooking>) => {
  try {
    // Update the booking with the given data
    const updatedBooking = await BookingModel.findByIdAndUpdate(
      bookingId,
      { $set: booking },
      { new: true },
    ).populate('user'); // Ensure the user field is populated if it's a reference

    // Check if user exists
    const user = updatedBooking?.user;
    if (!user) {
      throw new Error('User not found');
    }

    // Prepare payment data
    // Log payment session

    return updatedBooking;
  } catch (error) {
    // Log the error message and throw a more informative error
    console.error('Error:', error);
    throw new Error(`Error updating booking: ${(error as Error).message}`);
  }
};

export const BookingServices = {
  createBooking,
  getAllBookings,
  getAllBookingsUser,
  returnCarService,
  deleteSingleBookingfromDb,
  updateBooking,
};
