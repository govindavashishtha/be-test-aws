import Joi from 'joi';

export const createSubscriptionSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  durationInDays: Joi.number().min(1).required()
});

export const updateSubscriptionSchema = Joi.object({
  name: Joi.string(),
  price: Joi.number().min(0),
  durationInDays: Joi.number().min(1)
}).min(1); 