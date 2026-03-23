import { NextResponse } from "next/server";
import { Order } from "../../_models/orders";
import { sequelize } from "../../_database/config";

export async function POST() {
  try {
    await sequelize.sync({ alter: true });

    await sequelize.query("DROP TABLE IF EXISTS \"Orders\"");
    await sequelize.sync({ force: true });

    return NextResponse.json(
      { success: true, message: "Orders table reset" },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error resetting orders:", message);
    return NextResponse.json(
      { success: false, error: "Failed to reset", details: message },
      { status: 500 }
    );
  }
}
