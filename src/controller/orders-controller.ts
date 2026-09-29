import { Response, Request, NextFunction } from "express";
import { knex } from "../database/knex";
import { z } from "zod";
import { AppError } from "../utils/AppError";

class OrdersController {
    async create(req: Request, res: Response, next: NextFunction) {

        try {
            const bodySchema = z.object({
                table_session_id: z.number(),
                product_id: z.number(),
                quantity: z.number(),
            })

            const { table_session_id, product_id, quantity } = bodySchema.parse(req.body)

            const session = await knex<TableSessionsRepository>("tables_sessions").where({ id: table_session_id }).first()

            if (!session) {
                throw new AppError("Essa mesa não está aberta")
            }

            if (session.closed_at) {
                throw new Error("Essa mesa já está fechada")
            }

            const product = await knex<ProductRepository>("products").where({ id: product_id }).first()

            if (!product) {
                throw new AppError("Esse produto não existe")
            }

            await knex<OrdersRepository>("orders").insert({ table_session_id, product_id, quantity, price: product.price })

            res.status(201).json()
        } catch (error) {
            next(error)
        }

    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const { table_session_id } = req.params
            const order = await knex("orders")
                .select("orders.id", "orders.table_session_id", "orders.product_id", "products.name", "orders.price", "orders.quantity", knex.raw("(orders.price * orders.quantity) AS Total"), "orders.created_at", "orders.updated_at")
                .join("products", "products.id", "orders.product_id")
                .where({ table_session_id })
                .orderBy("orders.created_at", "desc")
            return res.json(order)
        } catch (error) {
            next(error)
        }
    }

    async show(req: Request, res: Response, next: NextFunction) {
        try {
            const { table_session_id } = req.params
            const order = await knex("orders")
                .select(knex.raw("COALESCE(SUM(orders.price * orders.quantity), 0) AS Total"), knex.raw("COALESCE(SUM(orders.quantity), 0) AS Total"))
                .where({ table_session_id })
                .first()
            return res.json(order)
        } catch (error) {
            next(error)
        }
    }
}

export { OrdersController }