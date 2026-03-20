import { UserType, UUID } from "../_helpers/types";
import { AppError } from "../_helpers/api-error";
import UserService from "../_services/userService";

export async function getUserData(email: string): Promise<UserType> {
  const cleanEmail = email.trim().toLowerCase();
  const userService = new UserService();
  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    throw new AppError("User not found", 404, { code: "user_not_found" });
  }
  return user.toJSON() as UserType;
}

export async function updateUserData(
  newData: Partial<UserType>,
  email: string,
): Promise<UserType> {
  const cleanEmail = email.trim().toLowerCase();
  const userService = new UserService();
  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    throw new AppError("User not found", 404, { code: "user_not_found" });
  }
  const updated = await userService.updateUser(
    user.getDataValue("id") as UUID,
    newData,
  );
  if (!updated) {
    throw new AppError("Failed to update user", 500, { code: "update_failed" });
  }
  const refreshed = await userService.getUserById(user.getDataValue("id") as UUID);
  if (!refreshed) {
    throw new AppError("User not found after update", 404, { code: "user_not_found" });
  }
  return refreshed.toJSON() as UserType;
}

export async function getUserOrders(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const userService = new UserService();
  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    throw new AppError("User not found", 404, { code: "user_not_found" });
  }
  const orders = await userService.getUserOrders(
    user.getDataValue("id") as UUID,
  );
  return orders;
}
