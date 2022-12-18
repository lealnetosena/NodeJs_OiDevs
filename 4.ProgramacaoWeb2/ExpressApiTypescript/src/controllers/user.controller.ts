import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 } from 'uuid'

import { UserDto } from '../domain/dtos/user';

const prisma = new PrismaClient()

const emailRegex = 

/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


export async function listUser(req: Request, res:Response){

    const users = await prisma.user.findMany({
        include: {
          city: true
        }
      });
      return res.json(users)

}

interface GetParams {
    id: string
}
export async function getUser (req: Request<GetParams>, res:Response)  {
	const { id } = req.params
	const user = await prisma.user.findFirst({
			where:{
					id: {
							equals: id
					}
			},
				include: {
					city: true
				}  
	})

	if (!user) {

			return res.status(404).json({
					message: 'User not found!'
			});
	}
	
	return res.json(user)
}

export async function createUser (req: Request<{},{}, UserDto>, res: Response){
	const user = req.body

	// tipagem do body utilizando o tipo request do express
	if (!user.name) {
			return res.status(400).json({
					field: 'name',
					message: 'Name is invalid'
			})
	} 

	if (!user.email || !emailRegex.test(user.email)) {
			return res.status(400).json({
					field: 'email',
					message: 'Email is invalid'
			})
	} 

	const createdUser = await prisma.user.create({
			data: {
					id: v4(),
					name: user.name,
					email: user.email,
					cityId: user.cityId 
			}
	})
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
    
  const updatedUser = await prisma.user.update({
        data: {
        name: userData.name,
        email: userData.email
        },
        where:{
        id: id
        }
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

    await prisma.user.delete({
      where: {
        id: id
      }
    })
  
	return res.json({
        message: 'User deleted!'
    })

}