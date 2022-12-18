import {  Router } from 'express'

import { validationsMiddleware } from '../middlewares/validations'
import { createUser, deleteUser, updateUser, listUser, getUser } from '../controllers/user.controller';
import { editUserValidations, userIdValidations, userValidations } from '../validators/createUser';

// /users
const userRoutes = Router();

userRoutes.get('/',listUser);
userRoutes.get('/:id', getUser)
userRoutes.post('/', userValidations, validationsMiddleware, createUser);
userRoutes.put('/:id', editUserValidations, validationsMiddleware, updateUser)
userRoutes.delete('/:id', userIdValidations, validationsMiddleware, deleteUser)

export default userRoutes