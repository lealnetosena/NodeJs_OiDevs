import { Router, Request, Response, response } from 'express';
import { PrismaClient } from '@prisma/client';

import { CityDto } from '../domain/dtos/city';
import { isStringObject } from 'util/types';

const prisma = new PrismaClient()

const citiesRoutes = Router();

//const cities: any[] = []

interface GetParams {
    id: string;

}

interface GetQuery{
    nameCity: string
}

// /GET
citiesRoutes.get('/',
    async (req: Request<GetParams, {}, {}, GetQuery>, res: Response) => {
        
    const { nameCity } = req.query
    
    //console.log(nameCity, typeof(nameCity))

    if(typeof(nameCity) == 'string' ||  typeof(nameCity) == 'undefined' ){

      const cities = await prisma.city.findMany({
          where:{
              name: {
                  equals: nameCity
              }
          }
      })
      return res.json(cities);
    } else {
      return res.status(404).json({
        message: 'Query paraments incorrect'
      })
    }
})


// /GET
citiesRoutes.get('/:id', async (req: Request<GetParams>, res: Response) => {
    const {id} = req.params
    
    const city = await prisma.city.findFirst({
        where: {
            id: Number(id) 
        }
    })

    if(!city){
        return res.status(404).json({
            message: 'City not found'
        })
    }

    return res.send(city);
})



// /POST
citiesRoutes.post('/', async (req: Request<{}, {}, CityDto>, res: Response) => {
    const { name , uf} = req.body;
    

    if(!name || !uf){
        return res.status(400).json({
            message: 'Campos name ou uf vazio!'
        })
    }

    const createdCity = await prisma.city.create({
        data: {
            name: name,
            uf: uf,
        }
    })

    return res.json(createdCity);
})

// /PUT
interface PutParams{
    id: string
}
citiesRoutes.put('/:id', async (req:Request<PutParams, {} , CityDto>, res:Response) => {
    const { id } = req.params
    
    const findDeletedCity = await prisma.city.findFirst({
        where:{
            id: Number(id)
        }
    })
    
    if(!findDeletedCity){
        return res.status(404).json({
            message : 'Id de City não encontrado'
        })
    }
    
    const { name, uf } = req.body;

    const updatedCity = await prisma.city.update({
        data:{
            name: name,
            uf: uf
        },
        where :{
            id: Number(id)
        }
    })

    return res.send(updatedCity);
})

interface DeleteParams{
    id: string
}
// /DELETE
citiesRoutes.delete('/:id', async (req: Request<DeleteParams>, res) => {
    const { id } = req.params;

    const findDeletedCity = await prisma.city.findFirst({
        where:{
            id: Number(id)
        }
    })

    if(!findDeletedCity){
        return res.status(400).json({
            message : 'Id de City não encontrado'
        })
    }

    const deletedCity = await prisma.city.delete({
        where:{
            id: Number(id)
        }
    })

    return res.send(deletedCity);
})

export default citiesRoutes;