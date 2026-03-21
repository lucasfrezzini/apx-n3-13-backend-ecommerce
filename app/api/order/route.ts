import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "../_middlewares/authMiddleware";
import { Order } from "../_models/orders";
import { Product } from "../_models/products";
import { User } from "../_models/users";
import { sequelize } from "../_database/config";
import { orderSchema } from "../_schemas/orderSchema";
import { handleRoute, AppError } from "../_helpers/api-error";
import { createMercadoPagoPreference } from "../_helpers/mercado-pago";

export async function POST(req: NextRequest) {
  return handleRoute(async () => {
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse;
    }

    const authUser = authResponse as { email?: string; userId?: string };
    console.log("AuthUser", authUser);

    const userId = authUser.userId as string | undefined;
    const userEmail = authUser.email as string | undefined;

    if (!userId || !userEmail) {
      throw new AppError("Invalid user in token", 401, {
        code: "unauthorized",
      });
    }

    const body = await req.json();
    const { orderData } = body;
    if (!orderData) {
      throw new AppError("Order data is required", 400, {
        code: "validation_error",
      });
    }

    console.log("OrderData", orderData);

    const validation = orderSchema.safeParse(orderData);
    if (!validation.success) {
      throw new AppError("Invalid order data", 400, {
        code: "validation_error",
        details: validation.error.flatten().fieldErrors,
      });
    }

    const parsed = validation.data;
    const items = parsed.items?.length
      ? parsed.items
      : [{ productId: parsed.productId!, quantity: parsed.quantity! }];

    const orderItems = [] as Array<{
      productId: string;
      quantity: number;
      price: number;
      name: string;
    }>;

    let totalPrice = 0;

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        throw new AppError(`Product ${item.productId} not found`, 404, {
          code: "product_not_found",
        });
      }
      const stock = product.getDataValue("stock") as number;
      const priceRaw = product.getDataValue("price");
      const price = Number(priceRaw);
      if (Number.isNaN(price) || price <= 0) {
        throw new AppError(
          `Product ${product.getDataValue("id")} has invalid price`,
          500,
          {
            code: "invalid_product_price",
          },
        );
      }
      if (stock < item.quantity) {
        throw new AppError(
          `Product ${product.getDataValue("id")} has not enough stock`,
          400,
          { code: "insufficient_stock" },
        );
      }
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price,
        name: product.getDataValue("name") as string,
      });
      totalPrice += price * item.quantity;
    }

    if (orderItems.length === 0) {
      throw new AppError("No order items provided", 400, {
        code: "validation_error",
      });
    }

    // Asegurar que la tabla Orders está actualizada con la columna items.
    // await Order.sync({ alter: true });

    const createdOrder = await sequelize.transaction(async (transaction) => {
      for (const item of orderItems) {
        const product = await Product.findByPk(item.productId, { transaction });
        if (!product) {
          throw new AppError(`Product ${item.productId} not found`, 404, {
            code: "product_not_found",
          });
        }
        const stock = product.getDataValue("stock") as number;
        if (stock < item.quantity) {
          throw new AppError(
            `Product ${item.productId} has not enough stock`,
            400,
            { code: "insufficient_stock" },
          );
        }
        await product.update({ stock: stock - item.quantity }, { transaction });
      }

      const newOrder = await Order.create(
        {
          userId,
          productId: orderItems.length === 1 ? orderItems[0].productId : null,
          quantity: orderItems.length === 1 ? orderItems[0].quantity : null,
          items: orderItems,
          totalPrice,
          status: "pending",
          shippingAddress: parsed.shippingAddress ?? null,
        },
        { transaction },
      );

      return newOrder;
    });

    const mpItems = orderItems.map((item) => ({
      title: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "ARS",
      description: `Item ${item.productId}`,
    }));

    const preference = await createMercadoPagoPreference(
      mpItems,
      userEmail,
      createdOrder.getDataValue("id") as string,
    );

    const paymentUrl = preference.sandbox_init_point || preference.init_point;

    await createdOrder.update({
      paymentUrl,
      paymentId: preference.id,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Checkout created",
        order: createdOrder.toJSON(),
        paymentUrl,
        paymentId: preference.id,
      },
      { status: 201 },
    );
  });
}
