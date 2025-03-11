import { User, Society } from '../db/models';
import { CreateUserRequest, UpdateUserRequest, UserResponse } from '../api/types';
import { BaseService } from './base.service';
import { UserAttributes } from '../db/models/user.model';
import { WhereOptions, FindOptions } from 'sequelize';

// Merge mapper function into index
const toUserResponse = (user: User): UserResponse => ({
  id: user.id,
  name: user.name,
  email: user.email,
  phoneNumber: user.phoneNumber,
  role: user.role,
  status: user.status,
  societyId: user.societyId,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
  society: user.society && {
    name: user.society.name
  }
});

export class UserService extends BaseService<
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse
> {
  private static instance: UserService;

  private constructor() {
    super(User as any, toUserResponse);
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async create(data: CreateUserRequest): Promise<UserResponse> {
    const user = await User.create({
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: data.password,
      role: data.role,
      societyId: data.societyId,
      status: 'pending'
    });

    return toUserResponse(user);
  }

  async findAll(where?: WhereOptions<User>, options?: FindOptions): Promise<UserResponse[]> {
    return super.findAll(
      where as WhereOptions<User>,
      {
        ...options,
        include: [
          { model: Society, as: 'society' }
        ]
      }
    );
  }

  async updateStatus(id: string, status: 'approved' | 'rejected'): Promise<UserResponse | null> {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update({ status });
    return toUserResponse(user);
  }
} 