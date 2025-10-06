import { OrderType, UUID } from "../_helpers/types";
import OrderService from "../_services/orderService";

export async function createOrder(order: OrderType) {
  const orderService = new OrderService();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newOrder = await orderService.createOrder(order as any);
  if (!newOrder) {
    return null;
  }
  return newOrder;
}

export async function getOrder(id: UUID) {
  const orderService = new OrderService();
  const order = await orderService.getOrderById(id);
  if (!order) {
    return null;
  }
  return order;
}
