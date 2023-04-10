import { AxiosResponse } from "axios";
import { add, getTime } from "date-fns";
import API from "../api";
import { z } from "zod";
import { EntityType } from "../../../server/src/db";

export type SignedUser = EntityType.User & {
  token: string;
  jwt_created_at: number;
  jwt_expired_at: number;
};

export const getUser = () => {
  const user = JSON.parse(localStorage.getItem("user") as string) as SignedUser;
  if (!user || Date.now() > user.jwt_expired_at) {
    return null;
  } else if (user) {
    return user;
  }
};

const loginUser = async (loginData: { email: string; password: string }) => {
  const {
    data: { name, id, email, token, role },
  } = await API.post("/user/auth/login", loginData);

  let user = {
    name: name,
    id,
    email,
    role,
    token: token,
    jwt_created_at: Date.now(),
    jwt_expired_at: getTime(add(Date.now(), { days: 29 })),
  };

  localStorage.setItem("user", JSON.stringify(user));
  return user;
};

export const signup = async (
  signinData: Pick<SignedUser, "email" | "name" | "password">
) => {
  let { data } = await API.post<EntityType.User>(
    "/user/auth/signup",
    signinData
  );

  return data;
};

export const login = async (loginData: { email: string; password: string }) => {
  let user = await loginUser(loginData);
  return user;
};

export const logOut = () => localStorage.removeItem("user");
