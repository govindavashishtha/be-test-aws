import { Model, FindOptions, WhereOptions, CreationAttributes } from 'sequelize';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { CrudService, NotificationService } from './interfaces/service.interface';
import { Service } from './interfaces/service.interface';

export abstract class BaseService<
  T extends Model,
  CreateDTO,
  UpdateDTO,
  ResponseDTO
> implements CrudService<CreateDTO, UpdateDTO, ResponseDTO>, Service {
  protected constructor(
    protected readonly model: typeof Model & { new(): T },
    protected readonly toResponseDTO: (model: T) => ResponseDTO | Promise<ResponseDTO>,
    protected readonly defaultIncludes: any[] = []
  ) {}

  protected async validateEntity(data: any): Promise<void> {
    // Implement validation logic
  }

  protected handleError(error: any): never {
    console.error(`[${this.model.name}Service] Error:`, error);
    
    if (error.name === 'SequelizeValidationError') {
      throw new ValidationError(error.message);
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('Resource already exists');
    }
    throw error;
  }

  async init(): Promise<void> {}

  protected async findByIdOrThrow(id: string, options?: FindOptions): Promise<T> {
    const instance = await this.model.findByPk(id, options);
    if (!instance) {
      throw new NotFoundError(`${this.model.name} not found`);
    }
    return instance as T;
  }

  async create(data: CreateDTO, include?: any[]): Promise<ResponseDTO> {
    try {
      await this.validateEntity(data);
      const instance = await this.model.create(data as CreationAttributes<T>, {
        include: include || this.defaultIncludes
      });
      return await this.toResponseDTO(instance as T);
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: string, options?: FindOptions): Promise<ResponseDTO> {
    const instance = await this.findByIdOrThrow(id, options);
    return await this.toResponseDTO(instance);
  }

  async findOne(where: WhereOptions<T>, options?: FindOptions): Promise<ResponseDTO | null> {
    const instance = await this.model.findOne({
      ...options,
      where: {
        ...options?.where,
        ...where
      }
    });
    return instance ? this.toResponseDTO(instance as T) : null;
  }

  async findAll(where?: WhereOptions<T>, options?: FindOptions): Promise<ResponseDTO[]> {
    const instances = await this.model.findAll({
      ...options,
      where: {
        ...options?.where,
        ...where
      }
    });
    return Promise.all(instances.map(instance => this.toResponseDTO(instance as T)));
  }

  async update(id: string, data: Partial<UpdateDTO>, options?: FindOptions): Promise<ResponseDTO> {
    const instance = await this.model.findByPk(id, options);
    if (!instance) {
      throw new NotFoundError(`${this.model.name} not found`);
    }

    await instance.update(data as Partial<T>);
    return this.toResponseDTO(instance as T);
  }

  async delete(id: string): Promise<void> {
    const instance = await this.model.findByPk(id);
    if (!instance) {
      throw new NotFoundError(`${this.model.name} not found`);
    }
    await instance.destroy();
  }

  async count(where?: WhereOptions<T>): Promise<number> {
    return this.model.count({ where });
  }

  async bulkCreate(data: CreateDTO[]): Promise<ResponseDTO[]> {
    try {
      const instances = await this.model.bulkCreate(data as CreationAttributes<T>[], { returning: true });
      return Promise.all(instances.map(instance => this.toResponseDTO(instance as T)));
    } catch (error) {
      this.handleError(error);
    }
  }

  protected async paginate(options: FindOptions & {
    page?: number;
    limit?: number;
  }): Promise<{
    data: ResponseDTO[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.model.findAndCountAll({
      ...options,
      limit,
      offset,
      include: options.include || this.defaultIncludes
    });

    return {
      data: await Promise.all(rows.map(row => this.toResponseDTO(row as T))),
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  }

  protected async transformResponse(model: T): Promise<ResponseDTO> {
    return await Promise.resolve(this.toResponseDTO(model));
  }
}

export abstract class CacheBaseService implements CacheBaseService {
  abstract init(): Promise<void>;
  abstract set(key: string, value: string, expiry: { duration: number }): Promise<'OK'>;
  abstract get(key: string): Promise<string | null>;
  abstract del(key: string): Promise<number>;
}

export abstract class NotificationBaseService implements NotificationService {
  abstract init(): Promise<void>;
  abstract send(userId: string, message: string): Promise<void>;
  abstract sendBulk(userIds: string[], message: string): Promise<void>;
} 