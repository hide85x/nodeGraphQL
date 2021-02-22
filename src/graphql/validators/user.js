import Joi from '@hapi/joi';


const name = Joi
    .string()
    .max(20)
    .required()
    .label('Name')

const email = Joi
    .string()
    .email()
    .required()
    .label('Email')

const username = Joi
    .string()
    .min(5)
    .max(20)
    .required()
    .label('Username')

const password = Joi
    .string()
    .max(20)
    .min(5)
    .required()
    .label('Password')

export const loginValidate = Joi.object({
    username,
    password
})
export const registerValidate = Joi.object({
    name,
    email,
    username,
    password
})