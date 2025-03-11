import { Trainer, Event } from '../db/models';
import { CreateTrainerRequest, UpdateTrainerRequest, TrainerResponse } from '../api/types';
import { BaseService } from './base.service';
import { TrainerAttributes } from '../db/models/trainer.model';

const toTrainerResponse = (trainer: Trainer): TrainerResponse => ({
  id: trainer.id,
  name: trainer.name,
  email: trainer.email,
  phoneNumber: trainer.phoneNumber,
  specialization: trainer.specialization,
  createdAt: trainer.createdAt,
  updatedAt: trainer.updatedAt,
  events: trainer.events?.map(event => ({
    id: event.id,
    name: event.name,
    eventDate: event.eventDate,
    startTime: event.startTime,
    endTime: event.endTime
  }))
});

export class TrainerService extends BaseService<
  Trainer,
  CreateTrainerRequest,
  UpdateTrainerRequest,
  TrainerResponse
> {
  private static instance: TrainerService;

  private constructor() {
    super(Trainer as any, toTrainerResponse);
  }

  public static getInstance(): TrainerService {
    if (!TrainerService.instance) {
      TrainerService.instance = new TrainerService();
    }
    return TrainerService.instance;
  }

  async findAll(): Promise<TrainerResponse[]> {
    return super.findAll({}, {
      include: [{ model: Event, as: 'events' }]
    });
  }
} 
