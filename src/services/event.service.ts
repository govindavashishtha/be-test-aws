import { Event, Society, Trainer } from '../db/models';
import { CreateEventRequest, UpdateEventRequest, EventResponse } from '../api/types';
import { EventAttributes } from '../db/models/event.model';
import { BaseService } from './base.service';
import { ValidationError } from '../utils/errors';

export const toEventResponse = (event: Event & { 
  society?: Society; 
  trainer?: Trainer 
}): EventResponse => ({
  id: event.id,
  name: event.name,
  societyId: event.societyId,
  trainerId: event.trainerId,
  eventDate: event.eventDate,
  startTime: event.startTime,
  endTime: event.endTime,
  maxMembers: event.maxMembers,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
  society: event.society ? { name: event.society.name } : undefined,
  trainer: event.trainer ? { name: event.trainer.name } : undefined
}); 

export class EventService extends BaseService<
  Event, 
  CreateEventRequest, 
  UpdateEventRequest, 
  EventResponse
> {
  private static instance: EventService;

  private constructor() {
    super(
      Event as any, 
      toEventResponse,
      [
        { model: Society, as: 'society', attributes: ['name'] },
        { model: Trainer, as: 'trainer', attributes: ['name'] }
      ]
    );
  }

  public static getInstance(): EventService {
    if (!EventService.instance) {
      EventService.instance = new EventService();
    }
    return EventService.instance;
  }

  protected async validateEvent(data: CreateEventRequest | UpdateEventRequest): Promise<void> {
    // Validate date and time
    if (!data.eventDate) {
      throw new ValidationError('Event date is required');
    }
    const eventDate = new Date(data.eventDate);
    if (eventDate < new Date()) {
      throw new ValidationError('Event date cannot be in the past');
    }

    // Validate time range
    if (!data.startTime || !data.endTime) {
      throw new ValidationError('Start time and end time are required');
    }
    if (data.startTime >= data.endTime) {
      throw new ValidationError('Start time must be before end time');
    }

    // Validate max members
    if (data.maxMembers && data.maxMembers < 1) {
      throw new ValidationError('Maximum members must be at least 1');
    }
  }

  async create(data: CreateEventRequest): Promise<EventResponse> {
    try {
      await this.validateEvent(data);
      
      const event = await Event.create({
        name: data.name,
        societyId: data.societyId,
        trainerId: data.trainerId,
        eventDate: data.eventDate,
        startTime: data.startTime,
        endTime: data.endTime,
        maxMembers: data.maxMembers ?? 20
      } as EventAttributes, {
        returning: true,
        include: this.defaultIncludes
      });

      return toEventResponse(event);
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(id: string, data: UpdateEventRequest): Promise<EventResponse> {
    try {
      await this.validateEvent(data);
      return super.update(id, data);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findBySociety(societyId: string): Promise<EventResponse[]> {
    return this.findAll(
      { societyId },
      { include: this.defaultIncludes }
    );
  }

  async findByTrainer(trainerId: string): Promise<EventResponse[]> {
    return this.findAll(
      { trainerId },
      { include: this.defaultIncludes }
    );
  }

  async findUpcoming(): Promise<EventResponse[]> {
    return this.findAll(
      { eventDate: { $gte: new Date() } },
      { 
        include: this.defaultIncludes,
        order: [['eventDate', 'ASC']]
      }
    );
  }
} 