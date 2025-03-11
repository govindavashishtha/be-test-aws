import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';
import { Event } from './event.model';

export interface TrainerAttributes extends BaseAttributes {
  name: string;
  email: string;
  phoneNumber: string;
  specialization: string;
}

export class Trainer extends BaseModel<TrainerAttributes> {
  declare id: string;
  declare name: string;
  declare email: string;
  declare phoneNumber: string;
  declare specialization: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Add association properties
  declare events?: Event[];

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        phoneNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          field: 'phone_number'
        },
        specialization: {
          type: DataTypes.STRING,
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'trainers'
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.Event, { foreignKey: 'trainerId', as: 'events' });
  }
} 