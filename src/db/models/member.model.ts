import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';
import { User } from './user.model';
import { Society } from './society.model';
import { Subscription } from './subscription.model';

export interface MemberAttributes extends BaseAttributes {
  userId: string;
  societyId: string;
  subscriptionId?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export class Member extends BaseModel<MemberAttributes> {
  declare id: string;
  declare userId: string;
  declare societyId: string;
  declare subscriptionId?: string;
  declare status: 'pending' | 'approved' | 'rejected';
  declare createdAt: Date;
  declare updatedAt: Date;

  // Add association properties
  declare user?: User;
  declare society?: Society;
  declare subscription?: Subscription;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' }
        },
        societyId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'societies', key: 'id' }
        },
        subscriptionId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: { model: 'subscriptions', key: 'id' }
        },
        status: {
          type: DataTypes.ENUM('pending', 'approved', 'rejected'),
          defaultValue: 'pending'
        }
      },
      {
        sequelize,
        tableName: 'members'
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Society, { foreignKey: 'societyId', as: 'society' });
    this.belongsTo(models.Subscription, { foreignKey: 'subscriptionId', as: 'subscription' });
  }
} 