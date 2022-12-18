import { body, param } from "express-validator"

export const userValidations = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email is invalid'),
    body('cityId').notEmpty().withMessage('cityId is required')
]

export const userIdValidations = [
    param('id').notEmpty().withMessage('Name is required'),
    ...userValidations
]

export const editUserValidations = [
    ...userIdValidations,
    ...userValidations
]