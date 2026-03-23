import { NextResponse } from "next/server";
import { Order } from "../../_models/orders";
import { sequelize } from "../../_database/config";

export async function POST() {
  try {
    await sequelize.sync({ alter: true });

    const orders = await Order.findAll();
    let updated = 0;

    for (const order of orders) {
      const productId = order.getDataValue("productId");
      const quantity = order.getDataValue("quantity");
      const items = order.getDataValue("items");

      if ((productId || quantity) && items) {
        await order.update({ productId: null, quantity: null });
        updated++;
      }
    }

    return NextResponse.json(
      { success: true, message: "Cleaned obsolete fields", count: updated },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error cleaning orders:", message);
    return NextResponse.json(
      { success: false, error: "Failed to clean", details: message },
      { status: 500 }
    );
  }
}
