import express, { NextFunction, Request, Response } from "express";
import { db } from "./db";
import userRouter from "./user/user.router";
import postRouter from "./post/post.router";
import categoryRouter from "./category/category.router";
import tagRouter from "./tag/tag.router";
import path from "path";
import cors from "cors";
const app = express();

app.use(express.static("./static"));

app.use(cors());

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/tags", tagRouter);

app.get("*", function (req, res) {
  res.sendFile("index.html", { root: path.join(__dirname, "../static/") });
});

app.all("*", (req, res) => {
  return res.status(404).json({ message: "route not found" });
});

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  return res.status(500).json({ message: "internal server error" });
});
const PORT = (process.env.PORT as unknown as number) || 3000;
const main = async () => {
  try {
    const server = app.listen(PORT, () => {
      console.log(`Server ready at: http://localhost:${PORT}`);
    });
  } catch (e: any) {
    console.error(e.message);
    await db.$disconnect();
    process.exit(1);
  }
};
main();

process.on("unhandledRejection", (reason: Error | any) => {
  console.log(`unhandledRejection: ${reason.message || reason}`);
});

process.on("uncaughtException", (err: Error) => {
  console.log(`uncaughtException: ${err.message}`);
});
