import Joi from 'joi';

export const createSocietySchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  maxMembersPerEvent: Joi.number().min(1).default(20)
});

export const updateSocietySchema = Joi.object({
  name: Joi.string(),
  location: Joi.string(),
  maxMembersPerEvent: Joi.number().min(1)
}).min(1); 