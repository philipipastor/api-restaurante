import { NextFunction, Request, Response } from "express";
import { knex } from "../database/knex";
import { z } from "zod";
import { AppError } from "../utils/AppError";

class ProductController {
    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { name } = req.query

            const products = await knex<ProductRepository>("products").whereLike("name", `%${name ?? ""}%`).select()
            return res.json(products)

        } catch (error) {
            next(error)
        }
    }

    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                name: z.string({ message: "Nome é obrigatório" }).trim().min(3),
                price: z.number().gt(0, { message: "Valor tem que ser maior do que 0" })
            })

            const { name, price } = bodySchema.parse(req.body)

            await knex<ProductRepository>("products").insert({ name, price })
            return res.status(201).json()

        } catch (error) {
            next(error)
        }
    }

    async update(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().
                transform((value) => Number(value)).
                refine((value) => !isNaN(value), { message: "O id deve ser um número" }).
                parse(req.params.id)

            const bodySchema = z.object({
                name: z.string({ message: "Nome é obrigatório" }).trim().min(3),
                price: z.number().gt(0, { message: "Valor tem que ser maior do que 0" })
            })

            const { name, price } = bodySchema.parse(req.body)

            const product = await knex<ProductRepository>("products").where({id}).first()

            if(!product){
                throw new AppError("Produto não existe")
            }

            await knex<ProductRepository>("products").update({ name, price, updated_at: knex.fn.now() }).where({ id })

            return res.json({ message: "update" })

        } catch (error) {
            next(error)
        }
    }

    async remove(req: Request, res: Response, next: NextFunction) {
        try {
            const id = z.string().
                transform((value) => Number(value)).
                refine((value) => !isNaN(value), { message: "O id deve ser um número" }).
                parse(req.params.id)

            const products = await knex<ProductRepository>("products").where({id}).first()

            if(!products){
                throw new AppError("Produto não existe")
            }
        
            await knex<ProductRepository>("products").delete().where({ id })
            return res.json()
        } catch (error) {

        }
    }
}

export { ProductController }