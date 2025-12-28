import express from "express";
import usersRoutes from "./routes/usersRoutes.js";
import "dotenv/config.js";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", usersRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});