import { MemberService } from './member.service';
import { SocietyService } from './society.service';
import { EventService } from './event.service';
import { BookingService } from './booking.service';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { TrainerService } from './trainer.service';
import { UserService } from './user.service';
import { SubscriptionService } from './subscription.service';
import { ServiceRegistry } from './service.registry';
import { redisClient } from '../app';
import { FirebaseService } from './firebase.service';

export const initServices = async () => {
  // Initialize ServiceRegistry first
  const registry = ServiceRegistry.getInstance();
  registry.init();

  // Initialize all services
  const authService = await AuthService.getInstance(redisClient);
  const societyService = await SocietyService.getInstance();
  const memberService = await MemberService.getInstance();
  const eventService = await EventService.getInstance();
  const bookingService = await BookingService.getInstance();
  const notificationService = await NotificationService.getInstance();
  const trainerService = await TrainerService.getInstance();
  const userService = await UserService.getInstance();
  const subscriptionService = await SubscriptionService.getInstance();
  const firebaseService = await FirebaseService.getInstance();

  // Register services
  registry.register('auth', authService);
  registry.register('society', societyService);
  registry.register('member', memberService);
  registry.register('event', eventService);
  registry.register('booking', bookingService);
  registry.register('notification', notificationService);
  registry.register('trainer', trainerService);
  registry.register('user', userService);
  registry.register('subscription', subscriptionService);
  registry.register('firebase', firebaseService);

  console.log('Services initialized successfully');
};

// Helper functions to get services
export const getAuthService = () => ServiceRegistry.getInstance().get('auth');
export const getSocietyService = () =>
  ServiceRegistry.getInstance().get('society');
export const getMemberService = () =>
  ServiceRegistry.getInstance().get('member');
export const getEventService = () => ServiceRegistry.getInstance().get('event');
export const getBookingService = () =>
  ServiceRegistry.getInstance().get('booking');
export const getNotificationService = () =>
  ServiceRegistry.getInstance().get('notification');
export const getTrainerService = () =>
  ServiceRegistry.getInstance().get('trainer');
export const getUserService = () => ServiceRegistry.getInstance().get('user');
export const getSubscriptionService = () =>
  ServiceRegistry.getInstance().get('subscription');
export const getFirebaseService = () =>
  ServiceRegistry.getInstance().get('firebase');

export {
  AuthService,
  SocietyService,
  MemberService,
  EventService,
  BookingService,
  NotificationService,
  TrainerService,
  UserService,
  SubscriptionService,
};
