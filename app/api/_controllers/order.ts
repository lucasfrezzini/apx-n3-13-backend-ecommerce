import { OrderType, UUID } from "../_helpers/types";
import { AppError } from "../_helpers/api-error";
import OrderService from "../_services/orderService";

/**
 * Crea una nueva orden.
 * @throws AppError si la creación falla
 */
export async function createOrder(order: OrderType) {
  const orderService = new OrderService();
  const newOrder = await orderService.createOrder(order as any);
  if (!newOrder) {
    throw new AppError("Failed to create order", 500, { code: "order_create_failed" });
  }
  return newOrder.toJSON() as OrderType;
}

/**
 * Obtiene una orden por su ID.
 * @throws AppError si no se encuentra la orden
 */
export async function getOrder(id: UUID) {
  const orderService = new OrderService();
  const order = await orderService.getOrderById(id);
  if (!order) {
    throw new AppError("Order not found", 404, { code: "order_not_found" });
  }
  return order.toJSON() as OrderType;
}