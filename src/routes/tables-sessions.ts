import { Router } from "express";
import { TableSessions } from "../controller/tables-sessions-controller"

const tableSessions = Router()
const tableSessionsController = new TableSessions()

tableSessions.post("/", tableSessionsController.create)
tableSessions.get("/", tableSessionsController.index)
tableSessions.put("/:id", tableSessionsController.update)

export { tableSessions }