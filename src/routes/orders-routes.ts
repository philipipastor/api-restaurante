import { Router } from "express";
import { OrdersController } from "../controller/orders-controller";

const ordersRoutes = Router()
const ordersController = new OrdersController()

ordersRoutes.post("/", ordersController.create)
ordersRoutes.get("/sessions/:table_session_id", ordersController.index)
ordersRoutes.get("/sessions/:table_session_id/total", ordersController.show)

export { ordersRoutes }