import { sequelize } from '../config';
import { User } from '../models/user.model';
// Import other models as needed

export async function runMigrations() {
  try {
    // Sync all models with the database
    await sequelize.sync({ alter: true });
    console.log('Database migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
} 