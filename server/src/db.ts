import { Prisma, PrismaClient } from "@prisma/client";
export type * as EntityType from "@prisma/client";
import bcrypt from "bcrypt";
const db = new PrismaClient();

db.$use(async (params, next) => {
  if (params.model == "User" && params.action == "create") {
    const salt = await bcrypt.genSalt(
      process.env.NODE_ENV == "development" ? 5 : 10
    );
    params.args.data.password = await bcrypt.hash(
      params.args.data.password,
      salt
    );
    let res = await next(params);
    return res;
  }
  return next(params);
});

export { db };
