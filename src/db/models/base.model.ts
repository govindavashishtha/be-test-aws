import { Model, DataTypes } from 'sequelize';
import { Sequelize } from 'sequelize';

export interface BaseAttributes {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAttributes<T> = Omit<T, keyof BaseAttributes> & Partial<BaseAttributes>;

export abstract class BaseModel<T extends BaseAttributes> extends Model<T, Partial<T>> {
  public id!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  static modelName: string;
  static tableName: string;

  static initialize(sequelize: Sequelize): void {
    throw new Error('Initialize method must be implemented');
  }

  static associate?(models: any): void;

  static hooks = {
    beforeCreate: (instance: Model): void => {
      instance.setDataValue('id', DataTypes.UUIDV4());
      instance.setDataValue('createdAt', new Date());
      instance.setDataValue('updatedAt', new Date());
    },
    beforeUpdate: (instance: Model): void => {
      instance.setDataValue('updatedAt', new Date());
    }
  };
}

export const baseFields = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}; 