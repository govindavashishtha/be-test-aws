import { Booking, Event, User } from '../db/models';
import { CreateBookingRequest, BookingResponse } from '../api/types';
import { BaseService } from './base.service';
import { CreateAttributes } from '../db/models/base.model';
import { BookingAttributes } from '../db/models/booking.model';
import { NotFoundError, ValidationError } from '../utils/errors';

// Merge mapper function into index
const toBookingResponse = (booking: Booking): BookingResponse => ({
  id: booking.id,
  userId: booking.userId,
  eventId: booking.eventId,
  status: booking.status,
  createdAt: booking.createdAt,
  updatedAt: booking.updatedAt,
  event: booking.event ? {
    name: booking.event.name,
    eventDate: booking.event.eventDate,
    startTime: booking.event.startTime,
    endTime: booking.event.endTime
  } : undefined,
  user: booking.user ? {
    name: booking.user.name,
    email: booking.user.email!,
    phoneNumber: booking.user.phoneNumber
  } : undefined
});

export class BookingService extends BaseService<
  Booking,
  CreateBookingRequest,
  BookingAttributes,
  BookingResponse
> {
  private static instance: BookingService;

  private constructor() {
    super(
      (Booking as any), 
      toBookingResponse,
      [
        { model: Event, as: 'event' },
        { model: User, as: 'user' }
      ]
    );
  }

  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }

  protected async validateBooking(eventId: string, memberId: string): Promise<Event> {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const bookingCount = await Booking.count({
      where: { eventId, status: 'confirmed' }
    });

    if (bookingCount >= event.maxMembers) {
      throw new ValidationError('Event is fully booked');
    }

    // Check if user already has a booking for this event
    const existingBooking = await Booking.findOne({
      where: { 
        eventId,
        userId: memberId,
        status: 'confirmed'
      }
    });

    if (existingBooking) {
      throw new ValidationError('User already has a booking for this event');
    }

    return event;
  }

  async create(data: CreateBookingRequest): Promise<BookingResponse> {
    try {
      await this.validateBooking(data.eventId, data.memberId);

      const booking = await Booking.create({
        userId: data.memberId,
        eventId: data.eventId,
        status: 'confirmed'
      } as CreateAttributes<BookingAttributes>, {
        returning: true,
        include: this.defaultIncludes
      });

      return toBookingResponse(booking);
    } catch (error) {
      this.handleError(error);
    }
  }

  async cancel(id: string): Promise<BookingResponse> {
    try {
      const booking = await this.findByIdOrThrow(id, {
        include: this.defaultIncludes
      });
      
      await booking.update({ status: 'cancelled' });
      return toBookingResponse(booking);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByUser(userId: string): Promise<BookingResponse[]> {
    return this.findAll(
      { userId },
      { include: this.defaultIncludes }
    );
  }

  async findByEvent(eventId: string): Promise<BookingResponse[]> {
    return this.findAll(
      { eventId },
      { include: this.defaultIncludes }
    );
  }
} 