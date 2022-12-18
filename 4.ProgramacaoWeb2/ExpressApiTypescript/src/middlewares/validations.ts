import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export async function validationsMiddleware(req: Request, res: Response, next: NextFunction) {

    
    const erros = validationResult(req);
    if (!erros.isEmpty()){
      return res.status(400).json({ erros: erros.array()})
    }

    await next()
}