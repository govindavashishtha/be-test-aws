import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('member', 'trainer', 'society_admin').required(),
  societyId: Joi.string().uuid().when('role', {
    is: 'member',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  subscriptionId: Joi.string().uuid().optional()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('member', 'trainer', 'society_admin').required()
});

export const signUpSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters',
      'any.required': 'Name is required'
    }),
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{10,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format. Must include country code (e.g. +1234567890)',
      'any.required': 'Phone number is required'
    })
});

export const sendOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{10,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required'
    }),
  isResend: Joi.boolean()
    .default(false)
});

export const verifyOTPSchema = Joi.object({
  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{10,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid phone number format',
      'any.required': 'Phone number is required'
    }),
  otp: Joi.string()
    .length(6)
    .required()
    .messages({
      'string.length': 'OTP must be 6 digits',
      'any.required': 'OTP is required'
    })
}); 