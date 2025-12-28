import { readUsers ,writeUser} from "../utils/crudFs.js";

export const getUsers = async (req, res) => {
  res.send(await readUsers());
};

export const createUser = async (req, res) => {
  const newUser = req.body;
  const users = await readUsers();
  users.push(newUser);
  await writeUser(users);
  res.status(201).send(newUser);
};
