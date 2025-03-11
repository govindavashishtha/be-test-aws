import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';
import { User } from './user.model';

export interface NotificationAttributes extends BaseAttributes {
  userId: string;
  type: 'email' | 'sms';
  title: string;
  message: string;
  status: 'pending' | 'sent' | 'failed';
}

export class Notification extends BaseModel<NotificationAttributes> {
  declare id: string;
  declare userId: string;
  declare type: 'email' | 'sms';
  declare title: string;
  declare message: string;
  declare status: 'pending' | 'sent' | 'failed';
  declare createdAt: Date;
  declare updatedAt: Date;

  // Add association properties
  declare user?: User;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          }
        },
        type: {
          type: DataTypes.ENUM('email', 'sms'),
          allowNull: false
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('pending', 'sent', 'failed'),
          defaultValue: 'pending'
        }
      },
      {
        sequelize,
        tableName: 'notifications'
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  }
} 