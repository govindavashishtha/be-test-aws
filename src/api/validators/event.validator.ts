import Joi from 'joi';

export const createEventSchema = Joi.object({
  name: Joi.string().required(),
  societyId: Joi.string().uuid().required(),
  trainerId: Joi.string().uuid().required(),
  eventDate: Joi.date().greater('now').required(),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  maxMembers: Joi.number().min(1).default(20)
});

export const updateEventSchema = Joi.object({
  name: Joi.string(),
  eventDate: Joi.date().greater('now'),
  startTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  endTime: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
  maxMembers: Joi.number().min(1)
}).min(1); 