import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';

export interface EventAttributes extends BaseAttributes {
  name: string;
  societyId: string;
  trainerId: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  maxMembers: number;
}

export class Event extends BaseModel<EventAttributes> {
  declare id: string;
  declare name: string;
  declare societyId: string;
  declare trainerId: string;
  declare eventDate: Date;
  declare startTime: string;
  declare endTime: string;
  declare maxMembers: number;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        societyId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'society_id'
        },
        trainerId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'trainer_id'
        },
        eventDate: {
          type: DataTypes.DATE,
          allowNull: false,
          field: 'event_date'
        },
        startTime: {
          type: DataTypes.TIME,
          allowNull: false,
          field: 'start_time'
        },
        endTime: {
          type: DataTypes.TIME,
          allowNull: false,
          field: 'end_time'
        },
        maxMembers: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 20,
          field: 'max_members'
        }
      },
      {
        sequelize,
        tableName: 'events'
      }
    );
  }

  static associate(models: any) {
    this.belongsTo(models.Society, { foreignKey: 'societyId', as: 'society' });
    this.belongsTo(models.Trainer, { foreignKey: 'trainerId', as: 'trainer' });
    this.hasMany(models.Booking, { foreignKey: 'eventId', as: 'bookings' });
  }
} 