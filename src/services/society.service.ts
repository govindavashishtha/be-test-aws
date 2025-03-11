import { Society } from '../db/models';
import { CreateSocietyRequest, UpdateSocietyRequest, SocietyResponse } from '../api/types';
import { BaseService } from './base.service';
import { SocietyAttributes } from '../db/models/society.model';

// Merge mapper function into index
const toSocietyResponse = (society: Society): SocietyResponse => ({
  id: society.id,
  name: society.name,
  location: society.location,
  maxMembersPerEvent: society.maxMembersPerEvent,
  createdAt: society.createdAt,
  updatedAt: society.updatedAt
});

export class SocietyService extends BaseService<
  Society,
  CreateSocietyRequest,
  UpdateSocietyRequest,
  SocietyResponse
> {
  private static instance: SocietyService;

  private constructor() {
    super(Society as any, toSocietyResponse);
  }

  public static getInstance(): SocietyService {
    if (!SocietyService.instance) {
      SocietyService.instance = new SocietyService();
    }
    return SocietyService.instance;
  }

  async findByLocation(location: string): Promise<SocietyResponse[]> {
    return this.findAll({ location });
  }
} 