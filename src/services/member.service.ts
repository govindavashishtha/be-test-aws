import { User, Society, Subscription } from '../db/models';
import { CreateMemberRequest, UpdateMemberRequest, MemberResponse, UpdateMemberStatusRequest } from '../api/types';
import { BaseService } from './base.service';
import { Member, MemberAttributes } from '../db/models/member.model';
import { WhereOptions, FindOptions } from 'sequelize';


const toMemberResponse = (member: Member): MemberResponse => ({
  id: member.id,
  name: member.user?.name!,
  email: member.user?.email!,
  phoneNumber: member.user?.phoneNumber!,
  status: member.status,
  societyId: member.societyId,
  subscriptionId: member.subscriptionId!,
  createdAt: member.createdAt,
  updatedAt: member.updatedAt,
  society: member.society && {
    name: member.society.name
  },
  subscription: member.subscription && {
    name: member.subscription.name,
    durationInDays: member.subscription.durationInDays
  }
});

export class MemberService extends BaseService<Member, CreateMemberRequest, UpdateMemberRequest, MemberResponse> {
  private static instance: MemberService;

  private constructor() {
    super(Member as any, toMemberResponse);
  }

  public static getInstance(): MemberService {
    if (!MemberService.instance) {
      MemberService.instance = new MemberService();
    }
    return MemberService.instance;
  }

  async create(data: CreateMemberRequest): Promise<MemberResponse> {
    return super.create(data, [
      { model: User, as: 'user' },
      { model: Society, as: 'society' },
      { model: Subscription, as: 'subscription' }
    ]);
  }

  async findAll(where?: WhereOptions<MemberAttributes>, options?: FindOptions): Promise<MemberResponse[]> {
    return super.findAll(
      where,
      {
        ...options,
        include: [
          { model: User, as: 'user' },
          { model: Society, as: 'society' },
          { model: Subscription, as: 'subscription' }
        ]
      }
    );
  }

  async updateStatus(request: UpdateMemberStatusRequest): Promise<MemberResponse> {
    const member = await this.update(request.id, { status: request.status });
    return member;
  }
}
