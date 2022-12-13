import { Request, Response, Router } from 'express'
import { User } from '../domain/entities/user'
import { UserDto } from '../domain/dtos/user';

// /users
const userRoutes = Router();

let users: User[] = [];

const emailRegex = 

/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


userRoutes.get('/', (request: Request, response:Response) => {
	return response.send(users)

});

interface GetParams {
    id: number
}

userRoutes.get('/:id', (request: Request<GetParams>, response:Response) => {
	const {id} = request.params
	const user = users.find((x)=> x.id == id)


	if (!user) {

		return response.status(404).json({
            message: 'User not found!'
        });
	}

	return response.send(user)
})

userRoutes.post('/', (request: Request<{},{}, User>, response: Response)=> {
	const user = request.body

    // tipagem do body utilizando o tipo request do express

    if (!user.id) {
        return response.status(400).json({
            field: 'id',
            message: 'Id is invalid'
        })
    }

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

	users.push(user)
	return response.send(user)
});


interface PutParams {
    id: number
}

userRoutes.put('/:id', (
    request: Request<PutParams,{}, Omit<UserDto,'id'>>, 
    response: Response
    ) => {
  const { id } = request.params;
  const userIndex = users.findIndex((x) => x.id == id);

	if (userIndex === -1 ) {
		// Retornar que não encontrou
		return response.send('Not Found!')
	}
    

	users[userIndex].name = request.body.name
	users[userIndex].email = request.body.email

	return response.send(users[userIndex])
	

})

interface DeleteParams {
    id: number
}


userRoutes.delete('/:id',(request: Request<DeleteParams>, response:Response) => {
	const {id} = request.params

    // Procurar se o usuario existe
    const userIndex = users.findIndex((x) => x.id == id)
    const userExists = userIndex > -1;

    if (!userExists){
        return response.status(404).json({
            message: 'user not found'
        })
    }

	users = users.filter((x) => x.id != id)
	return response.json({
        message: 'User deleted!'
    })

})


export default userRoutes