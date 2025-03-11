import { Sequelize } from 'sequelize';
import { User } from './user.model';
import { Society } from './society.model';
import { Event } from './event.model';
import { Booking } from './booking.model';
import { Subscription } from './subscription.model';
import { Trainer } from './trainer.model';
import { Notification } from './notification.model';

const models = [User, Society, Event, Booking, Subscription, Trainer];

export function initializeModels(sequelize: Sequelize) {
  // Initialize all models
  models.forEach(model => model.initialize(sequelize));

  // Set up associations
  models.forEach(model => {
    if (model.associate) {
      model.associate(sequelize.models);
    }
  });

  // Define associations
  User.belongsTo(Society, { as: 'society', foreignKey: 'societyId' });
  User.belongsTo(Subscription, { as: 'subscription', foreignKey: 'subscriptionId' });
  Society.hasMany(User, { as: 'users', foreignKey: 'societyId' });
  Event.belongsTo(Society, { as: 'society', foreignKey: 'societyId' });
  Event.belongsTo(User, { as: 'trainer', foreignKey: 'trainerId' });
  Booking.belongsTo(Event, { as: 'event', foreignKey: 'eventId' });
  Booking.belongsTo(User, { as: 'user', foreignKey: 'userId' });

  return sequelize.models;
}

export {
  User,
  Society,
  Event,
  Booking,
  Subscription,
  Notification,
  Trainer
}; 