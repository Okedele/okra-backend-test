import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  getUserStats,
  updateUser,
} from "../controllers/user.controller";

// Users layout Route
const userRoute = Router();

userRoute.post("", createUser);

userRoute.get("", getUsers);

userRoute.get("/stats", getUserStats);

userRoute.get("/:userId", getUser);

userRoute.patch("/:userId", updateUser);

userRoute.delete("/:userId", deleteUser);


export default userRoute;
