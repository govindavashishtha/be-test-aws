import Joi from 'joi';

export const createBookingSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  eventId: Joi.string().uuid().required()
});

export const updateBookingSchema = Joi.object({
  status: Joi.string().valid('confirmed', 'cancelled').required()
}); 