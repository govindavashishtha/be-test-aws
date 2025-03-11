import { DataTypes } from 'sequelize';
import { BaseModel, BaseAttributes, baseFields } from './base.model';
import { sequelize } from '../config';
import { Society } from './society.model';

export interface UserAttributes extends BaseAttributes {
  id: string;
  name: string;
  email: string;
  role: string;
  phoneNumber?: string;
  password?: string;
  status: string;
  societyId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserAttributes = Omit<UserAttributes, keyof BaseAttributes> & Partial<BaseAttributes>;

export class User extends BaseModel<UserAttributes> {
  declare id: string;
  declare name: string;
  declare email?: string;
  declare phoneNumber: string;
  declare password: string;
  declare societyId?: string;
  declare role: 'member' | 'trainer' | 'society_admin';
  declare status: 'pending' | 'approved' | 'rejected';
  declare createdAt: Date;
  declare updatedAt: Date;

  // Add association properties
  declare society?: Society;

  static modelName = 'User' as const;
  static tableName = 'users' as const;
}

User.init(
  {
    ...baseFields,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    societyId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('member', 'trainer', 'society_admin'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    tableName: 'users'
  }
); 