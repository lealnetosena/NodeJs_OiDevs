import { Request, Response, Router } from 'express'
import { v4 } from 'uuid'
import { PrismaClient } from '@prisma/client'

import { User } from '../domain/entities/user'
import { UserDto } from '../domain/dtos/user';


const prisma = new PrismaClient()
// /users
const userRoutes = Router();


const emailRegex = 

/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


userRoutes.get(
    '/', 
    async (request: Request, response:Response) => {
        const users = await prisma.user.findMany({
          include: {
            city: true
          }
        });
        return response.json(users)

});

interface GetParams {
    id: string
}

userRoutes.get(
    '/:id', 
    async (request: Request<GetParams>, response:Response) => {
        const { id } = request.params
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

            return response.status(404).json({
                message: 'User not found!'
            });
        }
        
        return response.json(user)
})

userRoutes.post(
    '/', 
    async (request: Request<{},{}, UserDto>, response: Response)=> {
        const user = request.body

        // tipagem do body utilizando o tipo request do express
        if (!user.name) {
            return response.status(400).json({
                field: 'name',
                message: 'Name is invalid'
            })
        } 

        if (!user.email || !emailRegex.test(user.email)) {
            return response.status(400).json({
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
        return response.json(createdUser)
});


interface PutParams {
    id: string
}

userRoutes.put('/:id', async (
    request: Request<PutParams,{}, Omit<UserDto,'id'>>, 
    response: Response
    ) => {
  const { id } = request.params;
  const userData = request.body

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
		return response.status(404).json({
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

	return response.send(updatedUser)
	

})

interface DeleteParams {
    id: string
}


userRoutes.delete('/:id', async (request: Request<DeleteParams>, response:Response) => {
	const {id} = request.params

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
        return response.status(404).json({
            message: 'user not found'
        })
    }

    await prisma.user.delete({
      where: {
        id: id
      }
    })
  
	return response.json({
        message: 'User deleted!'
    })

})


export default userRoutes