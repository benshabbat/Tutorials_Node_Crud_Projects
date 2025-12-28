import express from "express";
import { readUsers } from "./utils/crudFs.js";

import "dotenv/config.js";

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  res.send(await readUsers());
});

app.post("/users", async (req, res) => {
  const newUser = req.body;
  const users = await readUsers();
  users.push(newUser);
  await fs.writeFile("./users.json", JSON.stringify(users));
  res.status(201).send(newUser);
});
