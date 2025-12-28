import express from "express";
import { createUser, getUsers } from "../controllers/usersControllers.js";

const router = express.Router();

router.route("/")
.get(getUsers)
.post(createUser);

export default router;
