import { FindOptions, WhereOptions } from 'sequelize';

export interface Service {
  init?(): Promise<void>;
}

export interface CacheService extends Service {
  set(key: string, value: string, expiry: { duration: number }): Promise<'OK'>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
}

export interface CrudService<CreateDTO, UpdateDTO, ResponseDTO> extends Service {
  create(data: CreateDTO): Promise<ResponseDTO>;
  findById(id: string, options?: FindOptions): Promise<ResponseDTO>;
  findOne(where: WhereOptions<any>, options?: FindOptions): Promise<ResponseDTO | null>;
  findAll(where?: WhereOptions<any>, options?: FindOptions): Promise<ResponseDTO[]>;
  update(id: string, data: Partial<UpdateDTO>): Promise<ResponseDTO>;
  delete(id: string): Promise<void>;
}

export interface AuthenticationService extends Service {
  signUp(data: any): Promise<any>;
  login(credentials: any): Promise<any>;
  verifyOTP(phoneNumber: string, otp: string): Promise<any>;
}

export interface NotificationService extends Service {
  send(userId: string, message: string): Promise<void>;
  sendBulk(userIds: string[], message: string): Promise<void>;
}

export interface BookingService extends CrudService<any, any, any> {
  checkAvailability(eventId: string): Promise<boolean>;
  confirmBooking(bookingId: string): Promise<void>;
}

export interface EventService extends CrudService<any, any, any> {
  schedule(data: any): Promise<any>;
  cancel(eventId: string): Promise<void>;
} 