// server/routes/userRoutes.js
import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
} from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/logout", logoutUser);

export default router;
