import { UserType, UUID } from "../_helpers/types";
import UserService from "../_services/userService";

export async function getUserData(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const userService = new UserService();
  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    return null;
  }
  return user;
}

export async function updateUserData(
  newData: Partial<UserType>,
  email: string
) {
  const cleanEmail = email.trim().toLowerCase();
  const userService = new UserService();
  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    return null;
  }
  const updateUser = await userService.updateUser(user.id as UUID, newData);
  return updateUser;
}

export async function getUserOrders(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const userService = new UserService();
  const user = await userService.getUserByEmail(cleanEmail);
  if (!user) {
    return null;
  }
  const orders = await userService.getUserOrders(user.id as UUID);
  if (!orders) {
    return null;
  }
  return orders;
}
