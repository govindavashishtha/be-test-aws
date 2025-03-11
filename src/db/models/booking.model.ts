import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';
import { Event, User } from './index';

export interface BookingAttributes extends BaseAttributes {
  userId: string;
  eventId: string;
  status: 'confirmed' | 'cancelled';
}

export class Booking extends BaseModel<BookingAttributes> {
  declare userId: string;
  declare eventId: string;
  declare status: 'confirmed' | 'cancelled';
  
  // Add association properties
  declare event?: Event;
  declare user?: User;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'user_id'
        },
        eventId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'event_id'
        },
        status: {
          type: DataTypes.ENUM('confirmed', 'cancelled'),
          allowNull: false,
          defaultValue: 'confirmed'
        }
      },
      {
        sequelize,
        tableName: 'bookings'
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Member, { foreignKey: 'userId', as: 'member' });
    this.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    this.belongsTo(models.Event, { foreignKey: 'eventId', as: 'event' });
  }
} 