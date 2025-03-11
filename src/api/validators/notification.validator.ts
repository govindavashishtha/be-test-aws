import Joi from 'joi';

export const createNotificationSchema = Joi.object({
  userId: Joi.string().uuid().required(),
  type: Joi.string().valid('email', 'sms').required(),
  title: Joi.string().required(),
  message: Joi.string().required(),
  email: Joi.string().email().when('type', {
    is: 'email',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  phoneNumber: Joi.string().when('type', {
    is: 'sms',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  })
}); 