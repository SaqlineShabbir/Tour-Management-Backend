import type { IUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (payload: Partial<IUser>) => {
  const { name, email } = payload;

  const user = await User.create({
    name: name,
    email: email,
  });

  return user;
};

const getAllUsers = async () => {
  const users = await User.find();

  return {
    data: users,
    meta: {
      total: users.length,
    },
  };
};

export const userServices = {
  createUser,
  getAllUsers,
};
