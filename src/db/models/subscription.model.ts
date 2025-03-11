import { DataTypes, Sequelize } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';

interface SubscriptionAttributes extends BaseAttributes {
  name: string;
  price: number;
  durationInDays: number;
}

export class Subscription extends BaseModel<SubscriptionAttributes> {
  public name!: string;
  public price!: number;
  public durationInDays!: number;

  static initialize(sequelize: Sequelize) {
    this.init(
      {
        ...baseFields,
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        price: {
          type: DataTypes.DECIMAL,
          allowNull: false
        },
        durationInDays: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'duration_in_days'
        }
      },
      {
        sequelize,
        tableName: 'subscriptions'
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.Member, { foreignKey: 'subscriptionId', as: 'members' });
  }
} 