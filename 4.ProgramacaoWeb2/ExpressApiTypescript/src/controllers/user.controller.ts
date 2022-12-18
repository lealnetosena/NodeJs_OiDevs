import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import { UserDto } from '../domain/dtos/user';
import { ListUserUseCase } from "../useCases/user/listUser"; 
import { GetUserUseCase } from "../useCases/user/getUser"; 
import { UpdateUserUseCase } from "../useCases/user/updateUser"; 
import { DeleteUserUseCase } from "../useCases/user/deleteUser"; 
import { CreateUserUseCase } from "../useCases/user/createUser"; 
import { validationResult } from "express-validator/src/validation-result";
const prisma = new PrismaClient()

const emailRegex = 

/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


export async function listUser(req: Request, res:Response){
  const useCase = new ListUserUseCase()
  const users = await useCase.handle()
  return res.json(users)

}

interface GetParams {
    id: string
}
export async function getUser (req: Request<GetParams>, res:Response)  {
	const { id } = req.params

  const useCase = new GetUserUseCase()
  const user = await useCase.handle(id)

	if (!user) {

			return res.status(404).json({
					message: 'User not found!'
			});
	}
	
	return res.json(user)
}

export async function createUser (req: Request<{},{}, Omit<UserDto,'id'>>, res: Response){
	const user = req.body

  // const erros = validationResult(req);
  // if (!erros.isEmpty()){
  //   return res.status(400).json({ erros: erros.array()})
  // }

  const useCase = new CreateUserUseCase()
  const createdUser = useCase.handle(user)
  
	return res.json(createdUser)
}

interface PutParams {
    id: string
}
export async function updateUser (req: Request<PutParams,{}, Omit<UserDto,'id'>>, res: Response) {
    const { id } = req.params;
    const userData = req.body

    const user = prisma.user.findFirst({
        where: {
            id:{
                equals: id
            }
        }
        }
    )

	if (!user) {
		// Retornar que não encontrou
	return res.status(404).json({
      message: 'User not found!'
    })
	}
    
  const useCase = new UpdateUserUseCase()
  const updatedUser = useCase.handle({
    id,
    ...userData
  })

  return res.send(updatedUser)
}

interface DeleteParams {
	id: string
}
export async function deleteUser (req: Request<DeleteParams>, res:Response) {
		const {id} = req.params

    // Procurar se o usuario existe
    const user = prisma.user.findFirst({
      where: {
          id:{
              equals: id
          }
        }
      }
    )

    if (!user){
        return res.status(404).json({
            message: 'user not found'
        })
    }
    const useCase = new DeleteUserUseCase
    await useCase.handle(id)

  
	return res.json({
        message: 'User deleted!'
    })

}