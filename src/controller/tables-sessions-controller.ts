import { NextFunction, Request, Response } from "express";
import { knex } from "../database/knex";
import { z } from "zod"
import { AppError } from "../utils/AppError";

class TableSessions {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const bodySchema = z.object({
                table_id: z.number()
            })
            const { table_id } = bodySchema.parse(req.body)

            const sessions = await knex<TableSessionsRepository>("tables_sessions").where({ table_id }).first()

            if (sessions && !sessions.closed_at) {
                throw new AppError("Essa mesa já está aberta")
            }

            await knex<TableSessionsRepository>("tables_sessions").insert({ table_id, opened_at: knex.fn.now() })

            return res.status(201).json()
        } catch (error) {
            next(error)
        }
    }

    async index(req: Request, res: Response, next: NextFunction) {
        try {
            const sessions = await knex<TableSessionsRepository>("tables_sessions").select().orderBy("closed_at")
            return res.json(sessions)
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

            const sessions = await knex<TableSessionsRepository>("tables_sessions").select().where({ id }).first()
            
            if (!sessions) {
                throw new AppError("Essa mesa não está aberta")
            }

            if (sessions.closed_at) {
                throw new AppError("Essa mesa já está fechada ")
            }

            await knex<TableSessionsRepository>("tables_sessions").update({ closed_at: knex.fn.now() }).where({ id })

            return res.json()
        } catch (error) {
            next(error)
        }
    }
}

export { TableSessions }