import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';
import { User } from './user.model';
import { Event } from './event.model';

export interface SocietyAttributes extends BaseAttributes {
  name: string;
  location: string;
  maxMembersPerEvent: number;
}

export class Society extends BaseModel<SocietyAttributes> {
  declare id: string;
  declare name: string;
  declare location: string;
  declare maxMembersPerEvent: number;
  declare createdAt: Date;
  declare updatedAt: Date;

  // Add association properties
  declare members?: User[];
  declare events?: Event[];

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        location: {
          type: DataTypes.STRING,
          allowNull: false
        },
        maxMembersPerEvent: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 20,
          field: 'max_members_per_event'
        }
      },
      {
        sequelize,
        tableName: 'societies'
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.Member, { foreignKey: 'societyId', as: 'members' });
    this.hasMany(models.Event, { foreignKey: 'societyId', as: 'events' });
  }
} 