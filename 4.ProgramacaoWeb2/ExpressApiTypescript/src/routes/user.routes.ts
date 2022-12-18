import {  Router } from 'express'

import { createUser, deleteUser, updateUser, listUser, getUser } from '../controllers/user.controller';

// /users
const userRoutes = Router();

userRoutes.get('/',listUser);
userRoutes.get('/:id', getUser)
userRoutes.post('/', createUser);
userRoutes.put('/:id', updateUser)
userRoutes.delete('/:id', deleteUser)

export default userRoutes